import { BsStars } from 'react-icons/bs';
import logo from '../assets/QCaaS-logo.png'
import { Link } from 'react-router-dom'


const HeroSection = () => {
  return (
    <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>


      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Right Side - Title and Description */}
          <div className="order-2 md:order-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-accent-100 rounded-full">
              <BsStars className="text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">
                Quantum Machine Learning, Demystified
              </span>
            </div>


            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-900 leading-tight">
              <span className="text-xl sm:text-2xl lg:text-3xl text-charcoal-700">
                Welcome to
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                QCaaS
              </span>
              <br />
              <span className="text-2xl sm:text-4xl lg:text-5xl text-charcoal-700">
                Quantum-Enhanced Classification as a Service
              </span>
            </h1>


            <p className="text-lg md:text-xl text-charcoal-600 leading-relaxed">
              Benchmark a state-of-the-art quantum classifier against a classical standard with a single click.
              No quantum physics degree required
            </p>


            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/experiment"
                className="px-8 py-3 bg-primary-600 text-white text-center rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <button >
                  Launch Experiment
                </button>
              </Link>
              <a
                href="https://github.com/pkaushalendra08/QCaaS/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-primary-600 text-white text-center rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <button >
                  View documentation
                </button>
              </a>
            </div>
          </div>


          {/* Left Side - Big Logo */}
          <div className="order-1 md:order-2 flex justify-center items-center">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white p-6 sm:p-8 md:p-12 lg:p-16 rounded-3xl shadow-2xl flex justify-center items-center">
                <img
                  src={logo}
                  alt="QCaaS Logo"
                  className="w-full h-auto max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default HeroSection;
