const {PNG} = require("pngjs");
const {scanImageData} = require("@undecaf/zbar-wasm");

async function decodePngDataUri(dataUri) {
  const base64 = dataUri.replace(/^data:image\/png;base64,/, "");
  const png = PNG.sync.read(Buffer.from(base64, "base64"));
  const symbols = await scanImageData({
    data: png.data,
    width: png.width,
    height: png.height
  });

  if (!symbols.length) {
    throw new Error("No barcode detected in PNG data URI");
  }

  return symbols[0].decode();
}

function isValidPngDataUri(dataUri) {
  const base64 = dataUri.replace(/^data:image\/png;base64,/, "");
  const signature = Buffer.from(base64, "base64").subarray(0, 8);
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return signature.equals(pngSignature);
}

module.exports = {
  decodePngDataUri,
  isValidPngDataUri
};
