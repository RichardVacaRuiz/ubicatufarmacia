import express from 'express';
import dotenv from 'dotenv';
import roomRouter from './routes/roomRouter.js';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import cors from 'cors'; // Importa el middleware cors

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

// Usa el middleware cors
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use('/user', userRouter);
app.use('/room', roomRouter);
app.use('/', (req, res) => res.json({ message: 'Welcome to our API' }));
app.use((req, res) =>res.status(404).json({ success: false, message: 'Not Found' })); 

const startServer = async () => {
  try {
     await mongoose.connect(process.env.MONGO_CONNECT);
    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();



