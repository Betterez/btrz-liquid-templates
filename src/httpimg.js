const axios = require("axios");

function HttpImg(engine) {
  this.registerTag("httpImg", {
    parse: function(tagToken, remainTokens) {
      this.str = tagToken.args
    },
    render: async function(ctx) {
      const url = await this.liquid.evalValue(this.str, ctx);
      try {
        const response = await axios.get(url, {
          responseType: "arraybuffer"
        });
        if (response && response.headers && response.headers["content-type"]) {
          const contentType = response.headers["content-type"];
          if (contentType.startsWith("image/png")) {
            return `data:image/png;base64,${Buffer.from(response.data, "binary").toString("base64")}`;
          } else if (contentType.startsWith("image/jpeg")) {
            return `data:image/jpeg;base64,${Buffer.from(response.data, "binary").toString("base64")}`;
          }
        }
        //default to a placeholder image if the content type is not recognized
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAH0lEQVR42mP8P4PhPwMVAeOogaMGjho4auCogSPVQACqOzPNQ/wwqAAAAABJRU5ErkJggg==';
      } catch (e) {
        console.log(e);
        return "";
      }
    }
});
}

module.exports = {
  HttpImg
};

