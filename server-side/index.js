import express from "express";
import cors from "cors";
import itemRoutes from './routes/itemRoutes.js'
import categoryRoutes from'./routes/categoryRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import DBConnection from "./database/db.js";

import categoryForUser from './routes/categoryForUser.js'


import {middleware} from './Middleware/Auth.js';
import { authenticateToken } from './Middleware/VerifyToken.js';
const app = express();



app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


DBConnection();



import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


 app.use('/api', authenticateToken,itemRoutes); 

 
app.use('/userside', categoryForUser);

app.use('/categories', authenticateToken, categoryRoutes);
app.use('/analytics', authenticateToken, analyticsRoutes);


app.post("/register",middleware);
app.post("/login",middleware);


  

// Start server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
