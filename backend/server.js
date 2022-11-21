const dotenv  = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();

const PORT = process.env.PORT;

//connect to DB and start server
mongoose.connect(process.env.MONGO_URL)
.then(()=> {
   app.listen(PORT, ()=> {
    console.log(`server running on port ${PORT}`);
   })
})
.catch((error )=> console.log(error));