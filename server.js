const express = require('express');
const dotenv = require("dotenv")
const connectDB = require('./config/db')
const errorHandler = require('./middlewares/errorHandler.js')

dotenv.config()


const app = express();

//database connection
connectDB()

//express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// imports routes
const authRouter = require('./routes/auth.routes')
const homeRouter = require('./routes/home.routes')
const adminRouter = require('./routes/admin.routes')
const imageRouter=require('./routes/image.routes')

// routes middlewares
app.use('/api/home', homeRouter)
app.use('/api/auth', authRouter)
app.use("/api/admin", adminRouter)
app.use("/api/image", imageRouter);


// Error middleware for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// Error middleware
app.use(errorHandler);

// port 
const port = process.env.PORT

//app is listening
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});