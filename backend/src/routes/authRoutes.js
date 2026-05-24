import express from 'express'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import db, { saveDb } from '../db/database.js'

const router = express.Router()

const PEPPER = process.env.PEPPER || 'dev-pepper'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

function getUserByEmail(email) {
  const stmt = db.prepare(
    'SELECT id, email, password_hash FROM users WHERE email = ?'
  )

  stmt.bind([email])

  const user = stmt.step() ? stmt.getAsObject() : null
  stmt.free()

  return user
}

router.post('/register', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  if (getUserByEmail(email)) {
    return res.status(409).json({ message: 'User already exists' })
  }

  const passwordHash = await argon2.hash(password + PEPPER)

  const stmt = db.prepare(
    'INSERT INTO users (email, password_hash) VALUES (?, ?)'
  )

  stmt.run([email, passwordHash])
  stmt.free()
  saveDb()

  res.status(201).json({ message: 'User created' })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = getUserByEmail(email)

  if (!user) {
    return res.status(401).json({ message: 'Invalid login' })
  }

  const passwordIsValid = await argon2.verify(
    user.password_hash,
    password + PEPPER
  )

  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Invalid login' })
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  )

  res.json({
    message: 'Login successful',
    token,
    email: user.email
  })
})

export default router