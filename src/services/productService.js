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

// Créer un avis/notation sur un produit
export const createProductReview = (productId, data) => {
  return api.post(`/products/${productId}/reviews`, data);
};