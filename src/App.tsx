import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Car, 
  Ship, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Fuel, 
  CheckCircle2,
  Euro,
  DollarSign,
  Info,
  ChevronRight,
  Calculator,
  Search,
  Filter,
  Link as LinkIcon,
  TrendingUp,
  Quote,
  Check
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Types ---
type View = 'landing' | 'breakdown' | 'how-it-works' | 'guide' | 'contact' | 'marketplace';

// --- Components ---

const Navbar = ({ onViewChange, currentView }: { onViewChange: (view: View) => void, currentView: View }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-ink/5">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 font-display font-bold text-xl tracking-tighter cursor-pointer"
        onClick={() => onViewChange('landing')}
      >
        <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white">
          <Car size={18} />
        </div>
        <span>IMPORT<span className="text-brand">CALC</span></span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-ink/60">
        <button onClick={() => onViewChange('landing')} className={cn("hover:text-brand transition-colors", currentView === 'landing' && "text-brand")}>Home</button>
        <button onClick={() => onViewChange('marketplace')} className={cn("hover:text-brand transition-colors", currentView === 'marketplace' && "text-brand")}>Marketplace</button>
        <button onClick={() => onViewChange('how-it-works')} className={cn("hover:text-brand transition-colors", currentView === 'how-it-works' && "text-brand")}>How it works</button>
        <button onClick={() => onViewChange('guide')} className={cn("hover:text-brand transition-colors", currentView === 'guide' && "text-brand")}>Guide</button>
        <button onClick={() => onViewChange('contact')} className={cn("hover:text-brand transition-colors", currentView === 'contact' && "text-brand")}>Contact</button>
      </div>
      
      <button 
        onClick={() => onViewChange('landing')}
        className="bg-ink text-surface px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand transition-all"
      >
        {currentView === 'landing' ? 'Calculate Now' : 'New Calculation'}
      </button>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="py-20 px-6 bg-white border-t border-ink/5">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
        <div className="flex items-center gap-2 font-display font-bold text-2xl tracking-tighter">
          <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white">
            <Car size={20} />
          </div>
          <span>IMPORT<span className="text-brand">CALC</span></span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-12 text-sm font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-brand transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-brand transition-colors">Cookies</a>
          <a href="#" className="hover:text-brand transition-colors">Contact</a>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-ink/40 text-sm">
        <p>&copy; 2026 Car Import Calculator. All rights reserved.</p>
        <div className="flex items-center gap-8">
          <a href="#" className="hover:text-ink transition-colors">Twitter</a>
          <a href="#" className="hover:text-ink transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-ink transition-colors">Instagram</a>
        </div>
      </div>
    </div>
  </footer>
);

const CostRow = ({ label, value, isTotal = false }: { label: string, value: string, isTotal?: boolean }) => (
  <div className={cn(
    "flex justify-between items-center py-6 border-b border-ink/5",
    isTotal && "border-t-2 border-brand pt-10 mt-4 border-b-0"
  )}>
    <span className={cn("text-lg", isTotal ? "font-display font-bold text-2xl uppercase tracking-widest" : "text-ink/60 font-medium")}>
      {label}
    </span>
    <span className={cn("font-display font-bold", isTotal ? "text-5xl text-brand" : "text-2xl")}>
      {value}
    </span>
  </div>
);

const Step = ({ number, title, description, image, index }: { number: string, title: string, description: string, image: string, index: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.2 }}
    className="group"
  >
    <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] mb-8 bg-ink/5">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-6 left-6 w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center font-display font-bold text-xl">
        {number}
      </div>
    </div>
    <h3 className="text-3xl font-bold mb-4">{title}</h3>
    <p className="text-ink/60 leading-relaxed text-lg">{description}</p>
  </motion.div>
);

const HowItWorksView = ({ onViewChange }: { onViewChange: (view: View) => void }) => (
  <main className="pt-32 pb-32 px-6">
    <div className="max-w-7xl mx-auto">
      {/* Page Title */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-1 bg-brand" />
          <span className="text-brand font-bold uppercase tracking-[0.3em] text-sm">The Process</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter leading-[0.85] mb-8">
          How It <span className="text-brand">Works</span>
        </h1>
        <p className="text-2xl text-ink/40 max-w-2xl font-medium leading-tight">
          A transparent, step-by-step guide to importing your dream car from the USA to Bulgaria.
        </p>
      </motion.section>

      <div className="space-y-32">
        {/* Step 1 */}
        <section className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-8xl font-display font-bold text-brand/20 mb-6">01</div>
            <h2 className="text-5xl font-display font-bold mb-8 tracking-tighter">Find Your Vehicle</h2>
            <p className="text-xl text-ink/60 leading-relaxed mb-8">
              Browse major US auction platforms like Copart, IAAI, or Bring a Trailer. These marketplaces offer thousands of vehicles daily, from salvage projects to pristine luxury cars.
            </p>
            <ul className="space-y-4">
              {['Access to exclusive US auctions', 'Detailed vehicle history reports', 'Professional inspection options'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest text-ink/40">
                  <CheckCircle2 className="text-brand" size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1550355291-bbee04a92027" 
              alt="Browsing cars" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>

        {/* Step 2 */}
        <section className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1581091870627-3c7a5bde9b8b" 
              alt="Calculating costs" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="text-8xl font-display font-bold text-brand/20 mb-6">02</div>
            <h2 className="text-5xl font-display font-bold mb-8 tracking-tighter">Calculate Total Cost</h2>
            <p className="text-xl text-ink/60 leading-relaxed mb-8">
              Paste the listing URL into our calculator. We instantly analyze the data to provide a full breakdown of shipping, customs duties, VAT, and port fees.
            </p>
            <div className="p-8 bg-white border border-ink/5 rounded-3xl shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <Calculator className="text-brand" size={24} />
                <span className="font-bold uppercase tracking-widest text-sm">Instant Analysis</span>
              </div>
              <p className="text-ink/40 text-sm">Our algorithm uses real-time logistics data and current Bulgarian regulations to ensure 99% accuracy.</p>
            </div>
          </motion.div>
        </section>

        {/* Step 3 */}
        <section className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-8xl font-display font-bold text-brand/20 mb-6">03</div>
            <h2 className="text-5xl font-display font-bold mb-8 tracking-tighter">Shipping & Logistics</h2>
            <p className="text-xl text-ink/60 leading-relaxed mb-8">
              Once purchased, your car is transported to a US port (New Jersey, Savannah, or Houston) and loaded into a secure container for its journey across the Atlantic.
            </p>
            <div className="flex items-center gap-6 p-6 bg-ink text-surface rounded-3xl">
              <Ship className="text-brand" size={32} />
              <div>
                <div className="font-bold uppercase tracking-widest text-xs mb-1">Weekly Departures</div>
                <div className="text-surface/60 text-sm">Average transit time: 4-6 weeks</div>
              </div>
            </div>
          </motion.div>
          <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1564859228273-274232fdb516" 
              alt="Shipping container" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>

        {/* Step 4 */}
        <section className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1454165833767-027ffea9e778" 
              alt="Customs clearance" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="text-8xl font-display font-bold text-brand/20 mb-6">04</div>
            <h2 className="text-5xl font-display font-bold mb-8 tracking-tighter">Customs & Delivery</h2>
            <p className="text-xl text-ink/60 leading-relaxed mb-8">
              Upon arrival at Varna or Burgas, our partners handle all customs documentation, duty payments, and VAT clearance. Your car is then ready for pickup or inland delivery to your door.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 border border-ink/10 rounded-2xl">
                <div className="font-bold text-brand mb-1">10%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Customs Duty</div>
              </div>
              <div className="p-6 border border-ink/10 rounded-2xl">
                <div className="font-bold text-brand mb-1">20%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Bulgarian VAT</div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Final CTA */}
      <section className="mt-32">
        <div className="bg-brand text-white p-16 md:p-24 rounded-[4rem] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-6xl font-display font-bold mb-8 tracking-tighter">Start Your Journey</h2>
            <p className="text-2xl font-medium mb-12 opacity-90 max-w-xl mx-auto">
              Ready to see the numbers? Use our calculator to get your first estimate in seconds.
            </p>
            <button 
              onClick={() => onViewChange('landing')}
              className="bg-white text-brand px-12 py-6 rounded-[2rem] font-bold text-xl hover:bg-ink hover:text-white transition-all shadow-2xl"
            >
              Back to Calculator
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>
);

const MarketplaceView = ({ onViewChange }: { onViewChange: (view: View) => void }) => {
  const [search, setSearch] = useState({ make: '', model: '', year: '', priceRange: '' });
  
  const cars = [
    { id: 1, make: 'Toyota', model: 'Camry', year: 2022, price: 24500, image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb', mileage: '12,000 mi', location: 'Miami, FL' },
    { id: 2, make: 'Ford', model: 'F-150', year: 2021, price: 38900, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888', mileage: '25,000 mi', location: 'Dallas, TX' },
    { id: 3, make: 'Tesla', model: 'Model 3', year: 2023, price: 42000, image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89', mileage: '5,000 mi', location: 'Los Angeles, CA' },
    { id: 4, make: 'BMW', model: 'X5', year: 2020, price: 45000, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e', mileage: '30,000 mi', location: 'New York, NY' },
    { id: 5, make: 'Honda', model: 'Civic', year: 2019, price: 18500, image: 'https://images.unsplash.com/photo-1594070319944-7c0c63146b77', mileage: '45,000 mi', location: 'Chicago, IL' },
    { id: 6, make: 'Porsche', model: '911', year: 2021, price: 115000, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70', mileage: '8,000 mi', location: 'San Francisco, CA' },
  ];

  const filteredCars = cars.filter(car => {
    const matchMake = car.make.toLowerCase().includes(search.make.toLowerCase());
    const matchModel = car.model.toLowerCase().includes(search.model.toLowerCase());
    const matchYear = search.year ? car.year.toString() === search.year : true;
    let matchPrice = true;
    if (search.priceRange) {
      const [min, max] = search.priceRange.split('-').map(Number);
      matchPrice = car.price >= min && (max ? car.price <= max : true);
    }
    return matchMake && matchModel && matchYear && matchPrice;
  });

  return (
    <main className="pt-32 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Intro Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-1 bg-brand" />
            <span className="text-brand font-bold uppercase tracking-[0.3em] text-sm">US Marketplace</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter leading-[0.85] mb-8">
            Find Your <span className="text-brand">Dream</span> Car
          </h1>
          <p className="text-2xl text-ink/40 max-w-3xl font-medium leading-tight">
            Browse thousands of vehicles from top US marketplaces. We handle the inspection, shipping, and import for you.
          </p>
        </motion.section>

        {/* Filters */}
        <section className="mb-16 p-8 bg-white border border-ink/5 rounded-[3rem] shadow-2xl shadow-ink/5">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink/40 ml-4">Make</label>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. Toyota"
                  className="w-full bg-surface py-4 pl-14 pr-6 rounded-2xl outline-none focus:ring-2 ring-brand/20 transition-all font-medium"
                  value={search.make}
                  onChange={(e) => setSearch({ ...search, make: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink/40 ml-4">Model</label>
              <input 
                type="text" 
                placeholder="e.g. Camry"
                className="w-full bg-surface py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-brand/20 transition-all font-medium"
                value={search.model}
                onChange={(e) => setSearch({ ...search, model: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink/40 ml-4">Year</label>
              <input 
                type="number" 
                placeholder="Year"
                className="w-full bg-surface py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-brand/20 transition-all font-medium"
                value={search.year}
                onChange={(e) => setSearch({ ...search, year: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink/40 ml-4">Price Range</label>
              <select 
                className="w-full bg-surface py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-brand/20 transition-all font-medium appearance-none"
                value={search.priceRange}
                onChange={(e) => setSearch({ ...search, priceRange: e.target.value })}
              >
                <option value="">Any Price</option>
                <option value="0-10000">Under $10k</option>
                <option value="10000-20000">$10k - $20k</option>
                <option value="20000-50000">$20k - $50k</option>
                <option value="50000-1000000">$50k+</option>
              </select>
            </div>
            <button className="bg-brand text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-ink transition-all shadow-lg shadow-brand/20">
              <Filter size={18} />
              <span>Search Cars</span>
            </button>
          </div>
        </section>

        {/* Cars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredCars.map((car, i) => (
            <motion.article 
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-[3rem] overflow-hidden border border-ink/5 hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={car.image} 
                  alt={`${car.year} ${car.make} ${car.model}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                  {car.year}
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight mb-1">{car.make} {car.model}</h3>
                    <div className="flex items-center gap-2 text-ink/40 text-sm font-medium">
                      <MapPin size={14} />
                      <span>{car.location}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-display font-bold text-brand">
                    ${typeof car.price === 'number' && !isNaN(car.price) ? car.price.toLocaleString() : 'N/A'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-surface rounded-2xl flex items-center gap-3">
                    <TrendingUp size={16} className="text-brand" />
                    <span className="text-sm font-bold">{car.mileage}</span>
                  </div>
                  <div className="p-4 bg-surface rounded-2xl flex items-center gap-3">
                    <Fuel size={16} className="text-brand" />
                    <span className="text-sm font-bold">Gasoline</span>
                  </div>
                </div>

                <button 
                  onClick={() => onViewChange('contact')}
                  className="w-full bg-ink text-white py-5 rounded-2xl font-bold hover:bg-brand transition-all flex items-center justify-center gap-2"
                >
                  <span>Import This Car</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
        
        {filteredCars.length === 0 && (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-ink/5 rounded-full flex items-center justify-center mx-auto mb-8 text-ink/20">
              <Search size={48} />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">No cars found</h2>
            <p className="text-ink/40 text-lg">Try adjusting your filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </main>
  );
};

const ContactView = ({ onViewChange }: { onViewChange: (view: View) => void }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <main className="pt-32 pb-32 px-6 min-h-[80vh] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <div className="w-24 h-24 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={48} />
          </div>
          <h1 className="text-6xl font-display font-bold mb-6 tracking-tighter">Thank You!</h1>
          <p className="text-2xl text-ink/60 mb-12 leading-tight">
            Your request has been submitted successfully. Our team will review your details and connect you with trusted partners shortly.
          </p>
          <button 
            onClick={() => onViewChange('landing')}
            className="bg-ink text-white px-12 py-6 rounded-[2rem] font-bold text-xl hover:bg-brand transition-all"
          >
            Back to Home
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Intro Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-1 bg-brand" />
            <span className="text-brand font-bold uppercase tracking-[0.3em] text-sm">Get Assistance</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter leading-[0.85] mb-8">
            Help with <span className="text-brand">Import</span>
          </h1>
          <p className="text-2xl text-ink/40 max-w-3xl font-medium leading-tight">
            Submit your request and we will connect you with trusted shipping and import partners to handle the process for you.
          </p>
        </motion.section>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Form Section */}
          <section>
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Personal Info */}
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold tracking-tight flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand/10 text-brand text-sm flex items-center justify-center">01</span>
                  Your Details
                </h2>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-ink/40">Full Name</label>
                    <input type="text" id="name" required className="w-full bg-surface border-b-2 border-ink/10 py-4 text-xl font-medium focus:border-brand outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-ink/40">Email Address</label>
                    <input type="email" id="email" required className="w-full bg-surface border-b-2 border-ink/10 py-4 text-xl font-medium focus:border-brand outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-ink/40">Phone Number</label>
                    <input type="tel" id="phone" className="w-full bg-surface border-b-2 border-ink/10 py-4 text-xl font-medium focus:border-brand outline-none transition-colors" />
                  </div>
                </div>
              </div>

              {/* Car Info */}
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold tracking-tight flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand/10 text-brand text-sm flex items-center justify-center">02</span>
                  Car Information
                </h2>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label htmlFor="car-url" className="text-xs font-bold uppercase tracking-widest text-ink/40">Car Listing URL</label>
                    <input type="url" id="car-url" required placeholder="https://example.com/car" className="w-full bg-surface border-b-2 border-ink/10 py-4 text-xl font-medium focus:border-brand outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="budget" className="text-xs font-bold uppercase tracking-widest text-ink/40">Estimated Budget (€)</label>
                    <input type="number" id="budget" className="w-full bg-surface border-b-2 border-ink/10 py-4 text-xl font-medium focus:border-brand outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-xs font-bold uppercase tracking-widest text-ink/40">Additional Details</label>
                    <textarea id="notes" rows={4} placeholder="Any specific requirements or questions..." className="w-full bg-surface border-b-2 border-ink/10 py-4 text-xl font-medium focus:border-brand outline-none transition-colors resize-none" />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold tracking-tight flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand/10 text-brand text-sm flex items-center justify-center">03</span>
                  Preferences
                </h2>
                <div className="grid gap-4">
                  {[
                    { id: 'container', label: 'Container Shipping' },
                    { id: 'roro', label: 'Roll-on/Roll-off (RoRo)' },
                    { id: 'door', label: 'Door-to-door delivery' }
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center gap-4 p-6 bg-white border border-ink/5 rounded-2xl cursor-pointer hover:border-brand/30 transition-colors group">
                      <input type="checkbox" className="w-6 h-6 accent-brand" />
                      <span className="text-lg font-bold">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Consent & Submit */}
              <div className="space-y-8 pt-8">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input type="checkbox" required className="mt-1 w-5 h-5 accent-brand" />
                  <span className="text-sm text-ink/60 font-medium leading-relaxed">
                    I agree to the <a href="/terms" className="text-brand underline">Terms of Service</a> and <a href="/privacy" className="text-brand underline">Privacy Policy</a>. I understand my data is shared with trusted partners.
                  </span>
                </label>
                <button 
                  type="submit"
                  className="w-full bg-ink text-white py-8 rounded-[2rem] font-bold text-2xl hover:bg-brand transition-all shadow-2xl flex items-center justify-center gap-4"
                >
                  Submit Request <ArrowRight size={24} />
                </button>
              </div>
            </form>
          </section>

          {/* Trust & Info Section */}
          <aside className="space-y-16 lg:sticky lg:top-32">
            <section className="p-12 bg-surface border border-ink/5 rounded-[3rem]">
              <h2 className="text-4xl font-display font-bold mb-8 tracking-tighter">Why Submit a Request?</h2>
              <ul className="space-y-8">
                {[
                  { title: "Verified Partners", desc: "We connect you with shipping companies we've personally vetted." },
                  { title: "Save Time", desc: "Avoid the hassle of researching logistics and customs paperwork." },
                  { title: "Personalized Help", desc: "Get a tailored solution based on your specific vehicle and budget." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                      <Check size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-ink/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="p-12 bg-brand text-white rounded-[3rem] relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full -ml-20 -mt-20" />
              <div className="relative z-10">
                <h2 className="text-4xl font-display font-bold mb-6 tracking-tighter">Your Data is Safe</h2>
                <p className="text-lg font-medium opacity-80 leading-relaxed">
                  We respect your privacy. Your information is only shared with trusted partners for the purpose of completing your request. We use industry-standard encryption to protect your details.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

const GuideView = ({ onViewChange }: { onViewChange: (view: View) => void }) => (
  <main className="pt-32 pb-32 px-6">
    <div className="max-w-7xl mx-auto">
      {/* Intro Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-1 bg-brand" />
          <span className="text-brand font-bold uppercase tracking-[0.3em] text-sm">Full Guide</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter leading-[0.85] mb-8">
          How to <span className="text-brand">Import</span>
        </h1>
        <p className="text-2xl text-ink/40 max-w-3xl font-medium leading-tight">
          Importing a car from the United States can save you money and give you access to a wider selection of vehicles. Here is a complete step-by-step guide to the process.
        </p>
      </motion.section>

      {/* Step by Step Process */}
      <section className="mb-32">
        <h2 className="text-5xl font-display font-bold mb-16 tracking-tighter">Step-by-Step Process</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            {
              step: "1",
              title: "Find a Car in the USA",
              desc: "Search for vehicles on US marketplaces. You can choose from auctions, dealers, or private sellers.",
              image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7"
            },
            {
              step: "2",
              title: "Check the Vehicle Details",
              desc: "Review the condition, mileage, and history of the vehicle before making a decision.",
              image: "https://images.unsplash.com/photo-1581091215367-59ab6b1b8f3b"
            },
            {
              step: "3",
              title: "Calculate Total Import Cost",
              desc: "Use our calculator to estimate shipping, taxes, and additional fees for importing the car to Bulgaria.",
              image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
              link: true
            },
            {
              step: "4",
              title: "Arrange Shipping",
              desc: "Choose a shipping method such as container shipping or roll-on/roll-off (RoRo).",
              image: "https://images.unsplash.com/photo-1565891741441-64926e441838"
            },
            {
              step: "5",
              title: "Customs Clearance in Bulgaria",
              desc: "Pay customs duty and VAT, and complete the import process through Bulgarian authorities.",
              image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
            },
            {
              step: "6",
              title: "Receive Your Car",
              desc: "After clearance, your car is ready for pickup or delivery to your location.",
              image: "https://images.unsplash.com/photo-1502877338535-766e1452684a"
            }
          ].map((item, i) => (
            <motion.article 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="aspect-video rounded-[2.5rem] overflow-hidden mb-8 bg-ink/5">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-4xl font-display font-bold text-brand/20 leading-none">{item.step}</span>
                <div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-ink/60 leading-relaxed mb-4">{item.desc}</p>
                  {item.link && (
                    <button 
                      onClick={() => onViewChange('landing')}
                      className="text-brand font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:text-ink transition-colors"
                    >
                      Try the calculator <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Cost Explanation & FAQ */}
      <div className="grid lg:grid-cols-2 gap-20">
        <section>
          <h2 className="text-4xl font-display font-bold mb-12 tracking-tighter">What Costs Are Included?</h2>
          <ul className="space-y-6">
            {[
              "Car purchase price",
              "Transport within the USA",
              "Ocean shipping",
              "Customs duty (~10%)",
              "VAT (20%)",
              "Port and handling fees"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 p-6 bg-white border border-ink/5 rounded-2xl font-bold text-lg">
                <div className="w-2 h-2 bg-brand rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-4xl font-display font-bold mb-12 tracking-tighter">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {[
              {
                q: "Is it cheaper to import a car from the USA?",
                a: "In many cases, yes. Even with shipping and taxes, prices can be lower compared to the local market."
              },
              {
                q: "How long does shipping take?",
                a: "Shipping usually takes between 6 and 10 weeks."
              },
              {
                q: "Can I import any car?",
                a: "Most cars can be imported, but they must meet EU regulations and standards."
              }
            ].map((faq, i) => (
              <article key={i} className="p-8 bg-surface border border-ink/5 rounded-3xl">
                <h3 className="text-xl font-bold mb-4 tracking-tight">{faq.q}</h3>
                <p className="text-ink/60 leading-relaxed">{faq.a}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="mt-32">
        <div className="bg-ink text-surface p-16 md:p-24 rounded-[4rem] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-brand/10 blur-[120px] rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tighter">Ready to Calculate Your Cost?</h2>
            <p className="text-xl font-medium mb-12 opacity-60 max-w-xl mx-auto">
              Use our tool to get an instant estimate for importing your chosen car.
            </p>
            <button 
              onClick={() => onViewChange('landing')}
              className="bg-brand text-white px-12 py-6 rounded-[2rem] font-bold text-xl hover:bg-white hover:text-ink transition-all shadow-2xl"
            >
              Go to Calculator
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>
);

const Testimonial = ({ quote, author, index }: { quote: string, author: string, index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="p-12 bg-white border border-ink/5 rounded-[3rem] relative"
  >
    <Quote className="absolute top-8 left-8 text-brand/10" size={60} />
    <blockquote className="text-2xl font-medium mb-8 relative z-10 leading-snug italic">
      "{quote}"
    </blockquote>
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-brand font-bold">
        {author[0]}
      </div>
      <span className="font-bold text-ink/40 uppercase tracking-widest text-sm">{author}</span>
    </div>
  </motion.div>
);

// --- Main App Component ---

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [url, setUrl] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      setIsCalculating(false);
      setView('breakdown');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar onViewChange={setView} currentView={view} />

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center px-6 pt-32 pb-20 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c" 
                  alt="Luxury car ready for export" 
                  className="w-full h-full object-cover opacity-20 grayscale"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/90 to-surface" />
              </div>

              <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                    <TrendingUp size={14} />
                    <span>Trusted by 1000+ Buyers</span>
                  </div>
                  <h1 className="text-7xl md:text-9xl font-display font-bold leading-[0.85] mb-8 tracking-tighter">
                    Import from <span className="text-brand">USA</span> to Bulgaria
                  </h1>
                  <p className="text-2xl text-ink/60 max-w-lg mb-12 leading-tight font-medium">
                    Instantly calculate shipping costs, import taxes, and total price. Trusted by car buyers across Bulgaria.
                  </p>
                  
                  <form onSubmit={handleCalculate} className="relative max-w-xl">
                    <div className="flex flex-col md:flex-row gap-4 p-3 bg-white border border-ink/10 rounded-[2.5rem] shadow-2xl shadow-ink/10">
                      <div className="flex-1 flex items-center px-6 gap-3">
                        <LinkIcon className="text-ink/30" size={20} />
                        <input 
                          type="url" 
                          required
                          placeholder="Paste car listing URL..."
                          className="w-full py-5 bg-transparent outline-none text-ink font-medium placeholder:text-ink/30 text-lg"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={isCalculating}
                        className="bg-brand text-white px-10 py-5 rounded-[2rem] font-bold flex items-center justify-center gap-2 hover:bg-ink transition-all disabled:opacity-50 text-lg"
                      >
                        {isCalculating ? (
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <Calculator size={24} />
                          </motion.div>
                        ) : (
                          <>
                            <span>Calculate</span>
                            <ArrowRight size={24} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="hidden lg:block relative"
                >
                  <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl rotate-3">
                    <img 
                      src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c" 
                      alt="Luxury car" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-10 -left-10 bg-brand text-white p-10 rounded-[3rem] shadow-2xl -rotate-6">
                    <div className="text-6xl font-display font-bold mb-1 tracking-tighter">100%</div>
                    <div className="text-sm font-bold uppercase tracking-widest opacity-80">Accuracy Rate</div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Trust Indicators */}
            <section className="py-20 border-y border-ink/5 bg-white">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
                  {[
                    { label: 'Cars analyzed', value: '1000+', icon: Search },
                    { label: 'Shipping estimates', value: 'Accurate', icon: Ship },
                    { label: 'No hidden fees', value: 'Transparent', icon: ShieldCheck },
                  ].map((item, i) => (
                    <div key={i} className={cn(
                      "flex flex-col items-center text-center px-12",
                      i !== 2 && "md:border-r border-ink/5"
                    )}>
                      <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-brand mb-6">
                        <item.icon size={24} />
                      </div>
                      <div className="text-5xl font-display font-bold mb-2 tracking-tighter">{item.value}</div>
                      <div className="text-sm font-bold uppercase tracking-widest text-ink/40">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How It Works Section (Preview) */}
            <section id="how-it-works" className="py-32 px-6 bg-surface">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
                  <div className="max-w-2xl">
                    <div className="text-brand font-bold uppercase tracking-[0.3em] text-sm mb-6">Process</div>
                    <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9]">How It Works</h2>
                  </div>
                  <button 
                    onClick={() => setView('how-it-works')}
                    className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm text-brand hover:text-ink transition-colors group"
                  >
                    <span>View Full Guide</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-12">
                  <Step 
                    index={0}
                    number="01"
                    title="Find a Car"
                    description="Browse US marketplaces like Copart or IAAI and copy the listing link of your dream vehicle."
                    image="https://images.unsplash.com/photo-1550355291-bbee04a92027"
                  />
                  <Step 
                    index={1}
                    number="02"
                    title="Paste the Link"
                    description="Enter the car URL into our calculator. We'll automatically pull the vehicle data for you."
                    image="https://images.unsplash.com/photo-1581091870627-3c7a5bde9b8b"
                  />
                  <Step 
                    index={2}
                    number="03"
                    title="Get Full Price"
                    description="See the total cost including shipping, customs, and taxes delivered to Bulgaria."
                    image="https://images.unsplash.com/photo-1605902711622-cfb43c44367f"
                  />
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="py-32 px-6 bg-white">
              <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <div className="grid grid-cols-1 gap-8">
                    {[
                      { title: "Complete Cost Breakdown", desc: "Every fee explained clearly before you buy. No hidden surprises." },
                      { title: "Real Shipping Data", desc: "Based on logistics routes from the USA to Bulgaria with live carrier rates." },
                      { title: "Import Guidance", desc: "Understand taxes, duties, and the full legal process for Bulgarian registration." }
                    ].map((feature, i) => (
                      <motion.article 
                        key={i}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-10 bg-surface rounded-[2.5rem] border border-ink/5 hover:border-brand/20 transition-all group"
                      >
                        <h3 className="text-3xl font-bold mb-4 group-hover:text-brand transition-colors">{feature.title}</h3>
                        <p className="text-ink/60 text-lg leading-relaxed">{feature.desc}</p>
                      </motion.article>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand/5 rounded-[4rem] blur-3xl" />
                    <div className="relative z-10">
                      <h2 className="text-7xl font-display font-bold mb-10 tracking-tighter leading-none">What You <span className="text-brand">Get</span></h2>
                      <p className="text-2xl text-ink/60 leading-relaxed mb-12 font-medium">
                        We provide the most accurate data in the industry, ensuring you make an informed decision on your next vehicle import.
                      </p>
                      <div className="w-24 h-24 bg-brand rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 size={48} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 px-6 bg-surface">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                  <h2 className="text-6xl font-display font-bold tracking-tighter">What Our Users Say</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                  <Testimonial 
                    index={0}
                    quote="I finally understood the real cost before buying my car. Saved me thousands in unexpected customs fees."
                    author="Ivan, Sofia"
                  />
                  <Testimonial 
                    index={1}
                    quote="Super easy to use and very accurate estimates. The shipping data was spot on with the final invoice."
                    author="Georgi, Plovdiv"
                  />
                </div>
              </div>
            </section>

            {/* Partners / Logistics */}
            <section className="py-32 px-6 bg-white overflow-hidden">
              <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <div>
                    <h2 className="text-6xl font-display font-bold mb-8 tracking-tighter">Shipping & Logistics</h2>
                    <p className="text-xl text-ink/60 leading-relaxed mb-12">
                      We work with international shipping partners to deliver your vehicle safely. From the auction yard in the US to the port in Bulgaria, your car is in safe hands.
                    </p>
                    <div className="flex items-center gap-6 p-8 bg-surface rounded-3xl border border-ink/5">
                      <Ship className="text-brand" size={40} />
                      <p className="font-bold text-ink/60 uppercase tracking-widest text-sm">
                        Weekly departures from NY, Savannah, and Houston.
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
                      <img 
                        src="https://images.unsplash.com/photo-1564859228273-274232fdb516" 
                        alt="Container ship" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute -bottom-6 -right-6 bg-ink text-surface p-8 rounded-3xl font-bold uppercase tracking-widest text-xs">
                      Global Network
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
              <div className="max-w-7xl mx-auto bg-brand text-white rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="relative z-10">
                  <h2 className="text-7xl md:text-9xl font-display font-bold mb-10 tracking-tighter leading-[0.85]">Ready to Import Your Car?</h2>
                  <p className="text-2xl md:text-3xl font-medium mb-16 opacity-80 max-w-2xl mx-auto">
                    Start by calculating your total cost now and join thousands of happy owners.
                  </p>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-white text-brand px-16 py-8 rounded-[2.5rem] font-bold text-2xl hover:bg-ink hover:text-white transition-all shadow-2xl"
                  >
                    Calculate Now
                  </button>
                </div>
              </div>
            </section>
          </motion.div>
        )}
        {view === 'breakdown' && (
          <motion.div
            key="breakdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <main className="pt-32 pb-32 px-6">
              <div className="max-w-7xl mx-auto">
                
                {/* Page Title */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-20"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-1 bg-brand" />
                    <span className="text-brand font-bold uppercase tracking-[0.3em] text-sm">Calculation Result</span>
                  </div>
                  <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter leading-[0.85] mb-8">
                    Your Car <span className="text-brand">Import</span> Cost
                  </h1>
                  <p className="text-2xl text-ink/40 max-w-2xl font-medium leading-tight">
                    Here is the estimated total cost to import your selected vehicle from the USA to Bulgaria.
                  </p>
                </motion.section>

                <div className="grid lg:grid-cols-12 gap-12">
                  
                  {/* Left Column: Vehicle Info & Delivery */}
                  <div className="lg:col-span-5 space-y-12">
                    
                    {/* Vehicle Information */}
                    <motion.section 
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white p-10 rounded-[3rem] border border-ink/5 shadow-xl shadow-ink/5"
                    >
                      <div className="flex items-center gap-3 mb-10">
                        <Car className="text-brand" size={24} />
                        <h2 className="text-3xl font-bold tracking-tight">Vehicle Information</h2>
                      </div>

                      <div className="aspect-video rounded-[2rem] overflow-hidden mb-10 bg-surface">
                        <img 
                          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d" 
                          alt="Selected car" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <h3 className="text-4xl font-display font-bold mb-8 tracking-tighter">Chevrolet Corvette C8</h3>
                      
                      <div className="grid grid-cols-2 gap-6">
                        {[
                          { label: 'Price', value: '$12,500', icon: DollarSign },
                          { label: 'Location', value: 'California, USA', icon: MapPin },
                          { label: 'Engine', value: '2.0L Petrol', icon: Fuel },
                          { label: 'Condition', value: 'Used', icon: CheckCircle2 },
                        ].map((item, i) => (
                          <div key={i} className="p-6 bg-surface rounded-2xl">
                            <div className="flex items-center gap-2 text-ink/40 mb-2">
                              <item.icon size={14} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                            </div>
                            <div className="font-bold text-lg">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </motion.section>

                    {/* Delivery Info */}
                    <motion.section 
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-ink text-surface p-10 rounded-[3rem] relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 blur-[100px] rounded-full -mr-32 -mt-32" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                          <Clock className="text-brand" size={24} />
                          <h2 className="text-3xl font-bold tracking-tight">Estimated Delivery</h2>
                        </div>
                        <div className="text-5xl font-display font-bold text-brand mb-4 tracking-tighter">6–10 Weeks</div>
                        <p className="text-surface/60 text-lg leading-relaxed">
                          Delivery includes transport from the USA to a Bulgarian port (Varna/Burgas) and full customs clearance.
                        </p>
                      </div>
                    </motion.section>

                    {/* Trust Info */}
                    <motion.section 
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="p-10 border border-ink/10 rounded-[3rem] bg-white/50"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Info className="text-ink/40" size={20} />
                        <h2 className="text-xl font-bold uppercase tracking-widest text-ink/40">Transparent Pricing</h2>
                      </div>
                      <p className="text-ink/60 leading-relaxed">
                        All estimates are based on real logistics data and current Bulgarian import regulations. Final costs may vary slightly depending on the provider and specific auction fees.
                      </p>
                    </motion.section>
                  </div>

                  {/* Right Column: Cost Breakdown & CTA */}
                  <div className="lg:col-span-7 space-y-12">
                    
                    {/* Cost Breakdown */}
                    <motion.section 
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white p-12 md:p-16 rounded-[4rem] border border-ink/5 shadow-2xl shadow-ink/5"
                    >
                      <div className="flex items-center gap-3 mb-12">
                        <ShieldCheck className="text-brand" size={28} />
                        <h2 className="text-4xl font-display font-bold tracking-tighter">Cost Breakdown</h2>
                      </div>

                      <div className="space-y-2">
                        <CostRow label="Car Price" value="$12,500" />
                        <CostRow label="Inland Transport (USA)" value="$800" />
                        <CostRow label="Ocean Shipping" value="$1,200" />
                        <CostRow label="Customs Duty (10%)" value="$1,450" />
                        <CostRow label="VAT (20%)" value="$3,190" />
                        <CostRow label="Port Fees" value="$300" />
                        <CostRow label="Broker Fees" value="$200" />
                        <CostRow label="Total Estimated Cost" value="$19,640" isTotal />
                      </div>

                      <div className="mt-12 p-8 bg-surface rounded-3xl flex items-center gap-4 text-ink/60">
                        <Euro size={20} className="shrink-0" />
                        <p className="text-sm font-medium">
                          Approximately <span className="text-ink font-bold">€18,068</span> at current exchange rates.
                        </p>
                      </div>
                    </motion.section>

                    {/* Next Steps / CTA */}
                    <motion.section 
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-brand text-white p-12 md:p-20 rounded-[4rem] relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                      <div className="relative z-10">
                        <h2 className="text-6xl font-display font-bold mb-8 tracking-tighter leading-none">Ready to <span className="text-ink">Import</span>?</h2>
                        <p className="text-2xl font-medium mb-12 opacity-90 max-w-xl">
                          Want help importing this car? We can connect you with trusted shipping partners and handle the entire process.
                        </p>
                        <button 
                          onClick={() => setView('contact')}
                          className="bg-white text-brand px-12 py-6 rounded-[2rem] font-bold text-xl hover:bg-ink hover:text-white transition-all flex items-center gap-4 shadow-2xl"
                        >
                          <span>Request Assistance</span>
                          <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                      </div>
                    </motion.section>

                  </div>
                </div>
              </div>
            </main>
          </motion.div>
        )}
        {view === 'how-it-works' && (
          <motion.div
            key="how-it-works"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HowItWorksView onViewChange={setView} />
          </motion.div>
        )}
        {view === 'guide' && (
          <motion.div
            key="guide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GuideView onViewChange={setView} />
          </motion.div>
        )}
        {view === 'marketplace' && (
          <motion.div
            key="marketplace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MarketplaceView onViewChange={setView} />
          </motion.div>
        )}
        {view === 'contact' && (
          <motion.div
            key="contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ContactView onViewChange={setView} />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
