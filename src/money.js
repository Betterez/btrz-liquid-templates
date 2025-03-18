const formatter = require("btrz-formatter");
function getCurrencyValue(item, propName, providerPreferences, userOptions) {
  const defaultOptions = {
    prefix: "displayCurrency"
  };
  const options = Object.assign({}, defaultOptions, userOptions);
  const prefix = options.prefix;

  if (!propName || !prefix || typeof propName !== "string" || typeof prefix !== "string") {
    throw new Error("getCurrencyValue: propName and prefix must be strings");
  }

  if (providerPreferences.preferences.multiCurrency) {
    const prefixedPropName = propName.replace(/^./, "".concat(prefix).concat(propName[0].toUpperCase()));
    return item[prefixedPropName] || item[propName];
  }

  return item[propName];
}

function getCurrency(item, providerPreferences) {
  const baseCurrency = providerPreferences.preferences.supportedCurrencies[0];
  if (providerPreferences.preferences.multiCurrency) {
    return item && item.displayCurrency && item.displayCurrency.isocode ? item.displayCurrency : baseCurrency;
  }
  return baseCurrency;
}

function getCurrencySymbol(isocode) {
  const currencies = [
    {
      isocode: "USD",
      symbol: "$",
      printSymbol: true
    },
    {
      isocode: "AUD",
      symbol: "$",
      printSymbol: true
    },
    {
      isocode: "CAD",
      symbol: "$",
      printSymbol: true
    },
    {
      isocode: "EUR",
      symbol: "€",
      printSymbol: true
    },
    {
      isocode: "GBP",
      symbol: "£",
      printSymbol: true
    },
    {
      isocode: "NZD",
      symbol: "$",
      printSymbol: true
    },
    {
      isocode: "MXN",
      symbol: "$",
      printSymbol: true
    },
    {
      isocode: "HNL",
      symbol: "L",
      printSymbol: true
    },
    {
      isocode: "NIO",
      symbol: "C$",
      printSymbol: true
    },
    {
      isocode: "CRC",
      symbol: "₡",
      printSymbol: false
    },
    {
      isocode: "GTQ",
      symbol: "Q",
      printSymbol: true
    },
    {
      isocode: "PAB",
      symbol: "B/.",
      printSymbol: true
    }
  ]
  const trimIsocode = isocode ? isocode.trim() : "";
  const curcy = currencies.find((cur) => {
    return cur.isocode === trimIsocode;
  });
  return curcy && curcy.printSymbol ? curcy.symbol : " ";
}

function MoneyReduce(engine) {
  this.registerTag("moneyReduce", {
    parse: function(tagToken, remainTokens) {
      const args = tagToken.args.split(" ");
      this.item = args[0] || "ticket.taxes";
      this.innerPropName = args[1] || "calculated";
    },
    render: async function(ctx) {
      const coll = await this.liquid.evalValue(this.item, ctx);
      if (ctx && ctx.environments && ctx.environments.providerPreferences && ctx.environments.providerPreferences.preferences &&
        Array.isArray(coll)) {
        const sum = coll.reduce((acc, item) => {
          return acc + getCurrencyValue(item, this.innerPropName, ctx.environments.providerPreferences, {prefix: "display"});
        }, 0);
        return formatter.money(sum);
      }
      return "PNA";
    }
  });
}

function Money(engine) {
  this.registerTag("money", {
    parse: function(tagToken, remainTokens) {
      const args = tagToken.args.split(" ");
      this.item = args[0] || "ticket.total";
      this.propName = args[1] || "total";
      this.evalPropName = false;
      if (args.length > 2) {
        this.evalPropName = args[2] === "true"
      }
    },
    render: async function(ctx) {
      const item = await this.liquid.evalValue(this.item, ctx);
      const propName = this.evalPropName ? await this.liquid.evalValue(this.propName, ctx) : this.propName;
      if (ctx && ctx.environments && ctx.environments.providerPreferences && ctx.environments.providerPreferences.preferences &&
        item && item[propName] !== undefined) {
        return formatter.money(getCurrencyValue(item, propName, ctx.environments.providerPreferences, {prefix: "display"}));
      }
      return "PNA";
    }
  });
}

function CurcySymbol(engine) {
  this.registerTag("curcySymbol", {
    parse: function(tagToken, remainTokens) {
      this.item = tagToken.args || "ticket";
    },
    render: async function(ctx) {
      const item = await this.liquid.evalValue(this.item, ctx);
      if (ctx && ctx.environments && ctx.environments.providerPreferences && ctx.environments.providerPreferences.preferences && item) {
        const itemCurrency = getCurrency(item, ctx.environments.providerPreferences);
        return getCurrencySymbol((itemCurrency || {}).isocode || " ");
      }
      return "";
    }
  });
}

function CurcyIso(engine) {
  this.registerTag("curcyIso", {
    parse: function(tagToken, remainTokens) {
      this.item = tagToken.args || "ticket";
    },
    render: async function(ctx) {
      const item = await this.liquid.evalValue(this.item, ctx);
      if (ctx && ctx.environments && ctx.environments.providerPreferences && ctx.environments.providerPreferences.preferences && item) {
        const itemCurrency = getCurrency(item, ctx.environments.providerPreferences);
        return (itemCurrency || {}).isocode || " ";
      }
      return "";
    }
  });
}

function CurcyName(engine) {
  this.registerTag("curcyName", {
    parse: function(tagToken, remainTokens) {
      this.item = tagToken.args || "ticket";
    },
    render: async function(ctx) {
      const item = await this.liquid.evalValue(this.item, ctx);
      if (ctx && ctx.environments && ctx.environments.providerPreferences && ctx.environments.providerPreferences.preferences && item) {
        if (item.isocode !== undefined && item.symbol !== undefined) { 
          return ctx.environments.localizer.get((item || {}).isocode || " ");
        }
        const itemCurrency = getCurrency(item, ctx.environments.providerPreferences);
        return ctx.environments.localizer.get((itemCurrency || {}).isocode || " ");
      }
      return "";
    }
  });
}

module.exports = {
  CurcyIso,
  CurcySymbol,
  CurcyName,
  Money,
  MoneyReduce
};