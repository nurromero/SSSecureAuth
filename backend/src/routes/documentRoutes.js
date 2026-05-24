import express from 'express'
import db, { saveDb } from '../db/database.js'
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

router.post('/', requireAuth, (req, res) => {
  const { filename, content, sharedWithEmail } = req.body

  if (!filename || !content) {
    return res.status(400).json({ message: 'Filename and content are required' })
  }

  const insertDocument = db.prepare(
    'INSERT INTO documents (owner_id, filename, content) VALUES (?, ?, ?)'
  )

  insertDocument.run([req.user.id, filename, content])
  insertDocument.free()

  const documentId = db.exec('SELECT last_insert_rowid()')[0].values[0][0]

  const giveOwnerAccess = db.prepare(
    'INSERT INTO document_access (document_id, user_id) VALUES (?, ?)'
  )

  giveOwnerAccess.run([documentId, req.user.id])
  giveOwnerAccess.free()

  if (sharedWithEmail) {
    const findUser = db.prepare('SELECT id FROM users WHERE email = ?')
    findUser.bind([sharedWithEmail])

    if (findUser.step()) {
      const sharedUser = findUser.getAsObject()

      const giveSharedAccess = db.prepare(
        'INSERT INTO document_access (document_id, user_id) VALUES (?, ?)'
      )

      giveSharedAccess.run([documentId, sharedUser.id])
      giveSharedAccess.free()
    }

    findUser.free()
  }

  saveDb()

  res.status(201).json({
    message: 'Document created',
    documentId
  })
})

export default router