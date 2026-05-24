import express from 'express'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import db, { saveDb } from '../db/database.js'

const router = express.Router()

const PEPPER = process.env.PEPPER || 'dev-pepper'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

// Register user
router.post('/register', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const checkUser = db.prepare('SELECT id FROM users WHERE email = ?')
    checkUser.bind([email])

    if (checkUser.step()) {
      checkUser.free()
      return res.status(409).json({ message: 'User already exists' })
    }

    checkUser.free()

    const passwordHash = await argon2.hash(password + PEPPER)

    const insertUser = db.prepare(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)'
    )

    insertUser.run([email, passwordHash])
    insertUser.free()

    saveDb()

    return res.status(201).json({ message: 'User created' })
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed' })
  }
})

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const getUser = db.prepare(
      'SELECT id, email, password_hash FROM users WHERE email = ?'
    )

    getUser.bind([email])

    if (!getUser.step()) {
      getUser.free()
      return res.status(401).json({ message: 'Invalid login' })
    }

    const user = getUser.getAsObject()
    getUser.free()

    const passwordIsValid = await argon2.verify(
      user.password_hash,
      password + PEPPER
    )

    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Invalid login' })
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    return res.json({
      message: 'Login successful',
      token,
      email: user.email
    })
  } catch (error) {
    return res.status(500).json({ message: 'Login failed' })
  }
})

export default router