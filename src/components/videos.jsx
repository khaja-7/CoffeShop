import { useState } from 'react';
import { Play, X, Clock, Award, Sparkles } from 'lucide-react';

const VIDEOS_DATA = [
  {
    id: 1,
    title: 'The Art of Latte Art',
    description: 'Learn the foundational steps to pour a perfect heart, tulip, and Rosetta. Master milk steaming temperature and pitcher control.',
    videoUrl: 'https://www.youtube.com/embed/SiefJJv-Qho',
    thumbnail: 'https://img.youtube.com/vi/SiefJJv-Qho/hqdefault.jpg',
    duration: '3:45',
    difficulty: 'Intermediate',
    category: 'Latte Art'
  },
  {
    id: 2,
    title: 'Espresso Extraction Masterclass',
    description: 'Understand the science of extraction, dial in your grinder, measure yield, and achieve the perfect golden crema flow.',
    videoUrl: 'https://www.youtube.com/embed/Fxtl9xKlIhg',
    thumbnail: 'https://img.youtube.com/vi/Fxtl9xKlIhg/hqdefault.jpg',
    duration: '5:12',
    difficulty: 'Advanced',
    category: 'Espresso'
  },
  {
    id: 3,
    title: 'Perfect Pour Over Tutorial',
    description: 'Learn step-by-step pour patterns, water temperature adjustments, and bloom techniques using V60 and Chemex.',
    videoUrl: 'https://www.youtube.com/embed/1oB1oDrDkHM',
    thumbnail: 'https://img.youtube.com/vi/1oB1oDrDkHM/hqdefault.jpg',
    duration: '4:20',
    difficulty: 'Beginner',
    category: 'Pour Over'
  },
  {
    id: 4,
    title: 'The Coffee Roasting Process',
    description: 'A deep dive into how green beans are selected, heated, and cracked to unleash distinct regional flavor profiles.',
    videoUrl: 'https://www.youtube.com/embed/Y52WQygSrmQ',
    thumbnail: 'https://img.youtube.com/vi/Y52WQygSrmQ/hqdefault.jpg',
    duration: '2:50',
    difficulty: 'Beginner',
    category: 'Roasting'
  }
];

const CATEGORIES = ['All', 'Espresso', 'Pour Over', 'Latte Art', 'Roasting'];

export default function VideoShowcase() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeVideo, setActiveVideo] = useState(null);

  const filteredVideos = activeCategory === 'All'
    ? VIDEOS_DATA
    : VIDEOS_DATA.filter(video => video.category === activeCategory);

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Beginner': return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'Intermediate': return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'Advanced': return 'bg-rose-500/10 text-rose-700 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-coffee-cream/40 rounded-[3rem] border border-coffee-light/20 shadow-inner my-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 px-4 py-2 rounded-full mb-4 border border-brand-orange/20">
            <Sparkles size={16} className="text-brand-orange fill-brand-orange/30 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide text-brand-orange uppercase">Brew Academy</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-coffee-dark mb-4 tracking-tight">
            Learn From Our <span className="text-brand-orange italic">Master Baristas</span>
          </h2>
          <p className="text-gray-500 max-w-xl font-medium">
            Unlock the secrets of brewing coffee shop quality beverages from the comfort of your own kitchen.
          </p>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border ${
                activeCategory === category
                  ? 'bg-coffee-dark text-white border-coffee-dark shadow-md shadow-coffee-dark/20 scale-105'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-coffee-light/60 hover:text-coffee-dark'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group bg-white rounded-3xl overflow-hidden border border-coffee-light/10 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full transform hover:-translate-y-2"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-coffee-dark/5">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                
                {/* Overlay with play button */}
                <div className="absolute inset-0 bg-coffee-dark/30 group-hover:bg-coffee-dark/45 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 group-hover:bg-brand-orange text-coffee-dark group-hover:text-white rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all duration-500 ease-out">
                    <Play size={24} className="fill-current ml-1" />
                  </div>
                </div>



                {/* Category Tag */}
                <span className="absolute top-3 left-3 bg-brand-orange text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                  {video.category}
                </span>
              </div>

              {/* Info Area */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(video.difficulty)}`}>
                      {video.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-coffee-dark group-hover:text-brand-orange transition-colors duration-300 mb-2 font-serif line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium line-clamp-3 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-coffee-dark">
                  <span className="flex items-center gap-1 text-brand-orange">
                    <Award size={14} />
                    Certificate Class
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform text-gray-400 group-hover:text-brand-orange">
                    Watch Now →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Glassmorphic overlay */}
          <div
            onClick={() => setActiveVideo(null)}
            className="absolute inset-0 bg-coffee-dark/80 backdrop-blur-md transition-opacity duration-300"
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-4xl bg-white rounded-[2rem] overflow-hidden shadow-2xl z-10 border border-white/20 transform scale-100 animate-in fade-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-all duration-300 backdrop-blur-sm border border-white/20 z-20 hover:rotate-90"
            >
              <X size={20} />
            </button>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`${activeVideo.videoUrl}?autoplay=1`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Details Panel */}
            <div className="p-6 md:p-8 bg-coffee-cream">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-brand-orange text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                  {activeVideo.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(activeVideo.difficulty)}`}>
                  {activeVideo.difficulty}
                </span>
                <span className="text-gray-400 text-xs font-semibold flex items-center gap-1.5">
                  <Clock size={14} />
                  Duration: {activeVideo.duration} mins
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-black text-coffee-dark mb-3">
                {activeVideo.title}
              </h3>
              <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
                {activeVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
