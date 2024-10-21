import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import bcrypt from 'bcrypt';
import { pool } from './database.js';
import dotenv from 'dotenv';

dotenv.config('../.env');
// login with username and password
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } else {
      return done(null, false, { message: 'User not found.' });
    }
  } catch (error) {
    return done(error);
  }
}));

// login / signup with GitHub
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE github_id = $1', [profile.id]);
      // if user exists, return user
      if (result.rows.length > 0) {
        return done(null, result.rows[0]);
      } else {
        // if user does not exist, create user
        const newUser = await pool.query(
          'INSERT INTO users (username, github_id) VALUES ($1, $2) RETURNING *',
          [profile.username, profile.id]
        );
        return done(null, newUser.rows[0]);
      }
    } catch (error) {
      return done(error);
    }
  }
));
// store user in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});
// retrieve user from session
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error);
  }
});