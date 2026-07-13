const bwipjs = require("bwip-js");
const {resolveBarcodeType} = require("./barcode-types.js");

const SQUARE_BCIDS = new Set([
  "qrcode",
  "microqrcode",
  "datamatrix",
  "azteccode",
  "aztecrune",
  "hanxin",
  "maxicode",
  "hibcqrcode",
  "hibcdatamatrix",
  "hibcazteccode",
  "codeone"
]);

async function generateBarcodePng({type, content, height}) {
  const bcid = resolveBarcodeType(type);
  const opts = {
    bcid,
    text: String(content),
    scale: 2,
    includetext: false,
    backgroundcolor: "FFFFFF"
  };

  // Linear (and rectangular 2D) barcodes: height is bar/module height in mm.
  // Square matrix codes: omit height so bwip keeps a 1:1 PNG; display size
  // is controlled by the image width in the document definition.
  if (!SQUARE_BCIDS.has(bcid)) {
    opts.height = Number(height) || 30;
  }

  const pngBuffer = await bwipjs.toBuffer(opts);
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}

module.exports = {
  generateBarcodePng
};
