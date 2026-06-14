import api from './api'

export const getConversations = () => {
  return api.get('/messages/conversations')
}

export const getThread = (userId, productId = null) => {
  const params = {}
  if (productId) params.product_id = productId
  return api.get(`/messages/with/${userId}`, { params })
}


export const sendMessage = (data) => {
  return api.post('/messages', data)
}

export const getUnreadCount = () => {
  return api.get('/messages/unread-count')
}