const {generateBarcodePng} = require("./barcode-generator.js");

function Barcode(engine) {
  this.registerTag("barcode", {
    parse: function(tagToken, remainTokens) {
      try {
        const args = (tagToken.args || "").split(" ");
        this.content = args[0] || "not-content-given";
        this.type = args[1] || "code128";
        this.height = args[2] || 30;
        this.width = args[3] || 200;
        this.margin = args[4] || "0,0,0,0";
      } catch (err) {
        this.content = "not-content-given";
        this.type = "code128";
        this.height = 30;
        this.width = 200;
        this.margin = "0,0,0,0";
      }
    },
    render: async function(ctx) {
      const content = await this.liquid.evalValue(this.content, ctx) || this.content;
      const image = await generateBarcodePng({
        type: this.type,
        content,
        height: this.height
      });
      let margin = [0,0,0,0];
      try {
        margin = this.margin.split(",").map((i) => {
          return parseInt(i,10);
        });
        if (margin.length !== 4) {
          margin = [0,0,0,0];
        }
      } catch (err) {
        console.log("ERROR:", err);
        margin = [0,0,0,0];
      }
      return `{
        "image": "${image}",
        "width": ${this.width || 200},
        "margin": [${margin.join(",")}]
      }`;
    }
});
}

module.exports = {
  Barcode
};

