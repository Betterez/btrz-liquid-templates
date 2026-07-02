#!/usr/bin/env node
/**
 * One-time maintenance script: requires symbology@4.0.2 (npm i -D symbology@4.0.2).
 * Generates legacy PNG fixtures for every supported barcode type.
 *
 * Usage: node test/fixtures/generate-legacy-barcodes.js
 */
const fs = require("node:fs");
const path = require("node:path");
const bwipjs = require("bwip-js");
const {SymbologyType, createStream, OutputType} = require("symbology");
const {scanImageData} = require("@undecaf/zbar-wasm");
const {PNG} = require("pngjs");
const {listSupportedSymbologyTypes, resolveBarcodeType} = require("../../src/barcode-types.js");
const SAMPLE_CONTENT = require("./barcode-sample-content.js");

const FIXTURE_DIR = path.join(__dirname, "legacy-barcodes");
const HEIGHT = 30;

function slug(value) {
  return String(value).replace(/[^a-zA-Z0-9]+/g, "_").slice(0, 40);
}

async function tryDecodePngBuffer(pngBuffer) {
  const png = PNG.sync.read(pngBuffer);
  const symbols = await scanImageData({
    data: png.data,
    width: png.width,
    height: png.height
  });
  return symbols.length ? symbols[0].decode() : null;
}

async function generateLegacyPng(type, content) {
  const symbologyType = SymbologyType[type];
  if (!symbologyType) {
    throw new Error(`Symbology enum missing for ${type}`);
  }

  const result = await createStream({
    symbology: symbologyType,
    height: HEIGHT,
    showHumanReadableText: false,
    scale: 2.0
  }, String(content), OutputType.PNG);

  const base64 = result.data.replace(/^data:image\/png;base64,/, "");
  return Buffer.from(base64, "base64");
}

async function generateBwipPng(type, content, bwipOptions = {}) {
  const bcid = resolveBarcodeType(type);
  return bwipjs.toBuffer({
    bcid,
    text: String(content),
    scale: 2,
    height: HEIGHT,
    includetext: false,
    backgroundcolor: "FFFFFF",
    ...bwipOptions
  });
}

async function main() {
  fs.mkdirSync(FIXTURE_DIR, {recursive: true});

  const manifest = [];
  const failures = [];

  for (const type of listSupportedSymbologyTypes()) {
    const sample = SAMPLE_CONTENT[type];
    if (!sample) {
      failures.push({type, stage: "sample-content", error: "Missing sample content"});
      continue;
    }

    const legacyContent = sample.content;
    const bwipContent = sample.bwipContent || sample.content;
    const bwipOptions = sample.bwipOptions || {};
    const filename = `${type.toLowerCase()}-${slug(legacyContent)}.png`;
    const entry = {
      type: type.toLowerCase(),
      content: legacyContent,
      bwipContent,
      bwipOptions,
      height: HEIGHT
    };

    let legacyBuffer = null;
    try {
      legacyBuffer = await generateLegacyPng(type, legacyContent);
      fs.writeFileSync(path.join(FIXTURE_DIR, filename), legacyBuffer);
      entry.file = filename;
      entry.legacyGenerated = true;
      process.stdout.write("L");
    } catch (error) {
      entry.legacyGenerated = false;
      entry.legacyError = error.message || String(error);
      process.stdout.write("l");
    }

    try {
      const bwipBuffer = await generateBwipPng(type, bwipContent, bwipOptions);
      entry.bwipGenerated = true;
      process.stdout.write("B");

      if (legacyBuffer) {
        entry.legacyDecoded = await tryDecodePngBuffer(legacyBuffer);
        entry.bwipDecoded = await tryDecodePngBuffer(bwipBuffer);
        entry.decodable = entry.legacyDecoded !== null
          && entry.bwipDecoded !== null
          && entry.legacyDecoded === entry.bwipDecoded;
      } else {
        entry.bwipDecoded = await tryDecodePngBuffer(bwipBuffer);
        entry.decodable = entry.bwipDecoded !== null;
      }
    } catch (error) {
      entry.bwipGenerated = false;
      entry.bwipError = error.message || String(error);
      failures.push({type, stage: "bwip", error: entry.bwipError});
      process.stdout.write("b");
    }

    manifest.push(entry);
    process.stdout.write(" ");
  }

  process.stdout.write("\n");
  manifest.sort((a, b) => a.type.localeCompare(b.type));
  fs.writeFileSync(
    path.join(FIXTURE_DIR, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`
  );

  fs.writeFileSync(
    path.join(FIXTURE_DIR, "generation-failures.json"),
    `${JSON.stringify(failures, null, 2)}\n`
  );

  const legacyCount = manifest.filter((entry) => entry.legacyGenerated).length;
  const bwipCount = manifest.filter((entry) => entry.bwipGenerated).length;
  const decodableCount = manifest.filter((entry) => entry.decodable).length;

  console.log(`Manifest entries: ${manifest.length}`);
  console.log(`Legacy fixtures: ${legacyCount}`);
  console.log(`Bwip generated: ${bwipCount}`);
  console.log(`Decodable pairs: ${decodableCount}`);
  console.log(`Bwip failures: ${failures.length}`);

  if (failures.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
