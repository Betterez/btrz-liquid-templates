const bwipjs = require("bwip-js");
const {resolveBarcodeType} = require("../../src/barcode-types.js");

async function generateBwipTestPng({type, content, height = 30, bwipOptions = {}}) {
  const bcid = resolveBarcodeType(type);
  const pngBuffer = await bwipjs.toBuffer({
    bcid,
    text: String(content),
    scale: 2,
    height: Number(height) || 30,
    includetext: false,
    backgroundcolor: "FFFFFF",
    ...bwipOptions
  });

  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}

module.exports = {
  generateBwipTestPng
};
