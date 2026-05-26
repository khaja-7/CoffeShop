import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Coffee, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) navigate('/menu');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-coffee-cream font-sans">
      
      {/* Left Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-coffee-dark relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-dark/90 via-coffee-dark/70 to-brand-orange/30" />
        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <Coffee className="text-brand-orange" size={40} />
          </div>
          <h2 className="text-5xl font-serif font-bold text-white mb-4">Welcome Back</h2>
          <p className="text-coffee-light text-lg leading-relaxed">
            Sign in to order your favorite brew, track deliveries, and enjoy exclusive member offers.
          </p>
          <div className="mt-12 flex items-center justify-center gap-3 text-white/60 text-sm">
            <div className="w-12 h-[1px] bg-white/20" />
            <span>Freshly roasted, delivered daily</span>
            <div className="w-12 h-[1px] bg-white/20" />
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

          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-coffee-dark mb-2">Sign In</h1>
          <p className="text-gray-500 mb-8">Enter your credentials to access your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-coffee-dark mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  placeholder="you@example.com"
                  required
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
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  placeholder="Enter your password"
                  required
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
              className="group w-full bg-coffee-dark hover:bg-brand-orange text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-coffee-dark/20 hover:shadow-brand-orange/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-orange font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
