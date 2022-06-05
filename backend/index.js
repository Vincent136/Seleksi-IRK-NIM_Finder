const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const apiRoute = require('./routes/api');

dotenv.config();
  

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(err) console.log(err) 
    else console.log("mongodb is connected");
});

app.use(express.json());
app.use(cors());

app.use("/api/" , apiRoute);

app.listen(process.env.PORT,() => {
    console.log("backend is running.");
})