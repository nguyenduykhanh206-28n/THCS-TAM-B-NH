import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Menu, X, Bell, User as UserIcon, BookOpen, GraduationCap, Video, Calendar, Mail, Home as HomeIcon, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Intro = React.lazy(() => import('./pages/Intro'));
const News = React.lazy(() => import('./pages/News'));
const Materials = React.lazy(() => import('./pages/Materials'));
const Videos = React.lazy(() => import('./pages/Videos'));
const Timetable = React.lazy(() => import('./pages/Timetable'));
const Contact = React.lazy(() => import('./pages/Contact'));
const ChatbotWidget = React.lazy(() => import('./components/ChatbotWidget'));

function Navbar({ user }: { user: User | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Trang chủ', path: '/', icon: HomeIcon },
    { name: 'Giới thiệu', path: '/intro', icon: Info },
    { name: 'Tin tức', path: '/news', icon: Bell },
    { name: 'Tài liệu', path: '/materials', icon: BookOpen },
    { name: 'Video', path: '/videos', icon: Video },
    { name: 'Thời khóa biểu', path: '/timetable', icon: Calendar },
    { name: 'Liên hệ', path: '/contact', icon: Mail },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
               <GraduationCap className="h-6 w-6 text-blue-800" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none tracking-tight">EDU GATE THCS</h1>
              <p className="text-[10px] text-blue-100 opacity-80 uppercase tracking-widest font-medium">Cổng thông tin giáo dục</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-xs font-bold transition-all ${
                  location.pathname === item.path ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="h-6 w-px bg-blue-700 mx-2" />
            {user ? (
              <div className="flex items-center space-x-2 bg-blue-900 px-3 py-1.5 rounded-full border border-blue-600">
                <span className="text-[10px] font-bold">{user.displayName ? user.displayName.split(' ').pop() : 'User'}</span>
                <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center overflow-hidden">
                  {user.photoURL ? <img src={user.photoURL} alt="User" /> : <UserIcon className="h-3 w-3 text-slate-600" />}
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight hover:bg-yellow-300 transition-all">
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-blue-900 border-b border-blue-700 py-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-6 py-3 text-blue-100 hover:bg-blue-800 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs font-bold">{item.name}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingFallback />;

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col pt-16 font-sans">
        <Navbar user={user} />
        
        <main className="flex-grow bg-slate-50">
          <React.Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/intro" element={<Intro />} />
              <Route path="/news" element={<News />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </React.Suspense>
        </main>

        <footer className="bg-white border-t border-slate-200 h-10 px-6 flex items-center justify-between shrink-0 text-[10px] text-slate-500 whitespace-nowrap overflow-hidden">
          <div className="flex space-x-4">
            <span className="font-medium">© 2026 Trường THCS EduGate</span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="hidden sm:inline">Địa chỉ: 123 Đường Láng, Hà Nội</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span> Hệ thống trực tuyến</span>
          </div>
        </footer>

        <React.Suspense fallback={null}>
          <ChatbotWidget />
        </React.Suspense>
      </div>
    </BrowserRouter>
  );
}
