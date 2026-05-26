import { NavLink } from 'react-router-dom';
import { Home, Coffee, ShoppingCart, User } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
  const itemsCount = useCartStore(state => state.items.length);
  const user = useAuthStore(state => state.user);

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/menu', icon: Coffee, label: 'Menu' },
    { to: '/cart', icon: ShoppingCart, label: 'Cart' },
    { to: user ? '/profile' : '/login', icon: User, label: user ? 'Profile' : 'Login' },
  ];

  return (
    <nav className="fixed z-50 bg-white/95 backdrop-blur-md border-gray-100
      bottom-0 left-0 right-0 border-t rounded-t-3xl px-6 py-3
      md:top-0 md:bottom-auto md:rounded-none md:border-t-0 md:border-b md:py-0 md:px-8
      shadow-[0_-4px_20px_rgba(0,0,0,0.04)] md:shadow-sm transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full md:h-16">
        {/* Desktop Logo */}
        <NavLink to="/" className="hidden md:flex items-center gap-2 text-coffee-dark font-serif font-bold text-xl hover:text-brand-orange transition-colors">
          <Coffee className="text-brand-orange" size={24} />
          <span>CoffeeShop</span>
        </NavLink>

        {/* Nav Items */}
        <div className="flex justify-between md:justify-end items-center w-full md:w-auto md:gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to + item.label}
              to={item.to}
              className={({ isActive }) =>
                `relative flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 md:py-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-brand-orange md:bg-brand-orange/10'
                    : 'text-gray-400 hover:text-coffee-dark md:hover:bg-gray-50'
                }`
              }
            >
              <item.icon size={22} strokeWidth={2} />
              <span className="text-[10px] md:text-xs font-semibold">{item.label}</span>
              {item.to === '/cart' && itemsCount > 0 && (
                <span className="absolute -top-1 right-0 md:-top-1 md:right-0 bg-brand-orange text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                  {itemsCount}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
