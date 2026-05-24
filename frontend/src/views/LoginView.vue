<template>
  <main class="page">
    <section class="card">
      <h1>SSSecureAuth</h1>
      <p>Secure document sharing prototype</p>

      <form @submit.prevent="login">
        <label>Email</label>
        <input v-model="email" type="email" />

        <label>Password</label>
        <input v-model="password" type="password" />

        <button type="submit">Log in</button>
      </form>

      <p class="message">{{ message }}</p>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('nadia@test.com')
const password = ref('test123')
const message = ref('')

async function login() {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })

  const data = await response.json()

  if (!response.ok) {
    message.value = data.message
    return
  }

  localStorage.setItem('token', data.token)
  localStorage.setItem('email', data.email)

  router.push('/dashboard')
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top, #064e3b, #020617 55%);
  font-family: Arial, sans-serif;
  color: #dcfce7;
}

.card {
  width: 380px;
  padding: 34px;
  background: rgba(2, 6, 23, 0.92);
  border: 1px solid #22c55e;
  border-radius: 16px;
  box-shadow: 0 0 35px rgba(34, 197, 94, 0.18);
}

h1 {
  margin-bottom: 8px;
  color: #86efac;
  letter-spacing: 1px;
}

p {
  color: #bbf7d0;
}

label {
  display: block;
  margin-top: 16px;
  margin-bottom: 6px;
  color: #dcfce7;
}

input {
  width: 100%;
  padding: 11px;
  border: 1px solid #166534;
  border-radius: 8px;
  background: #020617;
  color: #dcfce7;
}

input:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
}

button {
  width: 100%;
  margin-top: 22px;
  padding: 12px;
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

.message {
  margin-top: 14px;
  color: #fca5a5;
}
</style>