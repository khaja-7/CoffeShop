import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import VideoShowcase from '../components/videos';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-coffee-cream/20 flex flex-col">
      {/* Hero Section */}
      <div className="min-h-[calc(100vh-theme(spacing.24))] w-full relative flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 py-12 lg:py-0 overflow-hidden">

        {/* Background Decorators */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-orange/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-coffee-medium/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Text Content Area */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-20 pt-12 lg:pt-0">
          <div className="inline-flex items-center gap-2 bg-coffee-dark/5 px-4 py-2 rounded-full mb-6 border border-coffee-dark/10">
            <Star size={16} className="text-brand-orange fill-brand-orange" />
            <span className="text-sm font-semibold tracking-wide text-coffee-dark">Premium Quality Coffee</span>
          </div>

          <h1 className="text-6xl lg:text-8xl font-serif font-black text-coffee-dark leading-tight mb-6">
            Start your <br />
            day with <span className="text-brand-orange italic">Coffee</span>
          </h1>

          <p className="text-lg text-gray-500 mb-10 max-w-md font-medium leading-relaxed">
            Experience the finest brew delivered straight to your door. Freshly roasted beans, perfectly crafted for your morning routine.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/menu')}
              className="group flex items-center justify-center gap-3 bg-coffee-dark hover:bg-brand-orange text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-xl shadow-coffee-dark/20 hover:shadow-brand-orange/30 transform active:scale-95"
            >
              Order Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* <button 
              onClick={() => navigate('/menu')}
              className="px-8 py-4 rounded-full text-lg font-bold text-coffee-dark border-2 border-coffee-dark hover:bg-coffee-dark hover:text-white transition-all duration-300"
            >
              View Menu
            </button> */}
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden`}>
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-sm">
              <p className="font-bold text-coffee-dark">10k+ Happy Customers</p>
              <p className="text-gray-500">4.9/5 Average Rating</p>
            </div>
          </div>
        </div>

        {/* Image Area */}
        <div className="w-full lg:w-1/2 relative mt-16 lg:mt-0 flex justify-center lg:justify-end z-10 h-full">
          {/* Main hero image */}
          <div className="relative w-full max-w-[500px] aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
            <img
              src="/assets/hero-coffee.jpg"
              alt="Delicious Coffee"
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
            />
            {/* Glassmorphism overlay card */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-2xl">☕️</span>
              </div>
              <div>
                <p className="text-white font-bold text-lg drop-shadow-md">Morning Special</p>
                <p className="text-white/90 text-sm font-medium drop-shadow-md">Get 20% off your first order</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Video Showcase Section */}
      <div className="px-6 lg:px-12 pb-16">
        <VideoShowcase />
      </div>
    </div>
  );
}
