import React, { useState } from 'react';
import { FaAtom, FaBrain, FaCode, FaExternalLinkAlt } from 'react-icons/fa';
import { MdScience } from 'react-icons/md';
import { Link } from 'react-router-dom';


const LearnMore = () => {
  const [activeTab, setActiveTab] = useState(0);


  const tabs = [
    {
      id: 0,
      title: 'Quantum Computing',
      icon: <FaAtom className="text-2xl" />,
      headline: 'What is Quantum Computing?',
      content: (
        <>
          <p className="mb-4">
            Quantum computing leverages quantum mechanics to tackle problems beyond classical computers. Unlike a classical bit (0 or 1), a qubit can exist in multiple states simultaneously. 
            This allows quantum computers to solve complex tasks—like molecular modeling, system optimization, or high-dimensional data analysis—potentially in minutes instead of millennia.
          </p>
        </>
      ),
      link: {
        text: "IBM's \"What is Quantum Computing?\"",
        url: 'https://www.ibm.com/think/topics/quantum-computing'
      }
    },
    {
      id: 1,
      title: 'Quantum ML',
      icon: <FaBrain className="text-2xl" />,
      headline: 'What is Quantum Machine Learning?',
      content: (
        <>
          <p className="mb-4">
            Quantum Machine Learning (QML) combines quantum data with hybrid quantum-classical models. While classical ML finds patterns in standard data, QML leverages quantum properties to uncover patterns in complex, high-dimensional data. 
            Variational Quantum Classifiers (VQC) use quantum circuits to process data and classical optimizers to train the model, merging quantum speed with classical efficiency.
          </p>
        </>
      ),
      link: {
        text: "TensorFlow's Quantum Machine Learning Concepts",
        url: 'https://www.tensorflow.org/quantum/concepts'
      }
    },
    {
      id: 2,
      title: 'Qiskit',
      icon: <FaCode className="text-2xl" />,
      headline: 'What is Qiskit?',
      content: (
        <>
          <p className="mb-4">
            Qiskit is a leading open-source quantum computing framework, used by 7,000+ researchers worldwide. Like React for web interfaces, Qiskit lets us build, test, and run quantum circuits. 
            In this project, we use Qiskit's Aer simulator to run our VQC model locally, without real quantum hardware, while remaining compatible with multiple quantum platforms like IBM, Amazon, and Microsoft.
          </p>
        </>
      ),
      link: {
        text: 'The Official Qiskit Homepage',
        url: 'https://www.ibm.com/quantum/qiskit'
      }
    }
  ];


  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent-50 via-parchment-100 to-secondary-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-accent-100 rounded-full mb-4">
            <MdScience className="text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">
              Core Technologies
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-900 mb-4 px-4">
            A Glimpse Under the Hood
          </h2>
          
          <p className="text-lg md:text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed px-4">
            A brief introduction to the core technologies that make this project possible.
          </p>
        </div>


        {/* Tabs Navigation */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 md:mb-12 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg scale-105'
                  : 'bg-white text-charcoal-700 hover:bg-parchment-100 border-2 border-parchment-300 hover:border-primary-300'
              }`}
            >
              <span className={`${activeTab === tab.id ? 'text-white' : 'text-primary-600'}`}>
                {tab.icon}
              </span>
              <span>{tab.title}</span>
            </button>
          ))}
        </div>


        {/* Tab Content */}
        <div className="max-w-4xl mx-auto px-4">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`transition-all duration-500 ${
                activeTab === tab.id ? 'block animate-fadeIn' : 'hidden'
              }`}
            >
              <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 border-2 border-parchment-200">
                
                {/* Tab Icon & Headline */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 md:mb-8">
                  <div className="bg-gradient-to-br from-accent-100 to-secondary-100 p-4 md:p-5 rounded-2xl text-primary-600 w-fit">
                    {tab.icon}
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-900">
                    {tab.headline}
                  </h3>
                </div>


                {/* Content */}
                <div className="bg-gradient-to-br from-accent-50 to-secondary-50 p-6 sm:p-8 md:p-10 rounded-2xl mb-6 md:mb-8 border-l-4 border-primary-600">
                  <div className="text-base sm:text-lg text-charcoal-700 leading-relaxed">
                    {tab.content}
                  </div>
                </div>


                {/* Learn More Link */}
                <div className="bg-gradient-to-r from-accent-50 to-primary-50 p-5 sm:p-6 rounded-xl border border-primary-200">
                  <div className="flex items-start sm:items-center gap-3 mb-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">📚</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-charcoal-900">
                      Learn More
                    </h4>
                  </div>
                  <a
                    href={tab.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-semibold text-sm sm:text-base transition-colors duration-200 group ml-11"
                  >
                    <span className="underline decoration-2 underline-offset-4">{tab.link.text}</span>
                    <FaExternalLinkAlt className="text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                  </a>
                </div>


                {/* Visual Separator */}
                <div className="mt-8 pt-6 border-t border-parchment-300">
                  <div className="flex items-center justify-center gap-2 text-charcoal-500 text-sm">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent to-parchment-400"></div>
                    <span className="font-medium">Powering QCaaS</span>
                    <div className="w-12 h-px bg-gradient-to-l from-transparent to-parchment-400"></div>
                  </div>
                </div>


              </div>
            </div>
          ))}
        </div>


        {/* Bottom Section - Why This Matters */}
        <div className="mt-12 md:mt-16 max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Why This Matters
            </h3>
            <p className="text-primary-100 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-6">
              By combining these three powerful technologies, QCaaS makes quantum machine learning 
              accessible to everyone—no PhD required. Experience the future of AI, today.
            </p>
            <Link
            to="/experiment"
            >
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-600 rounded-xl font-bold text-base sm:text-lg hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2 group">
              <span>Start Your First Experiment</span>
              <FaExternalLinkAlt className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};


export default LearnMore;
