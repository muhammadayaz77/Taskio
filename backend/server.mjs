  import express from "express";
  import morgan from 'morgan'
  const app = express();
  import dotenv from "dotenv";
  import { DbConnection } from "./config/db.js";
  import cookieParser from 'cookie-parser';
  dotenv.config();
  import cors from 'cors';
  const PORT = process.env.PORT || 3000


  app.use(cors({
    origin: 'http://localhost:5173', 
    methods : ['GET','POST','DELETE','PUT'],  
    allowedHeaders : ['Content-Type','Authorization'],
    credentials: true 
  }))
  app.use(morgan('dev'))


  app.use(cookieParser())

  app.use(express.json())



  // manager routes 
  import route from './routes/index.js'
  app.use("/api/v1" , route);

  // error middleware
  app.use((err,req,res,next) => {
    console.log("Error : ",err.stack)
    res.status(500).json({
      message : "Interval server error"
    })
  })

  // not found middleware
  app.use((req,res,) => {
    res.status(404).json({
      message : "Not Found"
    })
  })

  // database connection 
  DbConnection()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`server is running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => console.log(error));
