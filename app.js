const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const axios = require("axios");
const port = 8080;
const cors = require("cors");

// from tutorial
// app.get("/temperature/:location_code", function (request, response) {
//   const varlocation = request.params.location_code;
//   weather.current(location, function (error, temp_f) {
//     console.log(error);
//     console.log(temp_f);
//   });
// });

const partnerKey =
  "partner_MisOlKdtyn9TOvWhASjNMyTKTLtvwsMZv77ZwcdTBant9T6lKBf0a9SD";

const merchantId = "AllenHuang_CTBC";

const cardSecret = {
  cardToken: "",
  cardKey: "",
};

app.use(cors("http://localhost:3000"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
// app.use("/", express.static(__dirname + "html"));

app.post("/pay-by-prime", (req, res, next) => {
  const prime = req.body.prime;

  // code
  const post_data = {
    prime: prime,
    partner_key: partnerKey,
    merchant_id: merchantId,
    amount: 1,
    currency: "TWD",
    details: "An apple and a pen.",
    cardholder: {
      phone_number: "+886923456789",
      name: "王小明",
      email: "LittleMing@Wang.com",
      zip_code: "100",
      address: "台北市天龍區芝麻街1號1樓",
      national_id: "A123456789",
    },
    remember: true,
  };

  axios
    .post("https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime", post_data, {
      headers: {
        "x-api-key": partnerKey,
      },
    })
    .then((response) => {
      console.log("pay-by-prime response", response.data);
      const data = response.data;
      const status = data.status;
      if (status !== 0) {
        return res.json({
          result: data,
        });
      }
      const hasCardSecret = data.hasOwnProperty("card_secret");
      if (hasCardSecret) {
        cardSecret.cardToken = data.card_secret.card_token;
        cardSecret.cardKey = data.card_secret.card_key;
      }
      return res.json({
        result: data,
      });
    });
});

app.post("/pay-by-card-token", (req, res, next) => {
  const url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-token";

  const postHeader = {
    "Content-Type": "application/json",
    "x-api-key": partnerKey,
  };

  const postData = {
    card_key: cardSecret.cardKey,
    card_token: cardSecret.cardToken,
    partner_key: partnerKey,
    currency: "TWD",
    merchant_id: merchantId,
    details: "TapPay Test",
    amount: 100,
  };

  axios
    .post(url, postData, {
      headers: postHeader,
    })
    .then((response) => {
      console.log(response.data);
      const data = response.data;
      const status = data.status;
      console.log("data", data);
      return res.json({
        result: data,
      });
    });
});

app.get("/user/allen", (req, res) => {
  console.log("get api is called");
  res.send({
    data: "Hi Allen!",
  });
});

const favorite = {
  game: "zelda",
  music: "nujabes",
};

app.post("/user/allen", (req, res) => {
  console.log("post api is called.");
  const answer = req.body.answer;
  const data = favorite[answer];
  // console.log(req);
  console.log(answer);
  res.send(data);
});

var server = app.listen(port, function () {
  console.log(`Listening on URL: http://localhost:${port}`);
});
