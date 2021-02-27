const mongodb = require("mongodb");
const csvtojson = require("csvtojson");
const express = require("express");
const bodyParser = require("body-parser");
let mongoose = require("mongoose");
var db = mongodb.MongoClient;
const app = express();
const port = 3000;

const userregSchema = new mongoose.Schema({
  username: { type: String, index: true, required: true },
  password: { type: String, required: true },
});

const customerdataSchema = new mongoose.Schema({
  custid: { type: String, index: true, required: true },
  custname: { type: String, required: true },
  Businesstype: { type: String, required: true },
  amount: { type: String, required: true },
  risk: { type: String, required: true },
});

const userregModel = mongoose.model("userreg", userregSchema);
const customerModel = mongoose.model("customer", customerdataSchema);

let url = "mongodb://localhost:27017/dbs";

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello the backend is working uploading csv data to database");
});

app.post("/userreg", (req, res) => {
  const username = req.body.username.username;
  const password = req.body.password.password;
  var userreged = new userregModel({
    username: username,
    password: password,
  });
  userreged.save(function (err, comment) {
    if (err) console.log(err);
    else console.log("fallowing comment was saved:", comment);
  });
  res.send("user sucessfully registered");
});

app.post("/pedict", function (req, res) {
  const custid = req.body.custid.custid;
  const custname = req.body.custname.custname;
  const Businesstype = req.body.Businesstype.Businesstype;
  const amount = req.body.amount.amount;
  const risk = req.body.risk.risk;

  var custmer = new customerModel({
    custid: custid,
    custname: custname,
    Businesstype: Businesstype,
    amount: amount,
    risk: risk,
  });

  custmer.save(function (err, comment) {
    if (err) console.log(err);
    else console.log("fallowing comment was saved:", comment);
  });
  res.send("customer sucessfully registered");
});

// reading csv file and storing data
const csvtojson = require("csvtojson");

csvtojson()
  .fromFile("custmor.csv")
  .then((csvData) => {
    console.log(csvData);
  });
mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) throw err;
    client
      .db("dbshack")
      .collection("customers")
      .insertMany(csvData, (err, res) => {
        if (err) throw err;
        console.log(`Inserted: ${res.insertedCount} rows`);
        client.close();
      });
  }
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
