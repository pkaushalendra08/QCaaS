import { Link } from 'react-router-dom';
import { FiSettings, FiPlay, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import { MdCompareArrows } from 'react-icons/md';
import { RiFlaskLine } from 'react-icons/ri';


const Solution = () => {
    const steps = [
        {
            number: '01',
            icon: <FiSettings className="text-5xl" />,
            title: '1. Select Benchmark',
            description: 'Choose from a pre-loaded library of standard academic datasets like Iris, Wine, and Breast Cancer.',
            features: ['Controlled experiment', 'Standard benchmark data', 'No complex setup']
        },
        {
            number: '02',
            icon: <MdCompareArrows className="text-5xl" />,
            title: '2. Run Comparison',
            description: 'With one click, our platform trains both a quantum VQC and a classical SVM on the exact same data for a fair, head-to-head test.',
            features: ['One-click execution', 'Fair VQC vs. SVM test', 'Automated processing']
        },
        {
            number: '03',
            icon: <FiBarChart2 className="text-5xl" />,
            title: '3. Analyze Results',
            description: 'View the performance on a clear, visual dashboard. See the side-by-side metrics to gain real, data-driven insights.',
            features: ['Clear results dashboard', 'Key performance metrics', 'Visual comparisons']
        }
    ];


    return (
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">


                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1 bg-accent-100 rounded-full mb-4">
                        <FiPlay className="text-primary-600" />
                        <span className="text-sm font-semibold text-primary-700">
                            The Solution
                        </span>
                    </div>


                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-900 px-4">
                        Your Personal Quantum Sandbox
                    </h2>


                    <p className="text-lg md:text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed px-4">
                        Experience the power of quantum machine learning without the complexity.
                        Our platform handles everything in three simple steps.
                    </p>
                </div>


                {/* Three Column Grid for Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mb-12 md:mb-16">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="relative group"
                        >
                            {/* Step Card */}
                            <div className="bg-gradient-to-br from-parchment-100 to-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-parchment-200 hover:border-primary-200 h-full flex flex-col">


                                {/* Step Number Badge */}
                                <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-base md:text-lg">{step.number}</span>
                                </div>


                                {/* Icon Container */}
                                <div className="mb-4 md:mb-6 text-primary-600 group-hover:scale-110 group-hover:text-primary-700 transition-all duration-300">
                                    {step.icon}
                                </div>


                                {/* Title */}
                                <h3 className="text-xl md:text-2xl font-bold text-charcoal-900 mb-3 md:mb-4">
                                    {step.title}
                                </h3>


                                {/* Description */}
                                <p className="text-charcoal-600 leading-relaxed mb-4 md:mb-6 flex-grow">
                                    {step.description}
                                </p>


                                {/* Features List */}
                                <div className="space-y-2 pt-4 border-t border-parchment-300">
                                    {step.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary-600 rounded-full flex-shrink-0"></div>
                                            <span className="text-sm text-charcoal-600">{feature}</span>
                                        </div>
                                    ))}
                                </div>


                                {/* Hover Effect Arrow */}
                                <div className="mt-4 md:mt-6 text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                                    {/* <span className="text-sm font-semibold">Learn more</span>
                                    <svg className="w-4 h-4 animate-bounce-horizontal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg> */}
                                </div>
                            </div>


                            {/* Connector Arrow (not shown on last item on desktop) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 text-primary-300 z-10">
                                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


export default Solution;
