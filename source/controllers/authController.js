import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: 'Logged in successfully', user });
    });
  })(req, res, next);
};

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create(username, hashedPassword);
    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in after signup', error: err });
      }
      return res.status(201).json({ message: 'User created successfully', user: newUser });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out', error: err });
    }
    res.json({ message: 'Logged out successfully' });
  });
};