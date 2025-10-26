import React from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { SiQuantconnect } from 'react-icons/si';
import { MdBlock } from 'react-icons/md';
import logo from '../assets/QCaaS-logo.png'


const Problem = () => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-parchment-100 to-parchment-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">


          {/* Left Column - Text Content */}
          <div className="space-y-6">
            {/* Section Label */}
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary-100 rounded-full">
              <MdBlock className="text-primary-700" />
              <span className="text-sm font-semibold text-primary-800">
                The Challenge
              </span>
            </div>


            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl font-bold text-charcoal-900">
              The Quantum Wall
            </h2>


            {/* Problem Description */}
            <div className="space-y-4">
              <p className="text-lg md:text-xl text-charcoal-700 leading-relaxed">
                Quantum Machine Learning (QML) holds immense potential to revolutionize
                data science and artificial intelligence. However, there's a significant barrier
                preventing widespread adoption and experimentation.
              </p>


              <p className="text-lg md:text-xl text-charcoal-700 leading-relaxed">
                Despite its transformative power, QML remains locked behind a wall of complexity.
                Steep learning curves, limited access to quantum hardware, and complicated
                programming frameworks make it nearly impossible for researchers, students, and
                developers to gain hands-on experience.
              </p>


              <p className="text-lg md:text-xl text-charcoal-700 leading-relaxed">
                This accessibility gap stifles innovation, limits educational opportunities,
                and prevents the quantum computing community from growing at the pace it deserves.
              </p>
            </div>


            {/* Pain Points List */}
            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                  <span className="text-primary-700 text-sm font-bold">✕</span>
                </div>
                <p className="text-charcoal-700">
                  <span className="font-semibold">High Barrier to Entry:</span> Complex setup and
                  steep learning curve discourage experimentation
                </p>
              </div>


              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                  <span className="text-primary-700 text-sm font-bold">✕</span>
                </div>
                <p className="text-charcoal-700">
                  <span className="font-semibold">Limited Access:</span> Quantum hardware and
                  advanced frameworks remain out of reach for most
                </p>
              </div>


              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                  <span className="text-primary-700 text-sm font-bold">✕</span>
                </div>
                <p className="text-charcoal-700">
                  <span className="font-semibold">No Hands-On Learning:</span> Theoretical knowledge
                  without practical application limits skill development
                </p>
              </div>
            </div>
          </div>


          {/* Right Column - Visual Illustration */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-primary-200 rounded-full blur-3xl opacity-20"></div>


              {/* Main Visual Container */}
              <div className="relative bg-white p-8 sm:p-10 md:p-12 rounded-3xl shadow-2xl">
                <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">


                  {/* User Icon - Fixed Container */}
                  <div className="flex flex-col items-center space-y-3 w-20 sm:w-24 md:w-28 flex-shrink-0">
                    <div className="bg-secondary-100 p-4 sm:p-5 md:p-6 rounded-2xl w-full aspect-square flex items-center justify-center">
                      <FaUser className="text-4xl sm:text-5xl md:text-6xl text-secondary-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-charcoal-700 text-center leading-tight">
                      Learners &<br />Researchers
                    </span>
                  </div>


                  {/* Wall/Barrier - Fixed Container */}
                  <div className="flex flex-col items-center space-y-2 w-16 sm:w-20 md:w-24 flex-shrink-0">
                    <div className="bg-gradient-to-b from-primary-500 to-primary-600 p-3 sm:p-4 md:p-5 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 w-full aspect-square flex items-center justify-center">
                      <FaLock className="text-3xl sm:text-4xl md:text-5xl text-white" />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <div className="w-full h-2 md:h-2.5 bg-charcoal-400 rounded"></div>
                      <div className="w-full h-2 md:h-2.5 bg-charcoal-400 rounded"></div>
                      <div className="w-full h-2 md:h-2.5 bg-charcoal-400 rounded"></div>
                      <div className="w-full h-2 md:h-2.5 bg-charcoal-400 rounded"></div>
                    </div>
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-primary-700 text-center leading-tight">
                      COMPLEXITY<br />BARRIER
                    </span>
                  </div>


                  {/* Quantum ML Logo - Fixed Container */}
                  <div className="flex flex-col items-center space-y-3 w-20 sm:w-24 md:w-28 flex-shrink-0">
                    <div className="bg-accent-100 p-4 sm:p-5 md:p-6 rounded-2xl opacity-50 w-full aspect-square flex items-center justify-center">
                      <img
                        src={logo}
                        alt="QCaaS Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-charcoal-500 text-center leading-tight">
                      Quantum ML
                    </span>
                  </div>


                </div>


                {/* Arrow Indicators */}
                <div className="mt-6 sm:mt-8 flex justify-center">
                  <div className="bg-primary-50 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-primary-200">
                    <p className="text-xs sm:text-sm font-semibold text-primary-700 text-center whitespace-nowrap">
                      Access Denied
                    </p>
                  </div>
                </div>
              </div>


              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-primary-200 rounded-full blur-2xl opacity-40"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 sm:w-32 sm:h-32 bg-accent-200 rounded-full blur-2xl opacity-40"></div>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
};


export default Problem;
