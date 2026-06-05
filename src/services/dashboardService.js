import api from "./api";

export const getDashboard= async()=>{
    const res = await api.get('/seller/dashboard')
    return res.data
}

export const getDashboardStats= async (period = 'month')=>{
    const res = await api.get(`/seller/statistics?period=${period}`)
    return res.data
}