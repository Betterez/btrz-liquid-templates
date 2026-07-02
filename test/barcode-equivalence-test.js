const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {describe, it} = require("node:test");
const {listSupportedSymbologyTypes} = require("../src/barcode-types.js");
const {decodePngDataUri, isValidPngDataUri} = require("./helpers/barcode-decode.js");
const {generateBwipTestPng} = require("./helpers/generate-bwip-test-png.js");

const FIXTURE_DIR = path.join(__dirname, "fixtures/legacy-barcodes");
const manifest = JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, "manifest.json"), "utf8"));
const manifestByType = new Map(manifest.map((entry) => [entry.type, entry]));

function legacyFixtureToDataUri(filename) {
  const pngBuffer = fs.readFileSync(path.join(FIXTURE_DIR, filename));
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}

describe("barcode equivalence", () => {
  it("should include a manifest entry for every supported symbology type", () => {
    for (const type of listSupportedSymbologyTypes()) {
      assert.ok(manifestByType.has(type.toLowerCase()), `Missing manifest entry for ${type}`);
    }
    assert.equal(manifest.length, listSupportedSymbologyTypes().length);
  });

  for (const testCase of manifest) {
    it(`should support ${testCase.type} with bwip-js`, async () => {
      const nextImage = await generateBwipTestPng({
        type: testCase.type,
        content: testCase.bwipContent || testCase.content,
        height: testCase.height,
        bwipOptions: testCase.bwipOptions || {}
      });

      assert.match(nextImage, /^data:image\/png;base64,/);
      assert.equal(isValidPngDataUri(nextImage), true);
      assert.equal(testCase.bwipGenerated, true);
    });

    if (testCase.legacyGenerated) {
      it(`should match legacy ${testCase.type} decoded payload when scannable`, async () => {
        const legacyImage = legacyFixtureToDataUri(testCase.file);
        const nextImage = await generateBwipTestPng({
          type: testCase.type,
          content: testCase.bwipContent || testCase.content,
          height: testCase.height,
          bwipOptions: testCase.bwipOptions || {}
        });

        if (!testCase.decodable) {
          assert.equal(isValidPngDataUri(legacyImage), true);
          assert.equal(isValidPngDataUri(nextImage), true);
          return;
        }

        const legacyDecoded = await decodePngDataUri(legacyImage);
        const nextDecoded = await decodePngDataUri(nextImage);

        assert.equal(nextDecoded, legacyDecoded);
      });
    }
  }
});
