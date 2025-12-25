
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UserInfo, CartItem, LocationData, View, PaymentMethod, MenuItem } from './types.ts';
import { MENU_ITEMS, MERCHANT_PHONE, PLATFORM_FEE } from './constants.ts';

// --- Shared Components ---

const Button: React.FC<{ 
  onClick?: () => void; 
  children: React.ReactNode; 
  className?: string; 
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}> = ({ onClick, children, className = '', disabled = false, type = "button" }) => (
  <button 
    type={type}
    onClick={onClick} 
    disabled={disabled}
    className={`w-full py-4 rounded-3xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${className}`}
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
    if (name.trim() && phone.length >= 10) {
      onComplete({ name: name.trim(), phone });
    }
  };

  return (
    <div className="p-8 h-screen flex flex-col justify-between animate-fade-in bg-white">
      <div className="mt-12">
        <div className="w-20 h-20 bg-[#E23744] rounded-3xl flex items-center justify-center shadow-2xl shadow-red-200 mb-8">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <SectionTitle>Welcome to FoodieDash</SectionTitle>
        <p className="text-gray-500 mb-10 font-medium">Elevating your delivery experience.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Name</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-5 bg-gray-50 rounded-2xl text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#E23744] border border-gray-100 transition-all"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Phone Number</label>
            <input 
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-5 bg-gray-50 rounded-2xl text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#E23744] border border-gray-100 transition-all"
              placeholder="10-digit mobile"
            />
          </div>
          <Button type="submit" className="bg-[#E23744] text-white mt-10 shadow-xl shadow-red-100">
            GET STARTED
          </Button>
        </form>
      </div>
      <p className="text-center text-gray-400 text-[10px] font-black uppercase tracking-widest py-4">
        Premium Service • Secure Checkout
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
    <div className="p-8 h-screen flex flex-col items-center justify-center animate-fade-in bg-white text-center">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8">
        <svg className="w-12 h-12 text-[#E23744]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <SectionTitle>Location Access</SectionTitle>
      <p className="text-gray-500 mb-10 font-medium px-4 leading-relaxed">
        We use your location to find the nearest premium kitchens and ensure lightning fast delivery.
      </p>

      {isDenied ? (
        <div className="w-full p-6 bg-red-50 border border-red-100 rounded-[2rem] text-[#E23744] font-bold mb-8">
          <p className="mb-2 uppercase text-xs tracking-widest">⚠️ Connection Blocked</p>
          <p className="text-sm font-medium leading-relaxed opacity-80">
            Please enable location in your browser settings to continue.
          </p>
        </div>
      ) : (
        <Button onClick={requestLocation} className="bg-[#E23744] text-white shadow-xl shadow-red-100">
          ENABLE GPS
        </Button>
      )}
      
      {!isDenied && (
        <button onClick={onDenied} className="mt-8 text-gray-400 font-black text-xs uppercase tracking-widest active:scale-95">
          Or Enter Manually
        </button>
      )}
    </div>
  );
};

const HomeView: React.FC<{ onSelectRestaurant: () => void }> = ({ onSelectRestaurant }) => {
  return (
    <div className="flex flex-col h-screen animate-fade-in overflow-y-auto pb-20 bg-white">
      {/* Header */}
      <div className="p-6 sticky top-0 bg-white/90 backdrop-blur-md z-30 flex items-center gap-4">
        <div className="w-10 h-10 bg-[#E23744] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-red-100">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-[10px] font-black italic text-[#E23744] uppercase tracking-widest mb-0.5">Your Area</p>
          <p className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">Current Location</p>
        </div>
      </div>

      {/* Banner */}
      <div className="mx-6 my-4 h-52 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200" 
          className="w-full h-full object-cover"
          alt="Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
          <p className="text-white text-4xl font-black italic uppercase leading-none mb-1 tracking-tighter">60% OFF</p>
          <p className="text-white/80 text-xs font-black uppercase tracking-widest">Gourmet Selection</p>
        </div>
      </div>

      <div className="px-6 mt-6">
        <SectionTitle>Featured Kitchens</SectionTitle>
        <div 
          onClick={onSelectRestaurant}
          className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl mb-10 active:scale-[0.98] transition-all cursor-pointer border border-gray-50"
        >
          <div className="h-48 overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000" 
              className="w-full h-full object-cover"
              alt="Restaurant"
            />
            <div className="absolute top-5 left-5 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black italic text-[#E23744] uppercase tracking-widest shadow-lg">
              PREMIUM DELIVERY
            </div>
          </div>
          <div className="p-7">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-black italic text-gray-900 uppercase tracking-tighter">THE GOURMET CLUB</h3>
              <div className="bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-md shadow-green-100">
                4.8 <span>★</span>
              </div>
            </div>
            <p className="text-gray-400 font-bold text-xs mb-6 uppercase tracking-wider">Continental • Desserts • Artisan</p>
            <div className="flex items-center gap-6 text-gray-900 font-black text-[10px] uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#E23744]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                25 MINS
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#E23744]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ₹300 FOR TWO
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
  updateCart: (item: MenuItem, delta: number) => void;
  onCheckout: () => void;
  onBack: () => void;
}> = ({ cart, updateCart, onCheckout, onBack }) => {
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

  return (
    <div className="flex flex-col h-screen animate-fade-in relative bg-white overflow-y-auto">
      {/* Sticky Header Image */}
      <div className="relative h-72 shrink-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000" 
          className="w-full h-full object-cover scale-110"
          alt="Restaurant Banner"
        />
        <button 
          onClick={onBack}
          className="absolute top-8 left-6 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white active:scale-75 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent" />
      </div>

      <div className="px-6 -mt-20 z-10">
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-50 mb-10">
          <SectionTitle>The Gourmet Club</SectionTitle>
          <p className="text-gray-500 font-medium mb-4 leading-relaxed">Artisanal flavors crafted for the discerning palate.</p>
          <div className="flex items-center gap-3 text-[#E23744] font-black italic text-[10px] uppercase tracking-widest">
            <span className="flex items-center gap-1">4.8 <span className="text-[8px]">★</span></span>
            <span className="w-1 h-1 bg-gray-200 rounded-full" />
            <span>25 MINS DELIVERY</span>
          </div>
        </div>

        <SectionTitle>Chef's Recommendations</SectionTitle>
        <div className="space-y-10 pb-48">
          {MENU_ITEMS.map((item) => {
            const inCart = cart.find(c => c.id === item.id);
            const qty = inCart?.quantity || 0;

            return (
              <div key={item.id} className="flex gap-6 items-start">
                <div className="flex-1">
                  <h4 className="text-lg font-black italic text-gray-900 mb-1 uppercase tracking-tighter">{item.name}</h4>
                  <p className="text-gray-900 font-black mb-2 text-sm">₹{item.price}</p>
                  <p className="text-gray-400 text-xs font-medium leading-relaxed mb-6">{item.description}</p>
                  
                  {qty === 0 ? (
                    <button 
                      onClick={() => updateCart(item, 1)}
                      className="px-8 py-2.5 bg-white border-2 border-red-50 text-[#E23744] font-black rounded-2xl shadow-lg shadow-red-50 hover:bg-red-50 active:scale-90 transition-all text-xs tracking-widest uppercase"
                    >
                      ADD +
                    </button>
                  ) : (
                    <div className="flex items-center bg-[#E23744] text-white rounded-2xl px-3 py-2 w-max gap-6 shadow-xl shadow-red-200">
                      <button onClick={() => updateCart(item, -1)} className="w-8 h-8 flex items-center justify-center font-black text-xl active:scale-75">−</button>
                      <span className="font-black italic text-lg">{qty}</span>
                      <button onClick={() => updateCart(item, 1)} className="w-8 h-8 flex items-center justify-center font-black text-xl active:scale-75">+</button>
                    </div>
                  )}
                </div>
                <div className="w-32 h-32 rounded-[2rem] overflow-hidden shrink-0 shadow-xl relative border border-gray-50">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Persistent Cart CTA */}
      {cartTotal > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-8 z-40 pointer-events-none">
          <div className="max-w-[450px] mx-auto pointer-events-auto">
            <button 
              onClick={onCheckout}
              className="w-full bg-[#E23744] text-white p-6 rounded-[2.5rem] flex items-center justify-between shadow-3xl shadow-red-300 active:scale-95 transition-all"
            >
              <div className="text-left">
                <p className="text-[10px] font-black italic opacity-70 uppercase tracking-widest mb-0.5">Ready to Dash</p>
                <p className="text-xl font-black italic">₹{cartTotal + PLATFORM_FEE}</p>
              </div>
              <div className="flex items-center gap-3 font-black italic text-sm tracking-widest">
                CHECKOUT
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
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
    <div className="flex flex-col h-screen animate-slide-in overflow-y-auto bg-gray-50 pb-40">
      <div className="p-8 bg-white sticky top-0 z-30 flex items-center gap-6 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 active:scale-75 transition-transform"><svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg></button>
        <SectionTitle>Review Order</SectionTitle>
      </div>

      <div className="p-8 space-y-8">
        {/* Items Summary */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
          <h3 className="font-black italic text-gray-900 mb-6 uppercase tracking-widest text-xs">Menu Selection</h3>
          <div className="space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div>
                    <p className="font-black italic text-gray-900 text-sm uppercase tracking-tight">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-black italic text-gray-900">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black italic text-gray-900 uppercase tracking-widest text-xs">Destination</h3>
            {location.latitude ? (
              <span className="bg-green-50 text-green-700 text-[8px] font-black italic px-3 py-1 rounded-full border border-green-100 uppercase tracking-widest">GPS LOCKED</span>
            ) : (
              <span className="bg-orange-50 text-orange-700 text-[8px] font-black italic px-3 py-1 rounded-full border border-orange-100 uppercase tracking-widest">MANUAL</span>
            )}
          </div>
          <textarea 
            placeholder="Complete address with flat/landmark details..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-6 bg-gray-50 rounded-[2rem] text-sm font-bold text-gray-900 border-2 border-transparent focus:border-[#E23744] focus:outline-none min-h-[140px] transition-all resize-none"
          />
        </div>

        {/* Payment */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
          <h3 className="font-black italic text-gray-900 mb-6 uppercase tracking-widest text-xs">Payment Option</h3>
          <div className="flex flex-col gap-4">
            {[PaymentMethod.UPI, PaymentMethod.COD].map(method => (
              <button 
                key={method}
                onClick={() => setPayment(method)}
                className={`p-6 rounded-2xl flex items-center justify-between border-2 transition-all ${payment === method ? 'border-[#E23744] bg-red-50/20 shadow-lg shadow-red-50' : 'border-gray-50 bg-gray-50/30'}`}
              >
                <span className="font-black italic text-gray-900 uppercase text-xs tracking-widest">{method}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${payment === method ? 'border-[#E23744]' : 'border-gray-200'}`}>
                  {payment === method && <div className="w-3 h-3 bg-[#E23744] rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bill Details */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
          <div className="space-y-4 pb-6 border-b border-dashed border-gray-200">
            <div className="flex justify-between text-gray-400 font-black uppercase tracking-widest text-[10px]">
              <span>Cart Value</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-gray-400 font-black uppercase tracking-widest text-[10px]">
              <span>Delivery</span>
              <span className="text-green-600">COMPLIMENTARY</span>
            </div>
            <div className="flex justify-between text-gray-400 font-black uppercase tracking-widest text-[10px]">
              <span>Premium Access</span>
              <span>₹{PLATFORM_FEE}</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-6">
            <span className="text-sm font-black italic text-gray-900 uppercase tracking-widest">GRAND TOTAL</span>
            <span className="text-3xl font-black italic text-[#E23744]">₹{cartTotal + PLATFORM_FEE}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 z-40 bg-gray-50/90 backdrop-blur-xl">
        <div className="max-w-[450px] mx-auto">
          <Button 
            disabled={!address.trim()}
            onClick={() => onPlaceOrder(address, payment)} 
            className="bg-[#E23744] text-white shadow-3xl shadow-red-200"
          >
            CONFIRM & PAY
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
    }, 4000);
    return () => clearTimeout(timer);
  }, [onRedirect]);

  return (
    <div className="p-10 h-screen flex flex-col items-center justify-center animate-fade-in bg-white text-center">
      <div className="w-36 h-36 bg-green-500 rounded-full flex items-center justify-center mb-10 animate-bounce shadow-3xl shadow-green-100">
        <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-6xl font-black italic text-[#E23744] mb-4 animate-pulse uppercase tracking-tighter">ORDERED</h1>
      <p className="text-gray-900 font-bold mb-14 px-10 leading-relaxed">
        Finalizing your premium experience on WhatsApp...
      </p>

      <Button onClick={onRedirect} className="bg-green-600 text-white shadow-2xl shadow-green-100">
        GO TO WHATSAPP
      </Button>
      
      <p className="mt-10 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">Processing Secure Link</p>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>(View.LOGIN);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [location, setLocation] = useState<LocationData>({ latitude: null, longitude: null, status: 'pending' });
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PaymentMethod.UPI);

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
    setSelectedPayment(payment);
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

    const message = `🚨 *NEW FOODIEDASH ORDER* 🚨

👤 *Customer*: ${user.name}
📞 *Phone*: ${user.phone}
🏠 *Address*: ${location.address || 'N/A'}
📍 *GPS Location*: ${gpsLink}

🍴 *Items Selection*: 
${cartText}

💰 *Total Amount*: ₹${total}
💳 *Preferred Payment*: ${selectedPayment}

_Please confirm and send payment details._`;

    const whatsappUrl = `https://wa.me/${MERCHANT_PHONE}?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  }, [user, cart, location, selectedPayment]);

  return (
    <div className="w-full max-w-[450px] min-h-screen bg-white flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.1)] overflow-hidden relative mx-auto">
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
