import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    res.status(201).json({ message: 'Zarejestrowano użytkownika' });
  } catch (err) {
    res.status(400).json({ message: 'Błąd rejestracji', error: err });
  }
});

router.post('/login', async ( req: any , res: any ) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Zły email' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Złe hasło' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    return res.json({ token });
  } catch (err) {
    return res.status(400).json({ message: 'Błąd logowania', error: err });
  }
});

export default router;
