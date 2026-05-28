import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Phone, ShoppingBag, Clock, ChevronRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user && token) fetchOrders();
  }, [user, token]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('Failed to fetch orders:', data);
        setOrders([]);
        if (res.status === 401) {
          logout();
          navigate('/login');
        }
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="py-6 min-h-full flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl p-12 shadow-sm border border-gray-100 max-w-md w-full">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={40} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-coffee-dark mb-2">Guest User</h2>
          <p className="text-gray-400 mb-8">Sign in to view your profile and order history</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-coffee-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-orange transition-colors shadow-md"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="border-2 border-coffee-dark text-coffee-dark px-8 py-3 rounded-xl font-bold hover:bg-coffee-dark hover:text-white transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 min-h-full">
      <h1 className="text-3xl font-serif font-bold text-coffee-dark mb-8">My Profile</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Card */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center lg:sticky lg:top-28">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-orange to-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-orange/20">
              <span className="text-3xl font-bold text-white">{user.name?.charAt(0).toUpperCase()}</span>
            </div>
            <h2 className="text-xl font-bold text-coffee-dark mb-1">{user.name}</h2>
            <p className="text-sm text-gray-400 mb-6">Member since 2026</p>

            <div className="space-y-3 text-left mb-8">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <Mail size={16} className="text-brand-orange flex-shrink-0" />
                <span className="text-sm text-coffee-dark truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <Phone size={16} className="text-brand-orange flex-shrink-0" />
                  <span className="text-sm text-coffee-dark">{user.phone}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 border border-red-200 py-3 rounded-xl font-semibold transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Orders Section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-coffee-dark">Order History</h2>
            <span className="text-sm text-gray-400">{orders.length} orders</span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
              <ShoppingBag size={48} className="mx-auto mb-4 text-gray-200" />
              <p className="text-gray-400 font-medium">No orders yet</p>
              <p className="text-sm text-gray-300 mt-1">Your order history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-coffee-dark">{order.id}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <Clock size={12} />
                        <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">{order.status}</span>
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  </div>
                  <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}: {order.items.map(i => i.name).join(', ')}
                    </p>
                    <p className="font-bold text-brand-orange">₹{order.total?.toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
