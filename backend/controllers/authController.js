import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'none' ,secure:true });
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
