import { useState, useCallback } from 'react'
import * as productService from '../services/productService'
import toast from 'react-hot-toast'

export const useSeller = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Charger les produits du vendeur
  const fetchMyProducts = useCallback(async (status = null) => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await productService.getMyProducts(status)
      setProducts(res.data || [])
      return res.data || []
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors du chargement'
      setError(message)
      toast.error(message)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Créer un produit
  const createNewProduct = useCallback(async (formData) => {
    try {
      setError(null)
      const res = await productService.createProduct(formData)
      toast.success('Produit créé avec succès')
      await fetchMyProducts()
      return res.data
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la création'
      setError(message)
      toast.error(message)
      throw err
    }
  }, [fetchMyProducts])

  // Mettre à jour un produit
  const updateExistingProduct = useCallback(async (productId, formData) => {
    try {
      setError(null)
      const res = await productService.updateProduct(productId, formData)
      toast.success('Produit mis à jour')
      await fetchMyProducts()
      return res.data
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la mise à jour'
      setError(message)
      toast.error(message)
      throw err
    }
  }, [fetchMyProducts])

  // Supprimer un produit
  const deleteExistingProduct = useCallback(async (productId) => {
    try {
      setError(null)
      await productService.deleteProduct(productId)
      toast.success('Produit supprimé')
      await fetchMyProducts()
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la suppression'
      setError(message)
      toast.error(message)
      throw err
    }
  }, [fetchMyProducts])

  // Vérifier si un produit est en favori
  const checkIfFavorite = useCallback(async (productId) => {
    try {
      const res = await productService.isProductFavorite(productId)
      return res.data?.is_favorite || false
    } catch (err) {
      console.error('Error checking favorite:', err)
      return false
    }
  }, [])

  return {
    products,
    isLoading,
    error,
    fetchMyProducts,
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct,
    checkIfFavorite,
  }
}
