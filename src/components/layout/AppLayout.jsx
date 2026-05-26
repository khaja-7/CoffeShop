import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative font-sans">
      <Navbar />
      {/* pt-0 md:pt-20 is for desktop top nav, pb-20 md:pb-0 is for mobile bottom nav */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-8 md:pt-24 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
