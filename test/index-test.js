describe("index.js", () => {
  const {expect} = require("chai");
  let data = null;
  beforeEach(() => {
    data = {
      brand: {
        logos: {
          default: "https://s3.amazonaws.com/btrz-images-test2/b5416770-795b-11ec-b752-8b6ef2019164.png"
        }
      },
      transaction: {
        _id: "5c9f8f8f8f8f8f8f8f8f8f8",
        payments: [
          {
            provider: "inperson",
            type: "cash",
            displayName: "Cash",
            status: "success",
            amount: 3.86,
            rollbackPayload: null,
            acceptedCurrency: {
              isocode:"GTQ",
              symbol:"Q",
              buy:7.77,
              sell:7.57,
              channels:[]
            },
            displayAmount: "30.00",
            displayCurrency: {
              isocode:"GTQ",
              symbol:"Q",
              buy:7.77,
              sell:7.57
            },
            acceptedCurrencyAmount: 30,
            exchangeDetails: {
              exchangeCurrency:{},
              acceptedCurrencyAmount: 3000000,
              acceptedCurrencyAmountReceived: 3000000,
              acceptedCurrencyAmountReturned: 0,
              exchangeCurrencyAmount: 386100,
              exchangeCurrencyAmountReceived: 386100,
              exchangeCurrencyAmountReturned: 0
            }
          },
          {
            amount: 20,
            displayCurrency: {
              isocode:"USD",
              symbol:"$",
              buy:7.77,
              sell:7.57
            },
          },
          {
            amount: 30
          }
        ],
        updatedAt: {
          value: "2021-12-20T16:08:00.488Z",
          offset: 0
        }
      },
      providerPreferences: {
        preferences: {
          colors: {
            brandBackground: "#ee732f"
          },
          timeFormat: "h:MM TT",
          timeZone: {
            name: "(UTC-5:00) New York (United States), Toronto (Canada)",
            daylight: true,
            tz: "America/Toronto"
          },
          dateFormat: "mm/dd/yyyy",
          multiCurrency: true,
          multiline: `something here
and some more here
and some more here`,
          supportedCurrencies: [
            {
              isocode: "USD",
              symbol: "$",
              enabled: true,
              printSymbol: true
            },
            {
              isocode: "CAD",
              symbol: "$",
              enabled: true,
              printSymbol: true

            }
          ]
        }
      },
      tickets: [
        {
          fare: "adult",
          total: 2800000
        },
        {
          fare: "child",
        },
        {
          fare: "person",
        }
      ],
      ticket: {
        fare: "adult",
        total: 2836000,
        displayTotalStr: "28.36",
        "displayTotalStr2": "289",
        "displayTotalStr3": "289.00",
        arrivalTimestamp: "2022-01-19T13:00:00.000Z",
        departureTimestamp: "2022-01-20T08:00:00.000Z",
        taxes: [],
        ssrs: [
          {
            subTotal: 2800000,
          },
          {
            subTotal: 3100000,
          }
        ],
        displayCurrency: {
          isocode: "CAD",
          symbol: "$",
          buy: 1,
          sell: 1,
        },
        createdAt: {
          value: "2021-12-21T16:38:00.488Z",
          offset: 0
        }
      },
      fromStation: {
        timeZone: "America/Toronto"
      },
      toStation: {
        timeZone: "America/Toronto"
      },
      invoiceProvider: {
        currencies:[
          {
            isocode: "GTQ",
            symbol: "Q",
            printSymbol: true
          }
        ]
      },
      localizer: {
        get: (key) => {
          if (key === "html") {
            return `<h1>Hello</h1><br/>
            something
            <b>html</b>
            <i>Italix</i>`;
          }
          if (key === "text") {
            return "text here please";
          }
          if ( key === "french") {
            return "Date / heure d'arrivée:";
          }
          if ( key === "double") {
            return `This " is " awesome`;
          }
          if (key === "complex") {
            return `Some ' complex ' string" here" \``
          }
          if (key === "textWithTab") {
            return "	Some text 	 with tabs 	 here";
          }
          return `=>${key}`;
        }
      },
      lang: "es-ar"
    }
  });

  it("should load images via https", async () => {
    const tpl = require("../src/index");
    const template = `{
      "content": [
        {
          "image" : "{% httpImg brand.logos.default %}"
        }
      ]
    }`;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        {
          "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAAeBAMAAAD3Fx6aAAAAG1BMVEX///8/nz9fr1/f79+/379/v3+fz58fjx8AgADFQF6MAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAApBJREFUSInFlj1v2zAQhmlTtjsabYBq9BAEHtUP2BrVoGg1esigUUGGenRSwNBYx0l0P7u8O1I6Sg0a0DbMgZZeyfdQ5PHlKfVKq4BbXXaf6Dhr+lM1R4fn7pMcsqY/OR3KzpOCuMWJ6Rj9yzXA5mx0nOGXM9KHsDsjPYKafhcf4aHs0/VtVV+5/3yuLrrSgXTN9JHbfRFl4lfqExyEaVt8I4fv5nImpLHL2zqYHvHMx273+fQBh18R/SfRW+kI9CFteBvSxPTpcesJOeBNJqQj0HPYK5zN+k4tKnjy6WY9ton+hVDzImz1rRJSQ+/m7Vvp+prmUPPkjiiOyLqUnbCAKdJrkweexG0NvwPotj0S9pHEOSIFvcAsw9V5aoxBStTGPKpAOn70gKYfCSuPHgMFjvB7eYk8idq6GUcI/dLcvLPzSL+C7lYUf3O2ZCnxMEJsqT1lZpRRtv2R9KiRAd+ZKuVL2PpO/TY6MvSPGJd8/W/62KebYfoSBqho6cLoFK4U9P0r9KRPp/Vf2nwNpBvMJpxuPn12ED01xLWcPkkXhY+je7XQMsBpPPrEpE3eeoefdSI20yMfFwc4TY+eYrb16doldkv3JOMTAU7j0VPjFhO7bZZXibffKy769MOdo3uS8cZ9EFxm3d44LX9DjI7iOS1N7ABPMUuX0jDIaSTdJPEU5/ODomjktKWyfQo7HNWcnZboUipCTFbSFzGNfw5wgycsntR8ZlFvhvOc4XG6aehCGoWuunRatIuJvcZvMbZbJ7Z3b2UNXUipNOtQOm42bSuWUikKmtn+E8svqqW30jHoVDJyVQkX7nJley4hd5mgt9LB9Pr+xt6bivr+ki+/VVjcco/l83uEt/RG+j/9L0R48odC2pi1AAAAAElFTkSuQmCC"
        }
      ]
    });
  });

  it("should apply tag after translations", async () => {
    const tpl = require("../src/index");
    const template = `{
      "content": [
        "{% t 'french' | upcase %}",
        "{% t 'double' | upcase %}",
        "{% t 'complex' | upcase %}"
      ]
    }`;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        "DATE / HEURE D'ARRIVÉE:",
        "THIS `` IS `` AWESOME",
        "SOME ' COMPLEX ' STRING`` HERE`` `"
      ]
    });
  });

  it("should return money even when values is zero", async () => {
    const tpl = require("../src/index");
    const template = `{
      "content": [
        {%for payment in transaction.payments %}
        "{%- curcySymbol payment -%}",
        "{%- curcyIso payment -%}",
        {% endfor %}
        "{%- money ticket total -%}",
        "{%- curcySymbol ticket -%}",
        "{%- curcyIso ticket -%}",
        "{%- moneyReduce ticket.ssrs subTotal -%}"
      ]
    }`;
    data.ticket.total = 0;
    data.ticket.ssrs[0].subTotal = 0;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        "Q",
        "GTQ",
        "$",
        "USD",
        "$",
        "USD",
        "0.00",
        "$",
        "CAD",
        "31.00",
      ]
    });
  });

  it("should return currency in letters", async () => {
    const tpl = require("../src/index");
    const template = `{
      "content": [
        "{% toLetters ticket.displayTotalStr %}",
        "{% toLetters ticket.displayTotalStr2 %}",
        "{% toLetters ticket.displayTotalStr3 %}",
        "{% curcyName ticket %}",
        "{% curcyName invoiceProvider.currencies[0] %}"
      ]
    }`;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        "Veintiocho =>with treinta y seis =>cents",
        "Doscientos ochenta y nueve",
        "Doscientos ochenta y nueve",
        "=>CAD",
        "=>GTQ"
      ]
    })
  });

  it("should return alines with the correct colour", async () => {
    const tpl = require("../src/index");
    const template = `{
      "content": [
        {%- hline 356 2 60,60,60 -%},
        {%- hline 356 2 #404040 -%},
        {%- hline  -%},
        {%- hline 100 2 providerPreferences.preferences.colors.brandBackground -%}
      ]
    }`;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        {
          "svg": "<svg height='2' width='100'><line x1='0' y1='0' x2='1000' y2='0' style='stroke:rgb(60,60,60);stroke-width:2' /></svg>",
          "width": 356
        },
        {
          "svg": "<svg height='2' width='100'><line x1='0' y1='0' x2='1000' y2='0' style='stroke:rgb(64,64,64);stroke-width:2' /></svg>",
          "width": 356
        },
        {
          "svg": "<svg height='2' width='100'><line x1='0' y1='0' x2='1000' y2='0' style='stroke:rgb(0,0,0);stroke-width:1' /></svg>",
          "width": 500
        },
        {
          "svg": "<svg height='2' width='100'><line x1='0' y1='0' x2='1000' y2='0' style='stroke:rgb(238,115,47);stroke-width:2' /></svg>",
          "width": 100
        }
      ]
    });
  });

  it("should return the error JSON in the err.data property", async () => {
    const tpl = require("../src/index");
    const template = `{
      "content": [{},
      ]
    }`;
    try {
    await tpl.processToObj(template, data);
      expect(1).to.be.eql(2);
    } catch (err) {
      //spaces are important in this test
      expect(err.data).to.be.eql(`{
      "content": [{},
      ]
    }`);
    }
  });

  it.skip("should parse dates from ISO dates", async () => {
    const tpl = require("../src/index");
    const template = `{
      "content": [
        "{%- humanDateTime ticket arrivalTimestamp %}",
        "{%- humanDate ticket arrivalTimestamp %}",
        "{%- dateTime ticket arrivalTimestamp %}",
        "{%- dateTime ticket arrivalTimestamp mm/dd/yyyy hh:MM:ss %}",
        "{%- dateF ticket arrivalTimestamp %}",
        "{%- timeF ticket arrivalTimestamp %}",
        "{%- humanDateTime ticket arrivalTimestamp false%}",
        "{%- humanDate ticket arrivalTimestamp false%}",
        "{%- dateF ticket arrivalTimestamp false %}",
        "{%- timeF ticket arrivalTimestamp false %}",
        "{%- arrivalDateTime ticket %}",
        "{%- departureDateTime ticket %}",
        "{%- humanArrivalDateTime ticket %}",
        "{%- humanDepartureDateTime ticket %}",
        "{%- arrivalDate ticket %}",
        "{%- arrivalTime ticket %}",
        "{%- departureDate ticket %}",
        "{%- departureTime ticket %}",
        "{%- humanArrivalDate ticket %}",
        "{%- humanDepartureDate ticket %}"
      ]
    }`;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        "Mié Ene 19, 2022 8:00 AM",
        "Mié Ene 19, 2022",
        "01/19/2022 8:00 AM",
        "01/19/2022 08:00:00",
        "01/19/2022",
        "8:00 AM",
        "Mié Ene 19, 2022 8:00 AM",
        "Mié Ene 19, 2022",
        "01/19/2022",
        "8:00 AM",
        "01/19/2022 8:00 AM",
        "01/20/2022 3:00 AM",
        "Mié Ene 19, 2022 8:00 AM",
        "Jue Ene 20, 2022 3:00 AM",
        "01/19/2022",
        "8:00 AM",
        "01/20/2022",
        "3:00 AM",
        "Mié Ene 19, 2022",
        "Jue Ene 20, 2022",
      ]
    });
  });

  it("should parse barcode", async () => {
    const tpl = require("../src/index");
    const template = `{
      "content": [
        {%- barcode -%},
        {%- barcode 1234 code128 10 2 10,5,2,4 -%},
        {%- barcode 1234 code128 10 2 10,5 -%}
      ]
    }`;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        {
          "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3gAAAB4CAYAAACghlDTAAAAAklEQVR4AewaftIAAAPmSURBVO3BsW0EQQwEsJH673mcbnSA8ZlAcpI0H9rmNTN5tc2XmcmrbX4xM/nSNr+Ymbza5jUzebXNl5nJq23+Y2byi7Z5zUxebfOambza5svM5Bdt85qZvNrmy8zk1TZfZiZf2uY1M/mPtvkyM3m1zS9mJq+2ec1MvrTNl5nJq23+Y2byi7Z5zUxebfOamXxpm1/MTF5t85qZvNrmy8zk1TZfZia/aJvXzOTVNl9mJq+2ec1MvrTNl5nJq21+MTP50ja/mJm82uY1M3m1zZeZyattvsxMftE2r5nJq22+zExebfNlZvKlbV4zk/9omy8zk1fbfJmZfGmb18zk1Ta/mJm82uYXM5MvbfOambza5svM5Bdt85qZvNrmy8zk1TZfZiavtnnNTL60zZeZyattfjEz+dI2v5iZvNrmNTN5tc2XmcmXtvkyM/nSNl9mJl/a5jUz+dI2/zEz+Y+2ec1MXm3zmpl82QAAAHDCBgAAgBM2AAAAnLABAADghA0AAAAnbAAAADhhAwAAwAkbAAAATtgAAABwwgYAAIATNgAAAJywAQAA4IQNAAAAJ2wAAAA4YQMAAMAJGwAAAE7YAAAAcMIGAACAEzYAAACcsAEAAOCEDQAAACdsAAAAOGEDAADACRsAAABO2AAAAHDCBgAAgBM2AAAAnLABAADghA0AAAAnbAAAADhhAwAAwAkbAAAATtgAAABwwgYAAIATNgAAAJywAQAA4IQNAAAAJ2wAAAA4YQMAAMAJGwAAAE7YAAAAcMIGAACAEzYAAACcsAEAAOCEDQAAACdsAAAAOGEDAADACRsAAABO2AAAAHDCBgAAgBM2AAAAnLABAADghA0AAAAnbAAAADhhAwAAwAkbAAAATtgAAABwwgYAAIATNgAAAJywAQAA4IQNAAAAJ2wAAAA4YQMAAMAJGwAAAE7YAAAAcMIGAACAEzYAAACcsAEAAOCEDQAAACdsAAAAOGEDAADACRsAAABO2AAAAHDCBgAAgBM2AAAAnLABAADghA0AAAAnbAAAADhhAwAAwAkbAAAATtgAAABwwgYAAIATNgAAAJywAQAA4IQNAAAAJ2wAAAA4YQMAAMAJGwAAAE7YAAAAcMIGAACAEzYAAACcsAEAAOCEDQAAACdsAAAAOGEDAADACRsAAABO2AAAAHDCBgAAgBM2AAAAnLABAADghA0AAAAnbAAAADhhAwAAwAkbAAAATtgAAABwwgYAAIATNgAAAJywAQAA4IQNAAAAJ2wAAAA4YQMAAMAJGwAAAE7YAAAAcMIGAACAEzYAAACcsAEAAOCEDQAAACdsAAAAOGEDAADACX8+ALXvFMrcDQAAAABJRU5ErkJggg==",
          "width": 200,
          "margin": [0,0,0,0]
        },{
          "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOQAAAAoCAYAAADufVZCAAAAAklEQVR4AewaftIAAADcSURBVO3BsY0EQRDDQKrzz1nvjrXA4R0ZrApQPrTllYRXW74k4Rdt+ZKEV1teSfjSli9J+EVbviTh1ZZfJOHVllcSvrTlF0l4teVLEl5t+ZKE/2jLKwlf2vKLJPyiLa8kvNrySsKXQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMPxSXLk+8Qj8BAAAAAElFTkSuQmCC",
          "width": 2,
          "margin": [10,5,2,4]
        },{
          "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOQAAAAoCAYAAADufVZCAAAAAklEQVR4AewaftIAAADcSURBVO3BsY0EQRDDQKrzz1nvjrXA4R0ZrApQPrTllYRXW74k4Rdt+ZKEV1teSfjSli9J+EVbviTh1ZZfJOHVllcSvrTlF0l4teVLEl5t+ZKE/2jLKwlf2vKLJPyiLa8kvNrySsKXQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMPxSXLk+8Qj8BAAAAAElFTkSuQmCC",
          "width": 2,
          "margin": [0,0,0,0]
        }
      ]
    });
  });

  it("should not break if h has not data", async () => {
    const tpl = require("../src/index");
    const template = `{
      "content": [
        {%- h lexiconKeys.toc -%}
      ]
    }`;
    const d = {
    }
    const documentDefinition = await tpl.processToObj(template, d);
    expect(documentDefinition).to.be.eql({
      "content": [
        {
          "text": ""
        }
      ]
    });
  });

  it("should return a parsed liquidTemplate", async () => {
    const tpl = require("../src/index");
    const template = `{
      "content": [
        "Transaction Id: {{transaction._id}}",
        "{% t 'h' %}",
        {%- for ticket in tickets -%}
        {%- if forloop.last == false -%}
        "{{ticket.fare}} and {%t ticket.fare %}",
        {%- else -%}
        "{{ticket.fare}} and {%t ticket.fare %}",
        {%- endif -%}
        {%- endfor -%}
        {%- hline 356 2 60,60,60 -%},
        {%- hline  -%},
        {%- barcode -%},
        {%- barcode 1234 code128 10 2 10,5,2,4 -%},
        {%- h 'html' -%},
        "{%- money ticket total -%}",
        "{%- curcySymbol ticket -%}",
        "{%- curcyIso ticket -%}",
        "{%- moneyReduce ticket.ssrs subTotal -%}",
        "{%- humanDateTime ticket createdAt %}",
        "{%- humanDate ticket createdAt %}",
        "{%- dateTime ticket createdAt %}",
        "{%- dateTime ticket createdAt mm/dd/yyyy hh:MM:ss %}",
        "{%- dateF ticket createdAt %}",
        "{%- timeF ticket createdAt %}",
        {% txt providerPreferences.preferences.multiline %},
        {% txt providerPreferences.preferences.multiline small %}
      ]
    }`;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        "Transaction Id: 5c9f8f8f8f8f8f8f8f8f8f8",
        "=>h","adult and =>adult","child and =>child","person and =>person",{
        "svg": "<svg height='2' width='100'><line x1='0' y1='0' x2='1000' y2='0' style='stroke:rgb(60,60,60);stroke-width:2' /></svg>",
        "width": 356
      },{
        "svg": "<svg height='2' width='100'><line x1='0' y1='0' x2='1000' y2='0' style='stroke:rgb(0,0,0);stroke-width:1' /></svg>",
        "width": 500
      },{
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3gAAAB4CAYAAACghlDTAAAAAklEQVR4AewaftIAAAPmSURBVO3BsW0EQQwEsJH673mcbnSA8ZlAcpI0H9rmNTN5tc2XmcmrbX4xM/nSNr+Ymbza5jUzebXNl5nJq23+Y2byi7Z5zUxebfOambza5svM5Bdt85qZvNrmy8zk1TZfZiZf2uY1M/mPtvkyM3m1zS9mJq+2ec1MvrTNl5nJq23+Y2byi7Z5zUxebfOamXxpm1/MTF5t85qZvNrmy8zk1TZfZia/aJvXzOTVNl9mJq+2ec1MvrTNl5nJq21+MTP50ja/mJm82uY1M3m1zZeZyattvsxMftE2r5nJq22+zExebfNlZvKlbV4zk/9omy8zk1fbfJmZfGmb18zk1Ta/mJm82uYXM5MvbfOambza5svM5Bdt85qZvNrmy8zk1TZfZiavtnnNTL60zZeZyattfjEz+dI2v5iZvNrmNTN5tc2XmcmXtvkyM/nSNl9mJl/a5jUz+dI2/zEz+Y+2ec1MXm3zmpl82QAAAHDCBgAAgBM2AAAAnLABAADghA0AAAAnbAAAADhhAwAAwAkbAAAATtgAAABwwgYAAIATNgAAAJywAQAA4IQNAAAAJ2wAAAA4YQMAAMAJGwAAAE7YAAAAcMIGAACAEzYAAACcsAEAAOCEDQAAACdsAAAAOGEDAADACRsAAABO2AAAAHDCBgAAgBM2AAAAnLABAADghA0AAAAnbAAAADhhAwAAwAkbAAAATtgAAABwwgYAAIATNgAAAJywAQAA4IQNAAAAJ2wAAAA4YQMAAMAJGwAAAE7YAAAAcMIGAACAEzYAAACcsAEAAOCEDQAAACdsAAAAOGEDAADACRsAAABO2AAAAHDCBgAAgBM2AAAAnLABAADghA0AAAAnbAAAADhhAwAAwAkbAAAATtgAAABwwgYAAIATNgAAAJywAQAA4IQNAAAAJ2wAAAA4YQMAAMAJGwAAAE7YAAAAcMIGAACAEzYAAACcsAEAAOCEDQAAACdsAAAAOGEDAADACRsAAABO2AAAAHDCBgAAgBM2AAAAnLABAADghA0AAAAnbAAAADhhAwAAwAkbAAAATtgAAABwwgYAAIATNgAAAJywAQAA4IQNAAAAJ2wAAAA4YQMAAMAJGwAAAE7YAAAAcMIGAACAEzYAAACcsAEAAOCEDQAAACdsAAAAOGEDAADACRsAAABO2AAAAHDCBgAAgBM2AAAAnLABAADghA0AAAAnbAAAADhhAwAAwAkbAAAATtgAAABwwgYAAIATNgAAAJywAQAA4IQNAAAAJ2wAAAA4YQMAAMAJGwAAAE7YAAAAcMIGAACAEzYAAACcsAEAAOCEDQAAACdsAAAAOGEDAADACX8+ALXvFMrcDQAAAABJRU5ErkJggg==",
        "width": 200,
        "margin": [0,0,0,0]
      },{
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOQAAAAoCAYAAADufVZCAAAAAklEQVR4AewaftIAAADcSURBVO3BsY0EQRDDQKrzz1nvjrXA4R0ZrApQPrTllYRXW74k4Rdt+ZKEV1teSfjSli9J+EVbviTh1ZZfJOHVllcSvrTlF0l4teVLEl5t+ZKE/2jLKwlf2vKLJPyiLa8kvNrySsKXQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMQ9KMPxSXLk+8Qj8BAAAAAElFTkSuQmCC",
        "width": 2,
        "margin": [10,5,2,4]
      },{"style": "header", "text": "Hello"},{"text": ""},{"text": "something"},{"text": ""},{"bold": true, "text": "html"},{"text": ""},{"italics": true, "text": "Italix"},
        "28.36",
        "$",
        "CAD",
        "59.00",
        "Mar Dic 21, 2021 11:38 AM",
        "Mar Dic 21, 2021",
        "12/21/2021 11:38 AM",
        "12/21/2021 11:38:00",
        "12/21/2021",
        "11:38 AM",
        {"text": "something here"},{"text": "and some more here"},{"text": "and some more here"},
        {"text": "something here", "style": "small"},{"text": "and some more here", "style": "small"},{"text": "and some more here", "style": "small"}
      ]
    });
  });

  it("should format dateTime outside and inside a for loop", async () => {
    data.things = [
      {
        id: 1,
        createdAt: {
          value: "2021-12-21T16:38:00.488Z",
          offset: 0
        }
      },
      {
        id: 2,
        createdAt: {
          value: "2021-12-22T16:32:22.488Z",
          offset: 0
        }
      }
    ];
    const tpl = require("../src/index");
    const template = `{
      "content": [
        {%- for thing in things -%}
          "{{thing.id}}",
          "{%- dateTime thing createdAt %}",
          "{%- dateTime thing wrongProp %}",
        {%- endfor -%}
        "{%- dateTime transaction updatedAt %}",
        "{%- dateTime transaction wrongProp %}"
      ]
    }`;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        "1",
        "12/21/2021 11:38 AM",
        "PNA",
        "2",
        "12/22/2021 11:32 AM",
        "PNA",
        "12/20/2021 11:08 AM",
        "PNA",
      ]
    });
  });

  it("should format dateF outside and inside a for loop", async () => {
    data.things = [
      {
        data: {createdAt: {value: "2021-12-21T16:38:22.488Z", offset: 0}}
      },
      {
        data: {createdAt: {value: "2021-12-22T16:32:22.488Z", offset: 0}}
      }
    ];
    const tpl = require("../src/index");
    const template = `{
      "content": [
        {%- for thing in things -%}
          "{%- dateF thing.data createdAt %}",
          "{%- dateF thing.data wrongProp %}",
        {%- endfor -%}
        "{%- dateF transaction updatedAt %}",
        "{%- dateF transaction wrongProp %}"
      ]
    }`;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        "12/21/2021",
        "PNA",
        "12/22/2021",
        "PNA",
        "12/20/2021",
        "PNA",
      ]
    });
  });

  it("should correctly format 24-hour time strings (HH)", async () => {
    data.things = [
      {
        data: {time: "20:53"}
      },
      {
        data: {time: "10:53"}
      }
    ];
    const tpl = require("../src/index");
    const template = `{
      "content": [
        {%- for thing in things -%}
          "{%- timeF thing.data time %}",
          "{%- timeF thing.data wrongProp %}",
        {%- endfor -%}
        "{%- timeF transaction updatedAt %}",
        "{%- timeF transaction wrongProp %}"
      ]
    }`;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        "8:53 PM",
        "PNA",
        "10:53 AM",
        "PNA",
        "11:08 AM",
        "PNA",
      ]
    });
  });

  it("should format timeF outside and inside a for loop", async () => {
    data.things = [
      {
        data: {createdAt: {value: "2021-12-21T16:38:22.488Z", offset: 0}}
      },
      {
        data: {createdAt: {value: "2021-12-22T16:32:22.488Z", offset: 0}}
      }
    ];
    const tpl = require("../src/index");
    const template = `{
      "content": [
        {%- for thing in things -%}
          "{%- timeF thing.data createdAt %}",
          "{%- timeF thing.data wrongProp %}",
        {%- endfor -%}
        "{%- timeF transaction updatedAt %}",
        "{%- timeF transaction wrongProp %}"
      ]
    }`;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        "11:38 AM",
        "PNA",
        "11:32 AM",
        "PNA",
        "11:08 AM",
        "PNA",
      ]
    });
  });


  it("should return a french translation", async () => {
    const tpl = require("../src/index");
    const template = `{
      "content": [
        "{% t 'french' %}"
      ]
    }`;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        "Date / heure d'arrivée:"
      ]
    });
  });

  it("should return a text tag with escaped tabs", async () => {
    const tpl = require("../src/index");
    const template = `{
      "content": [
        {%- h 'textWithTab' -%}
      ]
    }`;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        {
          "text": "\tSome text \t with tabs \t here"
        }
      ]
    });
  });

  it("should return a translation with double quotes replaced with `` ", async () => {
    const tpl = require("../src/index");
    const template = `{
      "content": [
        "{% t 'double' %}"
      ]
    }`;
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
          "This `` is `` awesome"
      ]
    });
  });

  it("should allow to loop over an object keys", async () => {
    const tpl = require("../src/index");
    const template = `{
      "content": [
        {% assign objectKeys = ticket.displayCurrency | keys %}
        {% for aKey in objectKeys %}
          {% if forloop.first %}
            {
          {% endif %}
          {% unless forloop.last %}
            "key{{forloop.index}}": "{{aKey}}",
          {% else %}
            "key{{forloop.index}}": "{{aKey}}"}
          {% endunless %}
        {% endfor %}
      ]
    }`
    const documentDefinition = await tpl.processToObj(template, data);
    expect(documentDefinition).to.be.eql({
      "content": [
        {
          "key1": "isocode",
          "key2": "symbol",
          "key3": "buy",
          "key4": "sell",
        }
      ]
    });
  });

  it("should return ESCP code", async () => {
    const tpl = require("../src/index");
    const template = `
        {% escInitQzTray %}
        {% lineSpacing2 %}
        {% fontSelection %}
        {% escBold %}
        Shift location closure #: {{transaction._id}}
        {% escNewLine %}
        {% escCancelBold %}
        {% escCondensed %}
        {% escEject %}`
    const documentDefinition = await tpl.processToEscp(template, data);
    expect(documentDefinition).to.be.eql(`\\x1B\\x69\\x61\\x00\\x1B\\x40,\\x1B\\x33\\x24,\\x1B\\x4D,\\x1B\\x45,Shift location closure #: 5c9f8f8f8f8f8f8f8f8f8f8,\\n,\\x1B\\x46,\\x1B\\x0F,\\x0C`);
  });
});
