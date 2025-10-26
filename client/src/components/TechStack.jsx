import React from 'react';
import { FaReact, FaPython } from 'react-icons/fa';
import { SiQiskit, SiScikitlearn, SiTailwindcss } from 'react-icons/si';


const TechStack = () => {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-parchment-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Centered Headline */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900 mb-4">
            Powered by Cutting-Edge Technology
          </h2>
          <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
            Built with the most advanced tools in web development and quantum computing
          </p>
        </div>


        {/* Simple Logo Cloud Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          
          {/* React */}
          <div className="flex flex-col items-center gap-3 group">
            <FaReact className="text-6xl md:text-7xl text-[#61DAFB] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-semibold text-charcoal-700">React</span>
          </div>


          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-parchment-400"></div>


          {/* Qiskit */}
          <div className="flex flex-col items-center gap-3 group">
            <SiQiskit className="text-6xl md:text-7xl text-[#6929C4] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-semibold text-charcoal-700">Qiskit</span>
          </div>


          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-parchment-400"></div>


          {/* Python */}
          <div className="flex flex-col items-center gap-3 group">
            <FaPython className="text-6xl md:text-7xl text-[#3776AB] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-semibold text-charcoal-700">Python</span>
          </div>


          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-parchment-400"></div>


          {/* Scikit-learn */}
          <div className="flex flex-col items-center gap-3 group">
            <SiScikitlearn className="text-6xl md:text-7xl text-[#F7931E] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-semibold text-charcoal-700">Scikit-learn</span>
          </div>


          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-parchment-400"></div>


          {/* Tailwind CSS */}
          <div className="flex flex-col items-center gap-3 group">
            <SiTailwindcss className="text-6xl md:text-7xl text-[#06B6D4] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-semibold text-charcoal-700">Tailwind CSS</span>
          </div>


        </div>


      </div>
    </section>
  );
};


export default TechStack;
