import { useState, useEffect } from 'react';
import { Search, Plus, Star, Loader2 } from 'lucide-react';
import useCartStore from '../store/cartStore';

const API_URL = 'http://localhost:5000/api';
const categories = ['All', 'Hot Coffee', 'Cold Coffee', 'Snacks'];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const addToCart = useCartStore(state => state.addItem);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 800);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-6 min-h-full">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-coffee-dark">Our Menu</h1>
        <p className="text-gray-400 mt-1">Choose from our premium selection</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="md:sticky md:top-28 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search coffee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm text-coffee-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all shadow-sm"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar md:flex-col md:gap-1 md:overflow-visible">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap text-sm font-semibold transition-all text-left px-4 py-3 rounded-xl ${
                    activeCategory === category
                      ? 'bg-coffee-dark text-white shadow-md shadow-coffee-dark/10'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-coffee-dark'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="animate-spin text-brand-orange" size={40} />
            </div>
          ) : (
            <>
              <div className="hidden md:flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-bold text-coffee-dark">
                  {activeCategory === 'All' ? 'All Products' : activeCategory}
                </h2>
                <span className="text-sm text-gray-400">{filteredProducts.length} items</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-brand-orange/20"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-coffee-dark">{product.rating}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-coffee-dark text-lg leading-tight">{product.name}</h3>
                        <span className="text-xs font-medium text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                          {product.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-coffee-dark">
                          ₹{product.price.toFixed(0)}
                        </span>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-90 ${
                            addedId === product.id 
                              ? 'bg-green-500 text-white shadow-md shadow-green-500/20' 
                              : 'bg-coffee-dark text-white hover:bg-brand-orange shadow-md shadow-coffee-dark/10 hover:shadow-brand-orange/20'
                          }`}
                        >
                          <Plus size={16} />
                          {addedId === product.id ? 'Added!' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                  <Search size={48} className="mx-auto mb-4 text-gray-200" />
                  <p className="text-lg font-medium text-gray-400">No items found</p>
                  <p className="text-sm text-gray-300 mt-1">Try a different search or category</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
