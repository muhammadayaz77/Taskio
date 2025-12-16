import express from "express";
const app = express();
import dotenv from "dotenv";
import { DbConnection } from "./config/db.js";
import cookieParser from 'cookie-parser';
dotenv.config();
import cors from 'cors';


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}))


app.use(cookieParser())

app.use(express.json())


// manager routes 
import managerRoute from './routes/manager.routes.js'
app.use("/api/v1/manager" , managerRoute)

// team routes 
import teamRoutes from './routes/team.routes.js'
app.use("/api/v1/team" , teamRoutes)

// task routes 
import taskRoutes from './routes/task.routes.js'

app.use("/api/v1/task" , taskRoutes)

// developer routes 
import developerRoutes from './routes/developer.route.js'
app.use("/api/v1/developer" , developerRoutes)



const PORT = process.env.PORT || 3000

// database connection 
DbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(error));
