import api from './api'

const authService = {
  register: async (data) => {
    const res = await api.post('/auth/register', data)
    return res.data
  },

  login: async (data) => {
    const res = await api.post('/auth/login', data)
    return res.data // { token, user, message }
  },

  logout: async () => {
    await api.post('/auth/logout')
  },

  me: async () => {
    const res = await api.get('/auth/me')
    return res.data.user // Retourner directement l'objet user
  },

  updateProfile: async (formData) => {
    const res = await api.put('/auth/profile', formData, {
        headers:{ 'Content-Type': 'multipart/form-data',}
    })
    return res.data
  },
}

export default authService