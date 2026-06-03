import api from "./api";

// Liste des produits avec filtres
export const getProducts = (params = {}) => {
  return api.get("/products", { params });
};

// Détail d'un produit
export const getProduct = (id) => {
  return api.get(`/products/${id}`);
};

// Avis d'un produit
export const getProductReviews = (id) => {
  return api.get(`/products/${id}/reviews`);
};

// Top ventes
export const getTopSelling = (limit = 10) => {
  return api.get("/products/top-selling", { params: { limit } });
};

// Catégories
export const getCategories = () => {
  return api.get("/categories");
};

// Détail catégorie
export const getCategory = (id) => {
  return api.get(`/categories/${id}`);
};

// Recherche globale
export const searchAll = (q, type = "all", limit = 12) => {
  return api.get("/search", { params: { q, type, limit } });
};

//Partie seller
export const getMyProducts = async (statut = '') => {
  const params = statut ? { status: statut } : {};
  const res = await api.get("/products/my-products", { params })
  return res.data.data ?? res.data
}
export const createProduct = (formData) => {
  return api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const updateProduct = (id, formData) => {
  formData.append('_method', 'PUT')
  return api.post(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`)
}

export const getStatistics = () => {
  return api.get('/seller/statistics')
}