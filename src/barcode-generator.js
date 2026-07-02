const bwipjs = require("bwip-js");
const {resolveBarcodeType} = require("./barcode-types.js");

async function generateBarcodePng({type, content, height}) {
  const bcid = resolveBarcodeType(type);
  const pngBuffer = await bwipjs.toBuffer({
    bcid,
    text: String(content),
    scale: 2,
    height: Number(height) || 30,
    includetext: false,
    backgroundcolor: "FFFFFF"
  });

  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}

module.exports = {
  generateBarcodePng
};
