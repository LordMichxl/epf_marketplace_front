import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Package, ChevronDown, ChevronUp } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my-orders");
      setOrders(res.data.data || res.data || []);
    } catch (err) {
      toast.error("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "En attente",
      confirmed: "Confirmée",
      shipped: "Expédiée",
      delivered: "Livrée",
      cancelled: "Annulée",
    };
    return labels[status] || status;
  };

  const handleToggleOrder = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      // Charger les détails complets si disponibles
      if (!orderDetails[orderId]) {
        try {
          const res = await api.get(`/orders/${orderId}`);
          setOrderDetails(prev => ({
            ...prev,
            [orderId]: res.data.data || res.data
          }));
        } catch (err) {
          // Silently handle error - display available data
        }
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes Commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={60} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Aucune commande pour l'instant</p>
          <Link
            to="/products"
            className="mt-4 inline-block bg-indigo-800 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Faire mes premiers achats
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">

              {/* Header commande */}
              <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleToggleOrder(order.id)}
              >
                <div className="flex items-center gap-4">
                  <Package size={20} className="text-indigo-500" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Commande #{order.id}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="font-bold text-indigo-800">
                    {Number(order.total_amount).toLocaleString()} FCFA
                  </span>
                  {expandedOrder === order.id
                    ? <ChevronUp size={18} className="text-gray-400" />
                    : <ChevronDown size={18} className="text-gray-400" />
                  }
                </div>
              </div>

              {/* Détail commande (expandable) */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  {(() => {
                    const displayOrder = orderDetails[order.id] || order;
                    return (
                      <>
                        {/* Articles */}
                        <div className="mb-6">
                          <h3 className="font-semibold text-gray-900 mb-3">Articles commandés</h3>
                          <div className="space-y-3">
                            {displayOrder.items?.length > 0 ? (
                              displayOrder.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {item.product?.images?.[0] ? (
                                      <img
                                        src={item.product.images[0]}
                                        alt={item.product.title}
                                        className="w-full h-full object-cover rounded-lg"
                                      />
                                    ) : (
                                      <span className="text-xl">📦</span>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <Link
                                      to={`/products/${item.product?.id}`}
                                      className="text-sm font-medium text-gray-900 hover:text-indigo-800"
                                    >
                                      {item.product?.title}
                                    </Link>
                                    <p className="text-xs text-gray-400">Quantité : {item.quantity}</p>
                                  </div>
                                  <p className="text-sm font-bold text-gray-900">
                                    {Number(item.unit_price * item.quantity || item.price * item.quantity || 0).toLocaleString()} FCFA
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 bg-white p-3 rounded-lg">
                                {displayOrder.item_count ? `${displayOrder.item_count} article(s) dans la commande` : 'Aucun article'}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Adresse de livraison */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h3 className="font-semibold text-gray-900 mb-3">Adresse de livraison</h3>
                          <div className="bg-white p-3 rounded-lg">
                            {displayOrder.shipping_address ? (
                              <>
                                <p className="text-sm text-gray-900 font-medium">{displayOrder.customer_name}</p>
                                <p className="text-sm text-gray-900">{displayOrder.shipping_address}</p>
                                <p className="text-sm text-gray-600">{displayOrder.shipping_city} {displayOrder.shipping_postal_code}</p>
                                {displayOrder.shipping_phone && (
                                  <p className="text-sm text-gray-600 mt-2">📞 {displayOrder.shipping_phone}</p>
                                )}
                              </>
                            ) : (
                              <p className="text-sm text-gray-500">Adresse non disponible</p>
                            )}
                          </div>
                        </div>

                        {/* Résumé financier */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h3 className="font-semibold text-gray-900 mb-3">Résumé</h3>
                          <div className="space-y-2 bg-white p-3 rounded-lg">
                            {displayOrder.subtotal && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Sous-total :</span>
                                <span className="text-gray-900">{Number(displayOrder.subtotal).toLocaleString()} FCFA</span>
                              </div>
                            )}
                            {displayOrder.shipping_cost && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Frais de livraison :</span>
                                <span className="text-gray-900">{Number(displayOrder.shipping_cost).toLocaleString()} FCFA</span>
                              </div>
                            )}
                            {displayOrder.discount && (
                              <div className="flex justify-between text-sm text-green-600">
                                <span>Réduction :</span>
                                <span>-{Number(displayOrder.discount).toLocaleString()} FCFA</span>
                              </div>
                            )}
                            <div className="flex justify-between font-bold text-sm border-t pt-2">
                              <span>Total :</span>
                              <span className="text-indigo-800">{Number(displayOrder.total_amount).toLocaleString()} FCFA</span>
                            </div>
                          </div>
                        </div>

                        {/* Coupon */}
                        {displayOrder.coupon_code && (
                          <div className="mb-6">
                            <p className="text-sm text-green-600">
                              🎟️ Coupon appliqué : <span className="font-medium">{displayOrder.coupon_code}</span>
                            </p>
                          </div>
                        )}

                        {/* Infos supplémentaires */}
                        <div className="text-xs text-gray-500">
                          <p>Numéro de commande : {displayOrder.order_number || displayOrder.id}</p>
                          <p>Passée le : {new Date(displayOrder.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}