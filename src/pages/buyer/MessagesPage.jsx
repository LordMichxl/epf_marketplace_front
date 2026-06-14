import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { Send, MessageCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { getConversations, getThread, sendMessage} from '../../services/messageService'

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv]   = useState(null)
  const [messages, setMessages]           = useState([])
  const [newMessage, setNewMessage]       = useState('')
  const [loading, setLoading]             = useState(true)
  const [sending, setSending]             = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv.user?.id, selectedConv.product?.id)
    }
  }, [selectedConv])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await getConversations()
      setConversations(res.data.data || [])
    } catch {
      toast.error('Erreur lors du chargement des conversations')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (userId, productId = null) => {
    try {
      const res = await getThread(userId, productId)
      const msgs = (res.data.data || []).reverse()
      setMessages(msgs)
      setConversations(prev =>
        prev.map(c =>
          c.user?.id === userId
            ? { ...c, unread_count: 0 }
            : c
        )
      )
    } catch {
      toast.error('Erreur lors du chargement des messages')
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConv) return

    setSending(true)
    try {
      await sendMessage({
        recipient_id: selectedConv.user?.id,
        content:      newMessage.trim(),
        product_id:   selectedConv.product?.id || null,
      })

      setNewMessage('')

      fetchMessages(selectedConv.user?.id, selectedConv.product?.id)

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de l'envoi"
      )
    } finally {
      setSending(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10
                      border-b-2 border-indigo-500"/>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messagerie</h1>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden
                      flex h-[600px]">

        <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">

          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">Conversations</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-10 px-4">
                <MessageCircle size={40}
                               className="mx-auto text-gray-300 mb-2"/>
                <p className="text-sm text-gray-400">Aucune conversation</p>
              </div>
            ) : (
              conversations.map((conv, index) => {
                const isSelected = selectedConv?.user?.id === conv.user?.id

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedConv(conv)}
                    className={`p-4 cursor-pointer hover:bg-gray-50
                                transition-colors border-b border-gray-50
                      ${isSelected
                        ? 'bg-indigo-50 border-l-4 border-l-indigo-500'
                        : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full
                                      flex items-center justify-center
                                      text-indigo-800 font-bold shrink-0">
                        {conv.user?.name?.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 truncate">
                            {conv.user?.name}
                          </p>
                          {conv.unread_count > 0 && (
                            <span className="bg-red-500 text-white
                                             text-xs font-bold w-5 h-5
                                             rounded-full flex items-center
                                             justify-center shrink-0 ml-1">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {/* Nom du produit si la conversation concerne un produit */}
                          {conv.product && (
                            <span className="text-indigo-400">
                              {conv.product.title} ·{' '}
                            </span>
                          )}
                          {conv.last_message?.content || 'Aucun message'}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ── Zone messages ── */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              {/* En-tête */}
              <div className="p-4 border-b border-gray-100
                              flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-100 rounded-full
                                flex items-center justify-center
                                text-indigo-800 font-bold">
                  {selectedConv.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedConv.user?.name}
                  </p>
                  {selectedConv.product && (
                    <p className="text-xs text-indigo-800">
                      À propos de : {selectedConv.product.title}
                    </p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    Commencez la conversation !
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.sender?.id === user?.id

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe
                          ? 'justify-end'
                          : 'justify-start'}`}
                      >
                        <div className={`max-w-xs px-4 py-2 rounded-2xl
                                         text-sm
                          ${isMe
                            ? 'bg-indigo-800 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                          }`}>
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1
                            ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString(
                              'fr-FR',
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef}/>
              </div>

              {/* Formulaire d'envoi */}
              <form
                onSubmit={handleSend}
                className="p-4 border-t border-gray-100 flex gap-2"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Écrire un message..."
                  className="flex-1 border border-gray-200 rounded-xl
                             px-4 py-2 text-sm focus:outline-none
                             focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-indigo-700 text-white p-2 rounded-xl
                             hover:bg-indigo-800 transition-colors
                             disabled:opacity-50"
                >
                  <Send size={18}/>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center
                            text-center px-8">
              <div>
                <MessageCircle size={60}
                               className="mx-auto text-gray-300 mb-4"/>
                <p className="text-gray-500">
                  Sélectionnez une conversation
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  ou contactez un vendeur depuis la page d'un produit
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}