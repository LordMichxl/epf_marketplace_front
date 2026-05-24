import api from './api'

const authService = {
  register: async (data) => {
    const res = await api.post('/auth/register', data)
    return res.data
  },

  login: async (data) => {
    const res = await api.post('/auth/login', data)
    return res.data // { token, user }
  },

  logout: async () => {
    await api.post('/auth/logout')
  },

  me: async () => {
    const res = await api.get('/auth/me')
    return res.data
  },

  updateProfile: async (data) => {
    const res = await api.put('/auth/profile', data)
    return res.data
  },
}

export default authService