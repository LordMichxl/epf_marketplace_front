import api from './api'

export const getAdminStats =() =>{
    return api.get('/admin/stats')
}

export const getUsers = (role = ' ',page = 1) =>{
    const params = {page}
    if (role) params.role = role
    return api.get('/admin/users', {params});
}

export const activateUser = (userId)=>{
    return api.post(`/admin/users/${userId}/activate`)
}
export const suspendUser = (userId)=>{
    return api.post(`/admin/users/${userId}/suspend`)
}

//Products

export const updateProductStatus = (productId, status) => {
  return api.patch(`/admin/products/${productId}/status`, { status })
}

export const forceDeleteProduct = (productId) => {
  return api.delete(`/admin/products/${productId}/force`)
}

export const getAdminCoupons = (page = 1) => {
  return api.get('/admin/coupons', { params: { page } })
}

export const createCoupon = (data) => {
  return api.post('/admin/coupons', data)
}

export const updateCoupon = (couponId, data) => {
  return api.put(`/admin/coupons/${couponId}`, data)
}

export const deleteCoupon = (couponId) => {
  return api.delete(`/admin/coupons/${couponId}`)
}
