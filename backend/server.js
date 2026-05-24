import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 4000;



// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DB
connectDB();

//ROUTES
app.get('/', (req, res) => {
  res.send('API Working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});