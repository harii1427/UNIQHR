import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import Logo from '../assets/Logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold">UNIQ HR</span>
            </div>
            <p className="text-gray-300 uppercase">
              Connecting talent with opportunity through professional HR consulting services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 uppercase">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors uppercase">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors uppercase">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 uppercase">Services</h3>
<ul className="space-y-2 text-gray-300 uppercase">
  {["Executive Search", "Talent Acquisition", "HR Consulting", "Career Guidance"].map((item) => (
    <li key={item}>
      <a href="/contact" className="hover:underline">
        {item}
      </a>
    </li>
  ))}
</ul>

          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 uppercase">Contact Info</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 90250 94907</span>
              </div>
              <div className="flex items-center space-x-2 ">
                <Mail className="h-4 w-4" />
                <span>info@uniqhr.com</span>
              </div>
              <div className="flex items-center space-x-2 uppercase">
                <MapPin className="h-4 w-4" />
                <span>Coimbatore</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300 uppercase">
          <p>&copy; {new Date().getFullYear()} UNIQ HR. All rights reserved.</p>
          <div className="flex justify-center items-center mt-4">
            <p className="text-xs text-gray-400 mr-1">Powered by</p>
            <a href="https://qwatinnovations.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://firebasestorage.googleapis.com/v0/b/qwat-9aaab.appspot.com/o/Qwat%20innovations%2FLogo-dark.svg?alt=media&token=3c95d22b-8feb-473c-917f-deda4ed417ef" alt="Qwat Logo" className="h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
