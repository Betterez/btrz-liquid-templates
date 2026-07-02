const assert = require("node:assert/strict");
const {describe, it} = require("node:test");
const {Barcode} = require("../src/barcode.js");

describe("barcode tag parse", () => {
  it("should use safe defaults when args are malformed", () => {
    let barcodeTag;
    const engine = {
      registerTag: (name, tagDefinition) => {
        assert.equal(name, "barcode");
        barcodeTag = tagDefinition;
      }
    };

    Barcode.call(engine);

    const parseContext = {};
    assert.doesNotThrow(() => {
      barcodeTag.parse.call(parseContext, {args: {}}, []);
    });

    assert.equal(parseContext.content, "not-content-given");
    assert.equal(parseContext.type, "code128");
    assert.equal(parseContext.height, 30);
    assert.equal(parseContext.width, 200);
    assert.equal(parseContext.margin, "0,0,0,0");
  });
});
