const dotenv  = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const errorHandler = require("./middleWare/errorMiddleWare");
const cookieParser = require("cookie-parser")
const app = express();
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json()); 
//router middleware
app.use("/api/users", userRoute);

//Routes
app.get('/' ,(req,res)=> {
   res.send("home pages");
})

//Error middleware
app.use(errorHandler);

//connect to DB and start server
const PORT = process.env.PORT;

mongoose
.connect(process.env.MONGO_URL)
.then(()=> {
   app.listen(PORT, ()=> {
    console.log(`server running on port ${PORT}`);
   })
})
.catch((error )=> console.log(error));