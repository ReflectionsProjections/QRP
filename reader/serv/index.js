const express = require('express')
var cors = require('cors')
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const { Scan } = require("./models");

// Currently, pulling env vars in any form doens't work and I'm not too sure why
// console.log(process.env.MONGO_URI)


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.get("/scan", async (req, res) => {
  const allEvents = await Scan.find();
  return res.status(200).json(allEvents);
});


app.post("/scan", cors(), async (req, res) => {
  console.log('hello');

  const token = jwt.decode(req.body.data);
  console.log(token);
  const tmp = token.userId;

  console.log("tmp", tmp);

  
  const newEvent = new Scan({"userId": tmp, "date": new Date(Date.now()).toDateString(), "location": "Siebel"});
  
  const insertedEvent = await newEvent.save();
  return res.status(201).json(insertedEvent);
});
app.get('/healthz', (req, res) => {
  return res.send('Up.');
});

const start = async () => {
  try {
    // TODO: FIX THIS
    await mongoose.connect("mongodb+srv://admin:admin@cluster0.vucmoyb.mongodb.net/?retryWrites=true&w=majority");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
start();

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running at http://localhost:${process.env.PORT || 8080}`);
});