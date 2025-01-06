const express = require('express');
const dotenv = require("dotenv")
const connectDB=require('./config/db')

dotenv.config()


const app = express();
connectDB()

const port=process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});