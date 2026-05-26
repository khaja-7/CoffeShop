import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Plus, Minus, Trash2, ShoppingBag, ArrowRight,
  Home, Briefcase, MapPin, Sparkles, Check, AlertCircle, 
  CreditCard, QrCode, Lock, X, BellOff, PhoneCall, ShieldCheck,
  Percent, Gift, Landmark, Truck
} from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MOCK_ADDRESSES = [
  { id: 1, type: 'Home', label: 'Home Address', detail: 'Flat 402, Oakwood Residency, Brew Avenue, Sector 52' },
  { id: 2, type: 'Work', label: 'Office Desk', detail: 'Tech Park, Block B, 5th Floor, Espresso Labs Inc.' }
];

const AVAILABLE_COUPONS = [
  { code: 'COFFEE20', discountType: 'percentage', value: 20, desc: '20% OFF on all coffees (no minimum order)' },
  { code: 'WELCOME50', discountType: 'flat', value: 50, desc: '₹50 OFF on orders above ₹150', minOrder: 150 }
];

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const { user, token } = useAuthStore();

  // State Variables
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  
  // Zomato/Swiggy state
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [newAddressText, setNewAddressText] = useState('');
  const [showAddressInput, setShowAddressInput] = useState(false);

  const [cookingInstructions, setCookingInstructions] = useState('');
  const [tipAmount, setTipAmount] = useState(0); // 0, 20, 30, 50, 100
  const [deliveryInstructions, setDeliveryInstructions] = useState({
    avoidCalling: false,
    leaveAtDoor: false,
    noRingBell: false,
    leaveWithSecurity: false
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // coupon object
  const [couponError, setCouponError] = useState('');
  const [couponSuccessMsg, setCouponSuccessMsg] = useState('');

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking', 'cod'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay'); // 'gpay', 'phonepe', 'paytm'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [paymentProgress, setPaymentProgress] = useState(0); // 0: idle, 1: connecting, 2: authenticating, 3: success
  const [paymentProgressText, setPaymentProgressText] = useState('');

  // Calculations
  const itemTotal = getTotal();
  const gstAndServiceFee = itemTotal > 0 ? 25 : 0; // Flat packaging & GST
  
  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (itemTotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.discountType === 'flat') {
      discount = appliedCoupon.value;
    }
  }

  const grandTotal = Math.max(0, itemTotal + gstAndServiceFee + tipAmount - discount);

  // Address Handler
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;
    const newAddress = {
      id: Date.now(),
      type: 'Other',
      label: 'Custom Address',
      detail: newAddressText
    };
    setAddresses([...addresses, newAddress]);
    setSelectedAddressId(newAddress.id);
    setNewAddressText('');
    setShowAddressInput(false);
  };

  // Tipping Handler
  const handleTipClick = (amount) => {
    setTipAmount(prev => prev === amount ? 0 : amount);
  };

  // Coupon Handler
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccessMsg('');
    const codeUpper = couponCode.trim().toUpperCase();

    const coupon = AVAILABLE_COUPONS.find(c => c.code === codeUpper);
    if (!coupon) {
      setCouponError('Invalid coupon code. Try COFFEE20 or WELCOME50.');
      return;
    }

    if (coupon.minOrder && itemTotal < coupon.minOrder) {
      setCouponError(`Minimum order value of ₹${coupon.minOrder} required for this coupon.`);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponSuccessMsg(`Coupon ${coupon.code} applied successfully! Discount: ₹${coupon.discountType === 'flat' ? coupon.value : ((itemTotal * coupon.value) / 100).toFixed(0)}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccessMsg('');
    setCouponCode('');
  };

  // Payment Execution & Order Placement
  const handlePayment = async () => {
    setPaymentProgress(1);
    setPaymentProgressText('Securing connection with payment gateway...');

    setTimeout(() => {
      setPaymentProgress(2);
      setPaymentProgressText('Authorizing transaction with bank...');

      setTimeout(() => {
        setPaymentProgress(3);
        setPaymentProgressText('Payment Approved! Placing order...');

        setTimeout(async () => {
          await submitOrder();
        }, 1000);
      }, 1500);
    }, 1500);
  };

  const submitOrder = async () => {
    const addressObject = addresses.find(a => a.id === selectedAddressId);
    const addressStr = `${addressObject ? addressObject.type : 'Other'}: ${addressObject ? addressObject.detail : 'Default Delivery Address'}`;
    const formattedNote = `Cooking request: ${cookingInstructions || 'None'} | Tip: ₹${tipAmount} | Instructions: ${Object.keys(deliveryInstructions).filter(k => deliveryInstructions[k]).join(', ') || 'None'}`;

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          total: grandTotal,
          address: `${addressStr} (${formattedNote})`
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setOrderSuccess(data.order.id);
        clearCart();
        setShowPaymentModal(false);
      } else {
        alert(data.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Order placement failed:', err);
      alert('Network error. Failed to connect to server.');
    } finally {
      setPaymentProgress(0);
    }
  };

  const handleCheckoutClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowPaymentModal(true);
  };

  if (orderSuccess) {
    return (
      <div className="py-12 min-h-full flex items-center justify-center bg-coffee-cream/30">
        <div className="text-center bg-white rounded-[2.5rem] p-12 shadow-2xl border border-coffee-light/20 max-w-md w-full relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl" />

          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-50">
            <Check className="text-green-600 animate-bounce" size={48} strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-serif font-black text-coffee-dark mb-3">Order Placed! ☕</h2>
          <p className="text-gray-500 mb-6 font-medium">Your coffee is brewing and our delivery partner is on the way.</p>
          
          <div className="bg-coffee-cream/60 rounded-2xl p-4 border border-coffee-light/10 mb-8">
            <span className="text-xs uppercase font-extrabold tracking-widest text-gray-400 block mb-1">Order Identifier</span>
            <span className="text-lg font-serif font-bold text-coffee-dark">{orderSuccess}</span>
          </div>

          <button
            onClick={() => { setOrderSuccess(null); navigate('/menu'); }}
            className="w-full bg-coffee-dark text-white py-4 rounded-xl font-bold hover:bg-brand-orange transition-colors shadow-lg shadow-coffee-dark/20"
          >
            Track Order & Drink
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-full flex flex-col max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate('/menu')} className="p-3 hover:bg-white rounded-full transition-colors border border-coffee-light/10 shadow-sm bg-white/50">
          <ChevronLeft size={22} className="text-coffee-dark" />
        </button>
        <h1 className="text-3xl font-black font-serif text-coffee-dark">Your Basket</h1>
        <div className="w-12" />
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl p-16 border border-dashed border-coffee-light/40 shadow-sm">
          <div className="w-24 h-24 bg-brand-orange/10 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={42} className="text-brand-orange" />
          </div>
          <h2 className="text-2xl text-coffee-dark font-black font-serif mb-2">No Brews Added</h2>
          <p className="text-gray-400 mb-8 max-w-xs text-center font-medium">Your basket is empty. Browse our premium coffees and snacks.</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-coffee-dark text-white px-10 py-4 rounded-full font-bold hover:bg-brand-orange transition-all duration-300 shadow-lg shadow-coffee-dark/20 active:scale-95"
          >
            View Cafe Menu
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Details Area */}
          <div className="flex-1 space-y-6 w-full">
            
            {/* Delivery Address Selector */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-coffee-light/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-black text-lg text-coffee-dark flex items-center gap-2">
                  <MapPin size={18} className="text-brand-orange" />
                  Select Delivery Address
                </h3>
                <button 
                  onClick={() => setShowAddressInput(!showAddressInput)}
                  className="text-xs font-bold text-brand-orange hover:underline"
                >
                  {showAddressInput ? 'Cancel' : '+ Add Address'}
                </button>
              </div>

              {showAddressInput && (
                <form onSubmit={handleAddAddress} className="mb-4 space-y-2">
                  <input
                    type="text"
                    value={newAddressText}
                    onChange={(e) => setNewAddressText(e.target.value)}
                    placeholder="Enter complete address details..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-coffee-dark text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-brand-orange transition-colors"
                  >
                    Save Address
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex gap-3 ${
                      selectedAddressId === address.id
                        ? 'border-brand-orange bg-brand-orange/5 shadow-sm'
                        : 'border-gray-100 hover:border-coffee-light/60 bg-white'
                    }`}
                  >
                    <div className="mt-1">
                      {address.type === 'Home' ? (
                        <Home size={18} className="text-coffee-dark" />
                      ) : address.type === 'Work' ? (
                        <Briefcase size={18} className="text-coffee-dark" />
                      ) : (
                        <MapPin size={18} className="text-coffee-dark" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-coffee-dark">{address.label}</p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{address.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Items list */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-coffee-light/10">
              <h3 className="font-serif font-black text-lg text-coffee-dark mb-4 flex items-center gap-2">
                <ShoppingBag size={18} className="text-brand-orange" />
                Review Basket Items
              </h3>
              
              <div className="divide-y divide-gray-100">
                {items.map(item => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover flex-shrink-0 border border-coffee-light/10"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-coffee-dark text-base truncate">{item.name}</h4>
                      <p className="text-brand-orange font-bold mt-0.5">₹{item.price.toFixed(0)}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-50 rounded-full border border-gray-100">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-white rounded-full text-gray-500 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-coffee-dark">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-white rounded-full text-gray-500 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1.5"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Cooking / Preparation Requests */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-coffee-light/10">
              <h3 className="font-serif font-black text-lg text-coffee-dark mb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-brand-orange" />
                Custom Preparation Request
              </h3>
              <p className="text-xs text-gray-400 mb-3">Leave instructions for your barista (e.g. extra espresso shot, less sugar, hot temperature)</p>
              <textarea
                value={cookingInstructions}
                onChange={(e) => setCookingInstructions(e.target.value)}
                placeholder="Write requests for the shop barista..."
                rows={2}
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 placeholder-gray-300"
              />
            </div>

            {/* Tipping Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-coffee-light/10">
              <div className="mb-2">
                <h3 className="font-serif font-black text-lg text-coffee-dark flex items-center gap-2">
                  <Gift size={18} className="text-brand-orange" />
                  Tip Your Delivery Partner
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Support our delivery riders. 100% of your generous tips go directly to the rider.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 mt-4">
                {[20, 30, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleTipClick(amount)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
                      tipAmount === amount
                        ? 'bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/15 scale-105'
                        : 'bg-white text-coffee-dark border-gray-100 hover:border-coffee-light/50'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Instructions Toggles */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-coffee-light/10">
              <h3 className="font-serif font-black text-lg text-coffee-dark mb-4 flex items-center gap-2">
                <Truck size={18} className="text-brand-orange" />
                Delivery Instructions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setDeliveryInstructions(prev => ({ ...prev, avoidCalling: !prev.avoidCalling }))}
                  className={`p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 ${
                    deliveryInstructions.avoidCalling
                      ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                      : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-coffee-light/50 hover:text-coffee-dark'
                  }`}
                >
                  <PhoneCall size={18} />
                  <span className="text-[10px] font-bold">Avoid Calling</span>
                </button>

                <button
                  onClick={() => setDeliveryInstructions(prev => ({ ...prev, leaveAtDoor: !prev.leaveAtDoor }))}
                  className={`p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 ${
                    deliveryInstructions.leaveAtDoor
                      ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                      : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-coffee-light/50 hover:text-coffee-dark'
                  }`}
                >
                  <Home size={18} />
                  <span className="text-[10px] font-bold">Leave at Gate</span>
                </button>

                <button
                  onClick={() => setDeliveryInstructions(prev => ({ ...prev, noRingBell: !prev.noRingBell }))}
                  className={`p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 ${
                    deliveryInstructions.noRingBell
                      ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                      : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-coffee-light/50 hover:text-coffee-dark'
                  }`}
                >
                  <BellOff size={18} />
                  <span className="text-[10px] font-bold">Don't Ring Bell</span>
                </button>

                <button
                  onClick={() => setDeliveryInstructions(prev => ({ ...prev, leaveWithSecurity: !prev.leaveWithSecurity }))}
                  className={`p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 ${
                    deliveryInstructions.leaveWithSecurity
                      ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                      : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-coffee-light/50 hover:text-coffee-dark'
                  }`}
                >
                  <ShieldCheck size={18} />
                  <span className="text-[10px] font-bold">With Security</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="w-full lg:w-80 flex-shrink-0">
            
            {/* Promo Code Card */}
            <div className="bg-white rounded-3xl p-5 mb-6 border border-coffee-light/10 shadow-sm">
              <h4 className="font-serif font-black text-sm text-coffee-dark mb-3 flex items-center gap-1.5">
                <Percent size={16} className="text-brand-orange" />
                Apply Coupon Codes
              </h4>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-green-700 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <Check size={14} className="stroke-[3]" />
                    <span>{appliedCoupon.code} Applied!</span>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon} 
                    className="text-gray-400 hover:text-red-500 font-extrabold text-sm"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter (e.g. COFFEE20)"
                    className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/20 uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-coffee-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-brand-orange transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && <p className="text-red-500 text-[10px] font-bold mt-2 flex items-center gap-1"><AlertCircle size={10} />{couponError}</p>}
              {couponSuccessMsg && <p className="text-green-600 text-[10px] font-bold mt-2 flex items-center gap-1"><Check size={10} />{couponSuccessMsg}</p>}

              {!appliedCoupon && (
                <div className="mt-3 border-t border-gray-50 pt-2 space-y-2">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Available Coupons</p>
                  {AVAILABLE_COUPONS.map(c => (
                    <div key={c.code} className="text-[11px] font-medium text-gray-500 flex justify-between gap-2">
                      <span className="font-extrabold text-coffee-dark uppercase">{c.code}</span>
                      <span className="text-right text-gray-400 line-clamp-1">{c.desc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="bg-coffee-dark rounded-[2rem] p-6 text-white shadow-xl">
              <h3 className="font-serif text-lg font-bold mb-5 border-b border-white/10 pb-3">Bill Details</h3>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Item Total</span>
                  <span className="text-white font-semibold">₹{itemTotal.toFixed(0)}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>GST & Restaurant Charges</span>
                  <span className="text-white font-semibold">₹{gstAndServiceFee.toFixed(0)}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Delivery Fee</span>
                  <div className="flex gap-1.5 items-center">
                    <span className="line-through text-gray-500">₹40</span>
                    <span className="text-emerald-400 font-extrabold">FREE</span>
                  </div>
                </div>

                {tipAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Delivery Partner Tip</span>
                    <span className="font-bold">₹{tipAmount}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-yellow-300">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span className="font-bold">-₹{discount.toFixed(0)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 mt-5">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-sm">To Pay</span>
                  <span className="text-2xl text-brand-orange font-black">₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>

              {/* Terms Warning */}
              <div className="mt-5 bg-white/5 rounded-xl p-3 border border-white/5 text-[10px] text-gray-400 leading-relaxed">
                <span>Free cancellation is not available once the kitchen accepts this order.</span>
              </div>

              <button
                onClick={handleCheckoutClick}
                disabled={placing}
                className="group w-full bg-white text-coffee-dark py-4 rounded-xl font-bold text-base hover:bg-brand-orange hover:text-white transition-all duration-300 shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-5"
              >
                {user ? 'Proceed to Pay' : 'Login to Checkout'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-dark/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl z-10 border border-coffee-light/10 overflow-hidden flex flex-col md:flex-row h-[500px] max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full p-1.5 transition-colors border border-gray-100 z-20"
            >
              <X size={18} />
            </button>

            {/* Left Payment Selector Tabs */}
            <div className="w-full md:w-56 bg-coffee-cream/40 border-b md:border-b-0 md:border-r border-coffee-light/10 p-5 pt-8 flex flex-row md:flex-col gap-2.5 overflow-x-auto md:overflow-x-visible">
              <div className="hidden md:block mb-5">
                <span className="text-[9px] uppercase font-extrabold tracking-widest text-gray-400 block mb-1">Payable Total</span>
                <span className="text-2xl font-serif font-black text-coffee-dark">₹{grandTotal}</span>
              </div>

              {['upi', 'card', 'netbanking', 'cod'].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`px-4 py-3 rounded-xl font-bold text-xs text-left transition-all duration-200 whitespace-nowrap md:w-full flex items-center gap-2 ${
                    paymentMethod === method
                      ? 'bg-coffee-dark text-white shadow-md'
                      : 'bg-white text-coffee-dark border border-gray-50 hover:border-coffee-light/30'
                  }`}
                >
                  {method === 'upi' && <QrCode size={14} />}
                  {method === 'card' && <CreditCard size={14} />}
                  {method === 'netbanking' && <Landmark size={14} />}
                  {method === 'cod' && <Truck size={14} />}
                  <span className="capitalize">{method === 'netbanking' ? 'Net Banking' : method === 'cod' ? 'Cash on Delivery' : method}</span>
                </button>
              ))}
            </div>

            {/* Right Payment Action details */}
            <div className="flex-1 p-6 md:p-8 pt-10 flex flex-col justify-between overflow-y-auto">
              
              {/* Payment Details Area */}
              <div className="space-y-4">
                {paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <h4 className="font-serif font-black text-lg text-coffee-dark">Pay using UPI Apps</h4>
                    <p className="text-xs text-gray-400">Select app to process transaction securely</p>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {['gpay', 'phonepe', 'paytm'].map(app => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setSelectedUpiApp(app)}
                          className={`p-3.5 rounded-xl border text-center transition-all duration-200 capitalize font-bold text-xs ${
                            selectedUpiApp === app
                              ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                              : 'border-gray-100 hover:border-coffee-light/40'
                          }`}
                        >
                          {app === 'gpay' ? 'Google Pay' : app === 'phonepe' ? 'PhonePe' : 'Paytm'}
                        </button>
                      ))}
                    </div>

                    {/* Simulated QR Code Visual */}
                    <div className="border border-coffee-light/10 rounded-2xl p-4 bg-coffee-cream/30 flex flex-col items-center justify-center gap-2 max-w-[200px] mx-auto">
                      <QrCode size={96} className="text-coffee-dark" />
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Scan QR to Pay</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <h4 className="font-serif font-black text-lg text-coffee-dark">Credit or Debit Card</h4>
                    
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="block font-bold text-coffee-dark mb-1">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                            placeholder="4111 2222 3333 4444"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                          />
                          <CreditCard size={14} className="absolute right-3.5 top-3.5 text-gray-300" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-coffee-dark mb-1">Expiry Date</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').replace(/(.{2})/g, '$1/').replace(/\/$/, ''))}
                            placeholder="MM/YY"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-coffee-dark mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="***"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-coffee-dark mb-1">Name on Card</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Cardholder Name"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-4">
                    <h4 className="font-serif font-black text-lg text-coffee-dark">Select Your Bank</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map(bank => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-3 rounded-xl border text-left transition-all duration-200 font-bold ${
                            selectedBank === bank
                              ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                              : 'border-gray-100 hover:border-coffee-light/40'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="space-y-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <h4 className="font-serif font-black text-lg text-coffee-dark">Cash on Delivery</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      You can pay via Cash, Card, or UPI directly to our delivery executive when your hot coffee reaches you.
                    </p>
                  </div>
                )}
              </div>

              {/* CTA Payment Action Button */}
              <div className="pt-6 border-t border-gray-50 mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><Lock size={12} /> Secure 256-bit encryption</span>
                  <span>Amount: ₹{grandTotal}</span>
                </div>
                <button
                  onClick={handlePayment}
                  className="w-full bg-coffee-dark text-white py-3.5 rounded-xl font-bold hover:bg-brand-orange transition-colors shadow-lg active:scale-95 text-sm"
                >
                  Pay ₹{grandTotal} securely
                </button>
              </div>
            </div>

            {/* Payment Progress Overlay Loader */}
            {paymentProgress > 0 && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                <div className="w-16 h-16 border-4 border-coffee-light/30 border-t-brand-orange rounded-full animate-spin mb-6" />
                <h4 className="font-serif font-black text-xl text-coffee-dark mb-2">Processing Your Payment</h4>
                <p className="text-xs text-gray-400 font-medium">{paymentProgressText}</p>
                <div className="flex gap-1.5 items-center justify-center mt-6 bg-coffee-cream px-4 py-2 rounded-full border border-coffee-light/10">
                  <ShieldCheck size={14} className="text-brand-orange" />
                  <span className="text-[9px] uppercase font-extrabold tracking-widest text-coffee-dark">100% Secure Transaction</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
