const assert = require("node:assert/strict");
const {describe, it} = require("node:test");
const SYMBOLOGY_TYPE_NAMES = require("./fixtures/symbology-type-names.js");
const {
  resolveBarcodeType,
  listSupportedSymbologyTypes,
  listUnsupportedSymbologyTypes,
  UNSUPPORTED_TYPES,
  SYMBLOGY_TO_BWIP
} = require("../src/barcode-types.js");

describe("barcode-types.js", () => {
  it("should map every symbology enum name except unsupported ones", () => {
    const expectedSupported = SYMBOLOGY_TYPE_NAMES
      .filter((type) => !UNSUPPORTED_TYPES.has(type))
      .sort();

    assert.deepStrictEqual(listSupportedSymbologyTypes(), expectedSupported);
  });

  it("should expose unsupported symbology formats", () => {
    assert.deepStrictEqual(listUnsupportedSymbologyTypes(), [
      "GRIDMATRIX",
      "KOREAPOST",
      "UPNQR",
      "VIN"
    ]);
  });

  it("should resolve known aliases to bwip-js bcid values", () => {
    assert.equal(resolveBarcodeType("code128"), "code128");
    assert.equal(resolveBarcodeType("CODE11"), "code11");
    assert.equal(resolveBarcodeType("qrcode"), "qrcode");
    assert.equal(resolveBarcodeType("EAN128"), "gs1-128");
    assert.equal(resolveBarcodeType("RM4SCC"), "royalmail");
  });

  it("should throw for unsupported symbology formats", () => {
    for (const type of listUnsupportedSymbologyTypes()) {
      assert.throws(
        () => resolveBarcodeType(type),
        (err) => err.message === `Unsupported barcode type: ${type}`
      );
    }
  });

  it("should throw for unknown symbology formats", () => {
    assert.throws(
      () => resolveBarcodeType("not-a-real-format"),
      /Unsupported barcode type: NOT-A-REAL-FORMAT/
    );
  });

  it("should map every supported symbology type to a non-empty bcid", () => {
    for (const type of listSupportedSymbologyTypes()) {
      const bcid = SYMBLOGY_TO_BWIP[type];
      assert.ok(bcid, `Expected bcid mapping for ${type}`);
      assert.equal(typeof bcid, "string");
    }
  });
});
