<template>
  <main class="page">
    <section class="card">
      <div class="header">
        <div>
          <h1>Dashboard</h1>
          <p>Logged in as {{ email }}</p>
        </div>

        <button class="logout" @click="logout">Log out</button>
      </div>

      <h2>Shared documents</h2>

      <p v-if="message" class="message">{{ message }}</p>

      <ul v-if="documents.length">
        <li v-for="document in documents" :key="document.id">
          <strong>{{ document.filename }}</strong>
          <span>{{ document.created_at }}</span>
        </li>
      </ul>

      <p v-else>No documents found.</p>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const documents = ref([])
const message = ref('')
const email = localStorage.getItem('email') || 'Unknown user'

async function loadDocuments() {
  const token = localStorage.getItem('token')

  const response = await fetch('http://localhost:3000/documents', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    message.value = data.message
    return
  }

  documents.value = data
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('email')
  router.push('/')
}

onMounted(loadDocuments)
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: radial-gradient(circle at top left, #064e3b, #020617 55%);
  font-family: Arial, sans-serif;
  padding: 48px;
  color: #dcfce7;
}

.card {
  max-width: 800px;
  margin: auto;
  padding: 34px;
  background: rgba(2, 6, 23, 0.92);
  border: 1px solid #22c55e;
  border-radius: 16px;
  box-shadow: 0 0 35px rgba(34, 197, 94, 0.18);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1, h2 {
  color: #86efac;
}

h1 {
  margin-bottom: 6px;
}

h2 {
  margin-top: 32px;
}

p {
  color: #bbf7d0;
}

ul {
  padding: 0;
  list-style: none;
}

li {
  display: flex;
  justify-content: space-between;
  padding: 14px;
  margin-top: 10px;
  border: 1px solid #166534;
  border-radius: 10px;
  background: #020617;
  color: #dcfce7;
}

li strong {
  color: #86efac;
}

button {
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: #16a34a;
  color: #02110a;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #22c55e;
}

.logout {
  background: #14532d;
  color: #dcfce7;
}

.logout:hover {
  background: #166534;
}

.message {
  color: #fca5a5;
}
</style>