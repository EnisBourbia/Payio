import axios from 'axios'

export const Api = axios.create({
  baseURL: process.env.DJANGO_API_URL || 'http://localhost:8000/api',
  headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
})

export const Media_URL ={
  meidaURL: process.env.DJANGO_MEDIA_URL || 'http://localhost:8000',
}