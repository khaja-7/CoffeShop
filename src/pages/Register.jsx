import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Coffee, User, Phone, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form.name, form.email, form.password, form.phone);
    if (result.success) navigate('/menu');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-coffee-cream font-sans">

      {/* Left Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-coffee-dark relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-dark/90 via-coffee-dark/70 to-brand-orange/30" />
        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <Coffee className="text-brand-orange" size={40} />
          </div>
          <h2 className="text-5xl font-serif font-bold text-white mb-4">Join Us</h2>
          <p className="text-coffee-light text-lg leading-relaxed">
            Create your account and start ordering premium coffee delivered right to your doorstep.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-bold text-white">50+</p>
              <p className="text-xs text-white/60 mt-1">Coffee Blends</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-bold text-white">10k+</p>
              <p className="text-xs text-white/60 mt-1">Customers</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-bold text-white">4.9</p>
              <p className="text-xs text-white/60 mt-1">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <Coffee className="text-brand-orange" size={32} />
            <span className="text-2xl font-serif font-bold text-coffee-dark">CoffeeShop</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-coffee-dark mb-2">Create Account</h1>
          <p className="text-gray-500 mb-8">Fill in the details below to get started</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-coffee-dark mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Alex"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-coffee-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-coffee-dark mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-coffee-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-coffee-dark mb-2">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-coffee-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-coffee-dark mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-12 text-coffee-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-coffee-dark transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full bg-coffee-dark hover:bg-brand-orange text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-coffee-dark/20 hover:shadow-brand-orange/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-orange font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
