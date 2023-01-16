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

app.use(cors("http://localhost:3000"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
// app.use("/", express.static(__dirname + "html"));

// app.post("pay-by-prime", (req, res, next) => {
//   // code
//   const post_data = {
//     prime: req.body.prime,
//     partner_key:
//       "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM",
//     merchant_id: "GlobalTesting_CTBC",
//     amount: 1,
//     currency: "TWD",
//     details: "An apple and a pen.",
//     cardholder: {
//       phone_number: "+886923456789",
//       name: "jack",
//       email: "example@gmail.com",
//     },
//     remember: false,
//   };

//   axios
//     .post("https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime", post_data, {
//       headers: {
//         "x-api-key":
//           "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM",
//       },
//     })
//     .then((response) => {
//       console.log(response.data);
//       return res.json({
//         result: response.data,
//       });
//     });
// });

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
