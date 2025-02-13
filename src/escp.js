function escInitQzTray(engine) {
  this.registerTag("escInitQzTray", {
    parse: function(tagToken, remainTokens) {
    },
    render: async function(ctx) {
      return "\x1B\x69\x61\x00\x1B\x40";
    }
  });
}

function lineSpacing(engine) {
  this.registerTag("lineSpacing", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\x1B\x33\x18";
    }
  });
}

function lineSpacing2(engine) {
  this.registerTag("lineSpacing2", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\x1B\x33\x24";
    }
  });
}

function fontSelection(engine) {
  this.registerTag("fontSelection", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\x1B\x4D";
    }
  });
}

function escBold(engine) {
  this.registerTag("escBold", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\x1B\x45";
    }
  });
}

function escCancelBold(engine) {
  this.registerTag("escCancelBold", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\x1B\x46";
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
      return "\x1D\x56\x00";
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
      return "\x1B\x0F";
    }
  });
}

function escTab(engine) {
  this.registerTag("escTab", {
    parse: function(tagToken, remainTokens) {

    },
    render: async function(ctx) {
      return "\x09";
    }
  });
}

function escHPos(engine) {
  this.registerTag("escHPos", {
    parse: function(tagToken, remainTokens) {
      try {
        const args = (tagToken.args || "").split(" ");
        this.position = args[0] || 0;
      } catch (err) {
        this.position = args[0] || 0;
      }
    },
    render: async function(ctx) {
      try {
        const nL = String.fromCharCode(this.position & 0xFF);
        const nH = String.fromCharCode((this.position >> 8) & 0xFF);
        const escMoveCursor = "\x1B\x24" + nL + nH;
        return escMoveCursor;
      } catch (e) {
        return "PNA";
      }
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
  escCondensed,
  escTab,
  escHPos
}