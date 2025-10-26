import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaGithub, FaFileAlt, FaRocket } from 'react-icons/fa';
import logo from '../assets/QCaaS-logo.png'


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={logo} 
              alt="QCaaS Logo" 
              className="h-8 w-auto sm:h-10 md:h-12 object-contain"
            />
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              QCaaS
            </span>
          </Link>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* GitHub Link */}
            <a
              href="https://github.com/pkaushalendra08/QCaaS"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-charcoal-700 hover:text-primary-600 font-medium transition-colors duration-200 group"
              title="View Source Code"
            >
              <FaGithub className="text-2xl group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden lg:inline">Code</span>
            </a>


            {/* Research Paper Link */}
            <a
              href="/paper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-charcoal-700 hover:text-primary-600 font-medium transition-colors duration-200 group"
              title="Read the Research Paper"
            >
              <FaFileAlt className="text-xl group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden lg:inline">Paper</span>
            </a>


            {/* Launch App Button */}
            <Link
              to="/experiment"
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-md hover:shadow-lg group"
            >
              <FaRocket className="text-lg group-hover:translate-y-[-2px] transition-transform duration-200" />
              <span>Get Started</span>
            </Link>
          </div>


          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-charcoal-700 hover:text-primary-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>


        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            {/* GitHub Link - Mobile */}
            <a
              href="https://github.com/pkaushalendra08/QCaaS"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-charcoal-700 hover:text-primary-600 font-medium py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors duration-200"
            >
              <FaGithub className="text-xl" />
              <span>View on GitHub</span>
            </a>


            {/* Research Paper Link - Mobile */}
            <a
              href="/paper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-charcoal-700 hover:text-primary-600 font-medium py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors duration-200"
            >
              <FaFileAlt className="text-lg" />
              <span>Read Research Paper</span>
            </a>


            {/* Divider */}
            <div className="border-t border-parchment-300 my-2"></div>


            {/* Launch App Button - Mobile */}
            <Link
              to="/experiment"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-md"
            >
              <FaRocket className="text-lg" />
              <span>Get Started</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};


export default Navbar;
