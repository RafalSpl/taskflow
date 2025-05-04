import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (_req, res) => {
  res.send('API working 🎉');
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('Connected z MongoDB');
    app.listen(PORT, () => {
      console.log(`Server working on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error conecting to MongoDB:', err);
  });
