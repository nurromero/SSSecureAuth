import express from 'express'
import db from '../db/database.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', requireAuth, (req, res) => {
  const stmt = db.prepare(`
    SELECT documents.id, documents.filename, documents.created_at
    FROM documents
    JOIN document_access 
    ON documents.id = document_access.document_id
    WHERE document_access.user_id = ?
  `)

  stmt.bind([req.user.id])

  const documents = []

  while (stmt.step()) {
    documents.push(stmt.getAsObject())
  }

  stmt.free()

  res.json(documents)
})

export default router