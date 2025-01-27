
// const escInitQzTray = "\x1B\x69\x61\x00\x1B\x40"; // set printer to ESC/P mode and clear memory buffer ; Inicializa la impresora
// const lineSpacing = "\x1B\x33\x18"; // Espaciado de línea (1/6 de pulgada)
// const lineSpacing2 = "\x1B\x33\x24"; // ESC 3 n (1/9 de pulgada)
// const fontSelection = "\x1B\x4D"; // Fuente pequeña (Condensed)
// const escBold = "\x1B\x45"; // Activa negrita
// const escCancelBold = "\x1B\x46"; // Cancela negrita
// const escNewLine = "\n"; // Nueva línea
// const escCut = "\x1D\x56\x00"; // Corte de papel
// const escEject = "\x0C"; // Form Feed (FF) - Expulsa la hoja
// const escCondensed = "\x1B\x0F"; // Modo comprimido (17 cpi)

function escInitQzTray(engine) {
  this.registerTag("escInitQzTray", {
    parse: function(tagToken, remainTokens) {
    },
    render: async function(ctx) {
      return "\\x1B\\x69\\x61\\x00\\x1B\\x40";
    }
  });
}

function lineSpacing(engine) {
  this.registerTag("lineSpacing", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\\x1B\\x33\\x18";
    }
  });
}

function lineSpacing2(engine) {
  this.registerTag("lineSpacing2", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\\x1B\\x33\\x24";
    }
  });
}

function fontSelection(engine) {
  this.registerTag("fontSelection", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\\x1B\\x4D";
    }
  });
}

function escBold(engine) {
  this.registerTag("escBold", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\\x1B\\x45";
    }
  });
}

function escCancelBold(engine) {
  this.registerTag("escCancelBold", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\\x1B\\x46";
    }
  });
}

function escNewLine(engine) {
  this.registerTag("escNewLine", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\\n";
    }
  });
}

function escCut(engine) {
  this.registerTag("escCut", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\\x1D\\x56\\x00";
    }
  });
}

function escEject(engine) {
  this.registerTag("escEject", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\\x0C";
    }
  });
}

function escCondensed(engine) {
  this.registerTag("escCondensed", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\\x1B\\x0F";
    }
  });
}

module.exports = {
  escInitQzTray,
  lineSpacing,
  lineSpacing2,
  fontSelection,
  escBold,
  escCancelBold,
  escNewLine,
  escCut,
  escEject,
  escCondensed
}