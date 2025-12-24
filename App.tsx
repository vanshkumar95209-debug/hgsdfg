
import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Added MenuItem to the imports from './types'
import { UserInfo, CartItem, LocationData, View, PaymentMethod, MenuItem } from './types';
import { MENU_ITEMS, MERCHANT_PHONE, PLATFORM_FEE } from './constants';

// --- Shared Components ---

const Button: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  className?: string; 
  disabled?: boolean;
}> = ({ onClick, children, className = '', disabled = false }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`w-full py-4 rounded-3xl font-bold text-lg transition-transform active:scale-95 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-2xl font-black italic uppercase tracking-tight text-gray-900 mb-4">
    {children}
  </h2>
);

// --- Views ---

const LoginView: React.FC<{ onComplete: (user: UserInfo) => void }> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone.length >= 10) {
      onComplete({ name, phone });
    }
  };

  return (
    <div className="p-8 h-full flex flex-col justify-between animate-fade-in bg-white rounded-[2.5rem] shadow-2xl m-4 border-2 border-red-500/10">
      <div className="mt-12">
        <div className="w-20 h-20 bg-red-500 rounded-3xl flex items-center justify-center shadow-lg shadow-red-200 mb-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <SectionTitle>Welcome to FoodieDash</SectionTitle>
        <p className="text-gray-500 mb-8 font-medium">Please enter your details to start ordering.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Full Name</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 bg-gray-100 rounded-2xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 border-none"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Mobile Number</label>
            <input 
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 bg-gray-100 rounded-2xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 border-none"
              placeholder="10-digit number"
            />
          </div>
          <Button onClick={() => {}} className="bg-red-500 text-white mt-8 shadow-xl shadow-red-100">
            CONTINUE
          </Button>
        </form>
      </div>
      <p className="text-center text-gray-400 text-xs font-medium py-4">
        By continuing, you agree to our Terms of Service.
      </p>
    </div>
  );
};

const LocationPermissionView: React.FC<{ onLocationFound: (lat: number, lng: number) => void; onDenied: () => void }> = ({ onLocationFound, onDenied }) => {
  const [isDenied, setIsDenied] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setIsDenied(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => onLocationFound(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        setIsDenied(true);
        onDenied();
      }
    );
  };

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center animate-fade-in bg-white rounded-[2.5rem] shadow-2xl m-4 border-2 border-red-500/10 text-center">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <SectionTitle>Share Your Location</SectionTitle>
      <p className="text-gray-500 mb-8 font-medium px-4">
        We need your location to show available restaurants and ensure accurate delivery.
      </p>

      {isDenied ? (
        <div className="w-full p-6 bg-red-50 border-2 border-red-200 rounded-[2rem] text-red-700 font-bold mb-8">
          <p className="mb-2">⚠️ Permission Denied</p>
          <p className="text-sm font-medium leading-relaxed">
            Lock Icon par click karein <br/> 
            &gt; Location Allow karein <br/> 
            &gt; Reload karein
          </p>
        </div>
      ) : (
        <Button onClick={requestLocation} className="bg-red-500 text-white shadow-xl shadow-red-100">
          ENABLE GPS
        </Button>
      )}
      
      {!isDenied && (
        <button onClick={onDenied} className="mt-6 text-gray-400 font-bold text-sm underline active:scale-95">
          Enter Location Manually
        </button>
      )}
    </div>
  );
};

const HomeView: React.FC<{ onSelectRestaurant: () => void }> = ({ onSelectRestaurant }) => {
  return (
    <div className="flex flex-col h-full animate-fade-in overflow-y-auto pb-20">
      {/* Header */}
      <div className="p-6 bg-white shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-black italic text-red-500 uppercase tracking-widest mb-0.5">Delivery To</p>
          <p className="text-sm font-bold text-gray-900 truncate">Current Location Detected</p>
        </div>
      </div>

      {/* Banner */}
      <div className="mx-6 my-4 h-48 rounded-[2rem] overflow-hidden relative shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200" 
          className="w-full h-full object-cover"
          alt="Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <p className="text-white text-3xl font-black italic uppercase leading-none mb-1">60% OFF</p>
          <p className="text-white/80 text-sm font-bold">On premium gourmet collections</p>
        </div>
      </div>

      <div className="px-6 mt-4">
        <SectionTitle>Top Restaurants Near You</SectionTitle>
        <div 
          onClick={onSelectRestaurant}
          className="bg-white rounded-[2.5rem] overflow-hidden shadow-md mb-6 active:scale-95 transition-transform cursor-pointer border border-gray-100"
        >
          <div className="h-44 overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000" 
              className="w-full h-full object-cover"
              alt="Restaurant"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black italic text-red-500">
              FREE DELIVERY
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-black italic text-gray-900">DELICIOUS FOOD</h3>
              <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                4.8 <span className="text-[10px]">★</span>
              </div>
            </div>
            <p className="text-gray-500 font-semibold text-sm mb-4">Continental • Desserts • Fast Food</p>
            <div className="flex items-center gap-4 text-gray-600 font-bold text-xs uppercase tracking-tight">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                20-25 min
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ₹200 for two
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RestaurantDetailView: React.FC<{ 
  cart: CartItem[]; 
  // MenuItem is now correctly imported and resolved here
  updateCart: (item: MenuItem, delta: number) => void;
  onCheckout: () => void;
  onBack: () => void;
}> = ({ cart, updateCart, onCheckout, onBack }) => {
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

  return (
    <div className="flex flex-col h-full animate-fade-in relative bg-white">
      {/* Sticky Header Image */}
      <div className="relative h-64 shrink-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000" 
          className="w-full h-full object-cover scale-110"
          alt="Restaurant Banner"
        />
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="px-6 -mt-16 z-10">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 mb-8">
          <SectionTitle>Delicious Food</SectionTitle>
          <p className="text-gray-500 font-medium mb-2">The finest selection of artisanal snacks and premium desserts.</p>
          <div className="flex items-center gap-2 text-green-600 font-black italic text-sm">
            <span>4.8 RATING</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span>20 MINS</span>
          </div>
        </div>

        <SectionTitle>Recommended Menu</SectionTitle>
        <div className="space-y-6 pb-40">
          {MENU_ITEMS.map((item) => {
            const inCart = cart.find(c => c.id === item.id);
            const qty = inCart?.quantity || 0;

            return (
              <div key={item.id} className="flex gap-4 items-start pb-6 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <h4 className="text-lg font-black italic text-gray-900 mb-1 uppercase tracking-tight">{item.name}</h4>
                  <p className="text-gray-900 font-bold mb-2">₹{item.price}</p>
                  <p className="text-gray-400 text-xs font-medium leading-relaxed mb-4">{item.description}</p>
                  
                  {qty === 0 ? (
                    <button 
                      onClick={() => updateCart(item, 1)}
                      className="px-6 py-2 bg-white border border-red-200 text-red-500 font-black rounded-xl shadow-sm shadow-red-50 hover:bg-red-50 active:scale-95"
                    >
                      ADD +
                    </button>
                  ) : (
                    <div className="flex items-center bg-red-500 text-white rounded-xl px-2 py-1.5 w-max gap-4 shadow-lg shadow-red-200">
                      <button onClick={() => updateCart(item, -1)} className="w-8 h-8 flex items-center justify-center font-black text-lg active:scale-75">−</button>
                      <span className="font-black italic text-lg">{qty}</span>
                      <button onClick={() => updateCart(item, 1)} className="w-8 h-8 flex items-center justify-center font-black text-lg active:scale-75">+</button>
                    </div>
                  )}
                </div>
                <div className="w-28 h-28 rounded-3xl overflow-hidden shrink-0 shadow-md">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Persistent Cart CTA */}
      {cartTotal > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 z-20 pointer-events-none">
          <div className="max-w-[450px] mx-auto pointer-events-auto">
            <button 
              onClick={onCheckout}
              className="w-full bg-red-500 text-white p-5 rounded-3xl flex items-center justify-between shadow-2xl shadow-red-400/50 active:scale-95"
            >
              <div className="text-left">
                <p className="text-[10px] font-black italic opacity-80 uppercase tracking-widest">Your Cart</p>
                <p className="text-lg font-black italic">₹{cartTotal + PLATFORM_FEE} TOTAL</p>
              </div>
              <div className="flex items-center gap-2 font-black italic">
                VIEW CART
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckoutView: React.FC<{ 
  cart: CartItem[]; 
  location: LocationData;
  onPlaceOrder: (address: string, method: PaymentMethod) => void;
  onBack: () => void;
}> = ({ cart, location, onPlaceOrder, onBack }) => {
  const [address, setAddress] = useState(location.address || '');
  const [payment, setPayment] = useState<PaymentMethod>(PaymentMethod.UPI);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="flex flex-col h-full animate-slide-in overflow-y-auto bg-gray-50 pb-32">
      <div className="p-6 bg-white sticky top-0 z-10 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2"><svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
        <SectionTitle>Checkout</SectionTitle>
      </div>

      <div className="p-6 space-y-6">
        {/* Items Summary */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-black italic text-gray-900 mb-4 uppercase tracking-tight">Order Summary</h3>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-none mb-1">{item.name}</p>
                    <p className="text-xs text-gray-400 font-bold">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-black italic text-gray-900">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black italic text-gray-900 uppercase tracking-tight">Delivery Address</h3>
            {location.latitude ? (
              <span className="bg-green-100 text-green-700 text-[10px] font-black italic px-2 py-1 rounded-full border border-green-200 uppercase">GPS Connected</span>
            ) : (
              <span className="bg-orange-100 text-orange-700 text-[10px] font-black italic px-2 py-1 rounded-full border border-orange-200 uppercase">Manual Entry</span>
            )}
          </div>
          <textarea 
            placeholder="Enter your complete flat/house details..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-semibold text-gray-900 border-2 border-gray-100 focus:border-red-500 focus:outline-none min-h-[100px]"
          />
        </div>

        {/* Payment */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-black italic text-gray-900 mb-4 uppercase tracking-tight">Payment Method</h3>
          <div className="flex flex-col gap-3">
            {[PaymentMethod.UPI, PaymentMethod.COD].map(method => (
              <button 
                key={method}
                onClick={() => setPayment(method)}
                className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${payment === method ? 'border-red-500 bg-red-50/50' : 'border-gray-100'}`}
              >
                <span className="font-bold text-gray-900">{method}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payment === method ? 'border-red-500' : 'border-gray-300'}`}>
                  {payment === method && <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bill Details */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 mb-4">
          <div className="space-y-2 pb-4 border-b border-dashed border-gray-200">
            <div className="flex justify-between text-gray-500 font-bold text-sm">
              <span>Item Total</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-gray-500 font-bold text-sm">
              <span>Delivery Fee</span>
              <span className="text-green-600 uppercase">FREE</span>
            </div>
            <div className="flex justify-between text-gray-500 font-bold text-sm">
              <span>Platform Fee</span>
              <span>₹{PLATFORM_FEE}</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className="text-lg font-black italic text-gray-900 uppercase">Grand Total</span>
            <span className="text-3xl font-black italic text-red-500">₹{cartTotal + PLATFORM_FEE}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 z-20 bg-gray-50/80 backdrop-blur-md">
        <div className="max-w-[450px] mx-auto">
          <Button 
            disabled={!address.trim()}
            onClick={() => onPlaceOrder(address, payment)} 
            className="bg-red-500 text-white shadow-2xl shadow-red-200"
          >
            PLACE ORDER & PAY
          </Button>
        </div>
      </div>
    </div>
  );
};

const SuccessView: React.FC<{ onRedirect: () => void }> = ({ onRedirect }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRedirect();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onRedirect]);

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center animate-fade-in bg-white rounded-[2.5rem] shadow-2xl m-4 border-2 border-red-500/10 text-center">
      <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-8 animate-bounce shadow-xl shadow-green-100">
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-5xl font-black italic text-red-500 mb-4 animate-pulse uppercase tracking-tighter">ORDERED!</h1>
      <p className="text-gray-900 font-bold mb-12 px-8 leading-relaxed">
        Redirecting you to WhatsApp to complete your order details...
      </p>

      <Button onClick={onRedirect} className="bg-green-500 text-white shadow-xl shadow-green-100">
        COMPLETE ON WHATSAPP
      </Button>
      
      <p className="mt-8 text-gray-400 font-bold text-xs uppercase tracking-widest">DO NOT CLOSE THIS SCREEN</p>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>(View.LOGIN);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [location, setLocation] = useState<LocationData>({ latitude: null, longitude: null, status: 'pending' });

  // Handle Login
  const handleLoginComplete = (userInfo: UserInfo) => {
    setUser(userInfo);
    setView(View.LOCATION);
  };

  // Handle Location
  const handleLocationFound = (lat: number, lng: number) => {
    setLocation({ latitude: lat, longitude: lng, status: 'connected' });
    setView(View.HOME);
  };

  const handleLocationDenied = () => {
    setLocation(prev => ({ ...prev, status: 'manual' }));
    setView(View.HOME);
  };

  // Cart Logic
  // MenuItem is now correctly imported and resolved here
  const updateCart = (item: MenuItem, delta: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter(i => i.id !== item.id);
        return prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i);
      }
      if (delta > 0) return [...prev, { ...item, quantity: 1 }];
      return prev;
    });
  };

  // Place Order Logic
  const handlePlaceOrder = (address: string, payment: PaymentMethod) => {
    setLocation(prev => ({ ...prev, address }));
    // In a real app, you might save the payment method to state too
    setView(View.SUCCESS);
  };

  // WhatsApp Redirection
  const redirectToWhatsApp = useCallback(() => {
    if (!user) return;

    const cartText = cart.map(item => `• ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + PLATFORM_FEE;
    const gpsLink = location.latitude 
      ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}` 
      : 'Not Provided';

    const message = `🚨 NAYA ORDER AAYA HAI! 🚨
👤 Customer: ${user.name} (${user.phone})
🏠 Address: ${location.address || 'N/A'}
📍 GPS Location: ${gpsLink}
🍴 Items: 
${cartText}
💰 Total Amount: ₹${total}
💳 Payment: ${PaymentMethod.UPI} (Requested)`;

    const whatsappUrl = `https://wa.me/${MERCHANT_PHONE}?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  }, [user, cart, location]);

  return (
    <div className="w-full max-w-[450px] min-h-screen bg-gray-100 flex flex-col shadow-2xl overflow-hidden relative">
      {view === View.LOGIN && <LoginView onComplete={handleLoginComplete} />}
      {view === View.LOCATION && <LocationPermissionView onLocationFound={handleLocationFound} onDenied={handleLocationDenied} />}
      {view === View.HOME && <HomeView onSelectRestaurant={() => setView(View.DETAIL)} />}
      {view === View.DETAIL && (
        <RestaurantDetailView 
          cart={cart} 
          updateCart={updateCart} 
          onCheckout={() => setView(View.CHECKOUT)} 
          onBack={() => setView(View.HOME)}
        />
      )}
      {view === View.CHECKOUT && (
        <CheckoutView 
          cart={cart} 
          location={location} 
          onPlaceOrder={handlePlaceOrder}
          onBack={() => setView(View.DETAIL)}
        />
      )}
      {view === View.SUCCESS && <SuccessView onRedirect={redirectToWhatsApp} />}
    </div>
  );
}
