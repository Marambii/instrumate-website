import axios from 'axios';

const api = axios.create({
  // Ensure this matches your Django server address
  baseURL: 'http://127.0.0.1:8000/auth/',
  withCredentials: true, // MANDATORY: Allows cookies to be sent/received
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;