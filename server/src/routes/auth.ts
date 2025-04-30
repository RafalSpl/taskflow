import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ message: 'Registration error', error: err });
  }
});

router.post('/login', async ( req: Request , res: any )  =>  {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'incorrect email' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'incorrect password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    return res.json({ token });
  } catch (err) {
    return res.status(400).json({ message: 'Login error', error: err });
  }
});

router.get('/profile', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error downloading profile', error: err });
  }
});

export default router;
