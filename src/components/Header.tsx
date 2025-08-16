import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../firebase';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../assets/Logo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      setScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    // { name: 'Job Seeker Portal', path: '/job-seeker' },
    { name: 'News', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <motion.header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <motion.div
        animate={{
          width: scrolled ? 'auto' : '100%',
          borderRadius: scrolled ? '16px' : '0px',
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className={`mt-4 transition-colors duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4">
          <motion.div
            animate={{
              paddingLeft: scrolled ? '1.5rem' : '0.5rem',
              paddingRight: scrolled ? '1.5rem' : '0.5rem',
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex items-center justify-between h-[80px]"
          >
            {/* Logo on far left */}
            <div className="flex-shrink-0 w-36">
              <Link to="/" className="flex items-center">
                <img
                  src={Logo}
                  alt="Uniq HR Logo"
                  className="h-12 object-contain"
                />
              </Link>
            </div>

            {/* Navigation + Mobile toggle on far right */}
            <div className="flex items-center space-x-4">
              <motion.div layout className="hidden lg:flex items-center space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`transition-all duration-300 hover:text-blue-600 text-base whitespace-nowrap ${
                      location.pathname === item.path
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {user && (
                  <Link
                    to="/admindashboard"
                    className={`transition-all duration-300 hover:text-blue-600 text-base whitespace-nowrap ${
                      location.pathname === '/admindashboard'
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-900'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                {user && (
                  <button onClick={handleLogout} className="text-gray-900 hover:text-blue-600">Logout</button>
                )}
              </motion.div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-md transition-colors text-gray-900 hover:bg-gray-100"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </motion.div>

          {/* Mobile navigation dropdown */}
          <motion.div
            initial={false}
            animate={{ height: isOpen ? 'auto' : 0 }}
            className="lg:hidden overflow-hidden bg-white shadow-lg rounded-lg mt-2"
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <Link
                  to="/admindashboard"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md transition-colors ${
                    location.pathname === '/admindashboard'
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Admin
                </Link>
              )}
              {user && (
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">Logout</button>
              )}
            </div>
          </motion.div>
        </nav>
      </motion.div>
    </motion.header>
  );
};

export default Header;
