import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('API działa 🎉');
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('Połączono z MongoDB');
    app.listen(PORT, () => {
      console.log(`Serwer działa na http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Błąd połączenia z MongoDB:', err);
  });