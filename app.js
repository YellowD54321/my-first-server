const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const axios = require("axios");
const port = 8080;
const cors = require("cors");

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

// 一般信用卡API
// 由前端提供prime
app.post("/pay-by-prime", (req, res, next) => {
  const url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime";
  const prime = req.body.prime;

  const post_header = {
    "x-api-key": partnerKey,
  };

  const post_data = {
    prime: prime,
    partner_key: partnerKey,
    merchant_id: merchantId,
    amount: 1,
    currency: "TWD",
    details: "This is paid by prime.",
    cardholder: {
      phone_number: "+886923456789",
      name: "王小明",
      email: "LittleMing@Wang.com",
      zip_code: "100",
      address: "台北市天龍區芝麻街1號1樓",
      national_id: "A123456789",
    },
    // 是否讓Tappay記住卡號
    // true才會回傳card_secret
    remember: true,
  };

  // 以前端提供的prime向Tappay提出支付
  axios
    .post(url, post_data, {
      headers: post_header,
    })
    .then((response) => {
      const data = response.data;
      const status = data.status;
      console.log("pay-by-prime response", data);
      // 支付失敗
      if (status !== 0) {
        return res.json({
          result: data,
        });
      }
      // 支付成功
      // 若有回傳card_secret，將它儲存起來
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

// 已寄存卡號API
// 後端使用儲存的card_token和card_key向Tappay提出支付申請
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
    details: "This is paid by card token",
    amount: 100,
  };

  // 以card_secret向Tappay提出支付
  axios
    .post(url, postData, {
      headers: postHeader,
    })
    .then((response) => {
      const data = response.data;
      console.log("pay-by-card-token response", data);
      return res.json({
        result: data,
      });
    });
});

// app.get("/user/allen", (req, res) => {
//   console.log("get api is called");
//   res.send({
//     data: "Hi Allen!",
//   });
// });

// const favorite = {
//   game: "zelda",
//   music: "nujabes",
// };

// app.post("/user/allen", (req, res) => {
//   console.log("post api is called.");
//   const answer = req.body.answer;
//   const data = favorite[answer];
//   console.log(answer);
//   res.send(data);
// });

var server = app.listen(port, function () {
  console.log(`Listening on URL: http://localhost:${port}`);
});
