import api from "./api";

export const getSellerOrders = ( status = '', page = 1) =>{
    const params = {page}
    if (status) params.status = status
    return api.get('/seller/orders', { params})
}

export const updateOrderStatus = (orderId, status) => {
    return api.put(`/orders/${orderId}/status`, { status })
}