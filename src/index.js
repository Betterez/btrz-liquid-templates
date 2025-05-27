const {Liquid} = require("liquidjs");
const {Localizer} = require("./localizer.js");
const {HorizontalLine} = require("./lines.js");
const {Barcode} = require("./barcode.js");
const {Html} = require("./html.js");
const {Money, CurcySymbol, CurcyIso, CurcyName, MoneyReduce} = require("./money.js");
const {DateF, TimeF, DateTime, HumanDate, HumanDateTime, ExpDate, HumanArrivalDateTime, HumanDepartureDateTime,
  DepartureDateTime, ArrivalDateTime, DepartureDate, ArrivalDate, DepartureTime, ArrivalTime, HumanArrivalDate,
  HumanDepartureDate
} = require("./dateFormat.js");
const {Text} = require("./text.js");
const {QrString} = require("./qrstr.js");
const {ToLetters} = require("./toletters.js");
const {HttpImg} = require("./httpimg.js");
const {Keys} = require("./object.js");
const {
  escInitQzTray,
  lineSpacing,
  lineSpacing2,
  lineSpacingX,
  fontSelection,
  escBold,
  escCancelBold,
  escCondensed,
  escNewLine,
  escCut,
  escTab,
  escEject,
  escHPos
} = require("./escp.js");

function getEngine() {
  const engine = new Liquid({
    layouts: ["/nowhere/"],
    root: ["/nowhere/"],
    partials: ["/nowhere/"],
    extname: ".liquid",
    dynamicPartials: false,
    outputEscape: (val) => {
       if (typeof val === "string") {
         return val.replace(/[\\]/g, '\\\\')
         .replace(/[\"]/g, '\\"')
         .replace(/[\/]/g, '\\/')
         .replace(/[\b]/g, '\\b')
         .replace(/[\f]/g, '\\f')
         .replace(/[\n]/g, '\\n')
         .replace(/[\r]/g, '\\r')
         .replace(/[\t]/g, '\\t');
      }
      return val;
    }
  });
  engine.plugin(Localizer);
  engine.plugin(Html);
  engine.plugin(HorizontalLine);
  engine.plugin(Barcode);
  engine.plugin(Money);
  engine.plugin(CurcySymbol);
  engine.plugin(CurcyIso);
  engine.plugin(CurcyName);
  engine.plugin(MoneyReduce);
  engine.plugin(DateF);
  engine.plugin(TimeF);
  engine.plugin(DateTime);
  engine.plugin(HumanDate);
  engine.plugin(HumanDateTime);
  engine.plugin(HumanArrivalDateTime);
  engine.plugin(HumanDepartureDateTime);
  engine.plugin(DepartureDateTime);
  engine.plugin(ArrivalDateTime);
  engine.plugin(DepartureDate);
  engine.plugin(ArrivalDate);
  engine.plugin(DepartureTime);
  engine.plugin(ArrivalTime);
  engine.plugin(HumanArrivalDate);
  engine.plugin(HumanDepartureDate);
  engine.plugin(Text);
  engine.plugin(ExpDate);
  engine.plugin(QrString);
  engine.plugin(ToLetters);
  engine.plugin(HttpImg);
  engine.plugin(Keys);
  return engine;
}

module.exports = {
  async processToObj(liquidTemplate, data) {
    try {
      const str = await this.processToString(liquidTemplate, data);
      const obj = JSON.parse(str);
      return obj;
    } catch (err) {
      err.data = liquidTemplate;
      throw err;
    }
  },
  async processToEscp(liquidTemplate, data) {
    const engine = getEngine();
    engine.plugin(escInitQzTray);
    engine.plugin(lineSpacing);
    engine.plugin(lineSpacing2);
    engine.plugin(lineSpacingX);
    engine.plugin(fontSelection);
    engine.plugin(escBold);
    engine.plugin(escCancelBold);
    engine.plugin(escCondensed);
    engine.plugin(escNewLine);
    engine.plugin(escCut);
    engine.plugin(escTab);
    engine.plugin(escHPos);
    engine.plugin(escEject);
    let str = await engine.parseAndRender(liquidTemplate, data);
    str = str.split(/\n/).map((line) => {
      return line.trim();
    }).filter((line) => {
      return line.length > 0;
    })
    .join("");
    // console.log(str);
    str = str.replace(/\\n/g, "\n").replace(/\\x0C/g, "\x0C");
    return str;
  },
  async processToString(liquidTemplate, data) {
    const engine = getEngine();
    const str = await engine.parseAndRender(liquidTemplate, data);
    return str;
  }
};