const assert = require("node:assert/strict");
const {describe, it} = require("node:test");
const {generateBarcodePng} = require("../src/barcode-generator.js");
const {
  decodePngDataUri,
  isValidPngDataUri,
  getPngDimensionsFromDataUri
} = require("./helpers/barcode-decode.js");

describe("barcode-generator.js", () => {
  it("should generate a valid PNG data URI for code128", async () => {
    const image = await generateBarcodePng({
      type: "code128",
      content: "1234",
      height: 10
    });

    assert.match(image, /^data:image\/png;base64,/);
    assert.equal(isValidPngDataUri(image), true);
  });

  it("should keep qrcode PNGs square when a height is provided", async () => {
    const image = await generateBarcodePng({
      type: "qrcode",
      content: "test-payload",
      height: 50
    });

    const {width, height} = getPngDimensionsFromDataUri(image);
    assert.equal(width, height);
  });

  it("should apply height to linear barcodes so taller height produces a taller PNG", async () => {
    const shortImage = await generateBarcodePng({
      type: "code128",
      content: "1234",
      height: 10
    });
    const tallImage = await generateBarcodePng({
      type: "code128",
      content: "1234",
      height: 50
    });

    const short = getPngDimensionsFromDataUri(shortImage);
    const tall = getPngDimensionsFromDataUri(tallImage);
    assert.ok(tall.height > short.height);
  });

  it("should decode generated code128 barcodes to the original payload", async () => {
    const image = await generateBarcodePng({
      type: "code128",
      content: "1234",
      height: 10
    });

    assert.equal(await decodePngDataUri(image), "1234");
  });

  it("should decode generated eanx barcodes to the original payload", async () => {
    const image = await generateBarcodePng({
      type: "eanx",
      content: "5901234123457",
      height: 10
    });

    assert.equal(await decodePngDataUri(image), "5901234123457");
  });

  it("should reject unsupported symbology formats", async () => {
    await assert.rejects(
      () => generateBarcodePng({type: "gridmatrix", content: "1234", height: 10}),
      /Unsupported barcode type: GRIDMATRIX/
    );
  });
});
