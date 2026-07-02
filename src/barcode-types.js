const UNSUPPORTED_TYPES = new Set([
  "GRIDMATRIX",
  "KOREAPOST",
  "UPNQR",
  "VIN"
]);

const SYMBLOGY_TO_BWIP = {
  AUSPOST: "auspost",
  AUSREDIRECT: "auspost",
  AUSREPLY: "auspost",
  AUSROUTE: "auspost",
  AZRUNE: "aztecrune",
  AZTEC: "azteccode",
  C25IATA: "iata2of5",
  C25IND: "industrial2of5",
  C25INTER: "interleaved2of5",
  C25LOGIC: "datalogic2of5",
  C25MATRIX: "matrix2of5",
  CHANNEL: "channelcode",
  CODABAR: "rationalizedCodabar",
  CODABLOCKF: "codablockf",
  CODE11: "code11",
  CODE128: "code128",
  CODE128B: "code128",
  CODE16K: "code16k",
  CODE32: "code32",
  CODE39: "code39",
  CODE49: "code49",
  CODE93: "code93",
  CODEONE: "codeone",
  DAFT: "daft",
  DATAMATRIX: "datamatrix",
  DOTCODE: "dotcode",
  DPIDENT: "identcode",
  DPLEIT: "leitcode",
  EAN128: "gs1-128",
  EAN128_CC: "gs1-128composite",
  EAN14: "ean14",
  EANX: "ean13",
  EANX_CC: "ean13composite",
  EANX_CHK: "ean13",
  EXCODE39: "code39ext",
  FIM: "flattermarken",
  FLAT: "flattermarken",
  HANXIN: "hanxin",
  HIBC_128: "hibccode128",
  HIBC_39: "hibccode39",
  HIBC_AZTEC: "hibcazteccode",
  HIBC_DM: "hibcdatamatrix",
  HIBC_MICPDF: "hibcmicropdf417",
  HIBC_PDF: "hibcpdf417",
  HIBC_QR: "hibcqrcode",
  ISBNX: "isbn",
  ITF14: "itf14",
  JAPANPOST: "japanpost",
  KIX: "kix",
  LOGMARS: "code39",
  MAILMARK: "mailmark",
  MAXICODE: "maxicode",
  MICROPDF417: "micropdf417",
  MICROQR: "microqrcode",
  MSI_PLESSEY: "msi",
  NVE18: "sscc18",
  ONECODE: "onecode",
  PDF417: "pdf417",
  PDF417TRUNC: "pdf417compact",
  PHARMA: "pharmacode",
  PHARMA_TWO: "pharmacode2",
  PLANET: "planet",
  PLESSEY: "plessey",
  POSTNET: "postnet",
  PZN: "pzn",
  QRCODE: "qrcode",
  RM4SCC: "royalmail",
  RSS14: "databaromni",
  RSS14STACK: "databarstacked",
  RSS14STACK_CC: "databarstackedcomposite",
  RSS14STACK_OMNI: "databarstackedomni",
  RSS14_CC: "databaromnicomposite",
  RSS14_OMNI_CC: "databarstackedomnicomposite",
  RSS_EXP: "databarexpanded",
  RSS_EXPSTACK: "databarexpandedstacked",
  RSS_EXPSTACK_CC: "databarexpandedstackedcomposite",
  RSS_EXP_CC: "databarexpandedcomposite",
  RSS_LTD: "databarlimited",
  RSS_LTD_CC: "databarlimitedcomposite",
  TELEPEN: "telepen",
  TELEPEN_NUM: "telepennumeric",
  ULTRA: "ultracode",
  UPCA: "upca",
  UPCA_CC: "upcacomposite",
  UPCA_CHK: "upca",
  UPCE: "upce",
  UPCE_CC: "upcecomposite",
  UPCE_CHK: "upce"
};

function normalizeBarcodeType(type) {
  return String(type || "code128").toUpperCase();
}

function resolveBarcodeType(type) {
  const normalized = normalizeBarcodeType(type);

  if (UNSUPPORTED_TYPES.has(normalized)) {
    throw new Error(`Unsupported barcode type: ${normalized}`);
  }

  const bcid = SYMBLOGY_TO_BWIP[normalized];
  if (!bcid) {
    throw new Error(`Unsupported barcode type: ${normalized}`);
  }

  return bcid;
}

function listSupportedSymbologyTypes() {
  return Object.keys(SYMBLOGY_TO_BWIP).sort();
}

function listUnsupportedSymbologyTypes() {
  return [...UNSUPPORTED_TYPES].sort();
}

module.exports = {
  UNSUPPORTED_TYPES,
  SYMBLOGY_TO_BWIP,
  normalizeBarcodeType,
  resolveBarcodeType,
  listSupportedSymbologyTypes,
  listUnsupportedSymbologyTypes
};
