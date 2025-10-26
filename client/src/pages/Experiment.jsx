import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlay, FaHome, FaCheckCircle, FaClock } from 'react-icons/fa';
import { BiLoaderAlt } from 'react-icons/bi';
import { RiFlaskLine } from 'react-icons/ri';
import { runExperiment } from '../services/api';

const Experiment = () => {
  const navigate = useNavigate();
  const [dataset, setDataset] = useState('iris');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Loading steps with labels
  const loadingSteps = [
    { id: 1, label: 'Data Loaded & Prepared' },
    { id: 2, label: 'Training Classical SVM' },
    { id: 3, label: 'Training Quantum VQC (This is the heavy lifting, please wait...)' },
    { id: 4, label: 'Finalizing Results' }
  ];

 const handleRun = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 0: "Data Loaded & Prepared" is active
      setCurrentStep(0);
    
      await new Promise(r => setTimeout(r, 3000)); 

      // Step 1: "Training Classical SVM" is active
      setCurrentStep(1);
      await new Promise(r => setTimeout(r, 5000)); 

      // Step 2: "Training Quantum VQC" is active
      setCurrentStep(2);
      const data = await runExperiment(dataset); 

      // Step 3: "Finalizing Results" is active
      setCurrentStep(3);
      await new Promise(r => setTimeout(r, 1000)); // Fake 0.5s delay

      // Step 4: All steps are complete
      setCurrentStep(4);
      await new Promise(r => setTimeout(r, 500)); // Show completion

      // Navigate to the results page
      navigate('/result', { state: { results: data } });

    } catch (err) {
      console.error('Experiment error:', err);
      setError(err.message || 'The analysis failed. Please try again.');
      // On error, stop loading and reset steps
      setIsLoading(false);
      setCurrentStep(0);

    } finally {
      setIsLoading(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">

      {/* Home Button */}
      <Link
        to="/"
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white hover:bg-primary-50 text-charcoal-700 hover:text-primary-600 rounded-lg font-semibold border-2 border-charcoal-200 hover:border-primary-500 transition-all duration-200 shadow-md hover:shadow-lg group"
      >
        <FaHome className="text-lg group-hover:scale-110 transition-transform duration-200" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {/* Control Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-parchment-200 overflow-hidden">

        {/* Card Header */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 px-6 sm:px-8 py-8 border-b-2 border-parchment-200 text-center">
          <div className="flex items-center justify-center mb-4">
            <RiFlaskLine className="text-5xl text-primary-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 mb-3">
            Run a New Experiment
          </h1>
          <p className="text-base sm:text-lg text-charcoal-600">
            Select a dataset to begin the comparison
          </p>
        </div>

        {/* Content Area - Toggle between Form and Loading */}
        <div className="px-6 sm:px-8 py-8">

          {!isLoading ? (
            // ===== FORM VIEW =====
            <div className="space-y-8">
              {/* Dataset Dropdown */}
              <div>
                <label
                  htmlFor="dataset"
                  className="block text-lg sm:text-xl font-bold text-charcoal-900 mb-4"
                >
                  Select a Dataset
                </label>

                <select
                  id="dataset"
                  value={dataset}
                  onChange={(e) => setDataset(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-4 text-base sm:text-lg border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-charcoal-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  <option value="iris">Iris Dataset</option>
                  <option value="heart">Heart Disease Dataset</option>
                  <option value="diabetes">Diabetes Dataset</option>
                  <option value="stroke">Stroke Prediction Dataset</option>
                  <option value="water_potability">Water Potability Dataset</option>
                </select>


                <p className="mt-3 text-sm text-charcoal-600">
                  Pre-loaded datasets optimized for quantum vs classical comparison
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-parchment-300"></div>

              {/* Action Button */}
              <div>
                <button
                  onClick={handleRun}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-lg sm:text-xl hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaPlay className="text-lg" />
                  <span>Train & Compare Models</span>
                </button>

                <p className="mt-3 text-sm text-charcoal-600 text-center">
                  Trains both VQC and SVM models • Results appear automatically
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm mt-0.5">
                      !
                    </div>
                    <div>
                      <p className="text-sm font-bold text-red-700">Error</p>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // ===== LOADING VIEW =====
            <div className="space-y-8">
              {/* Main Status */}
              <div className="text-center">
                <BiLoaderAlt className="text-6xl text-primary-500 mx-auto mb-4 animate-spin" />
                <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 mb-2">
                  Analyzing...
                </h2>
                <p className="text-base text-charcoal-600">
                  Here's what's happening:
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4">
                {loadingSteps.map((step, index) => {
                  const isCompleted = index < currentStep;
                  const isActive = index === currentStep;
                  const isPending = index > currentStep;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${isCompleted
                          ? 'bg-secondary-50 border-2 border-secondary-300'
                          : isActive
                            ? 'bg-primary-50 border-2 border-primary-400 shadow-lg'
                            : 'bg-parchment-100 border-2 border-parchment-300'
                        }`}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {isCompleted ? (
                          <FaCheckCircle className="text-2xl text-secondary-600" />
                        ) : isActive ? (
                          <BiLoaderAlt className="text-2xl text-primary-600 animate-spin" />
                        ) : (
                          <FaClock className="text-2xl text-charcoal-400" />
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <p
                          className={`text-base sm:text-lg font-semibold ${isCompleted
                              ? 'text-secondary-700'
                              : isActive
                                ? 'text-primary-700'
                                : 'text-charcoal-500'
                            }`}
                        >
                          {isCompleted ? '✔️ ' : isActive ? '⌛ ' : ''}
                          {step.label}
                        </p>

                        {isCompleted && (
                          <p className="text-sm text-secondary-600 mt-1">
                            Completed!
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Info */}
              <div className="text-center pt-4">
                <p className="text-sm text-charcoal-600">
                  This process typically takes 60-90 seconds
                </p>
                <p className="text-xs text-charcoal-500 mt-2">
                  Please don't close this page
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Card Footer - Only show when NOT loading */}
        {!isLoading && (
          <div className="px-6 sm:px-8 py-6 bg-parchment-50 border-t-2 border-parchment-200 text-center">
            <p className="text-xs sm:text-sm text-charcoal-500">
              ⏱️ Analysis typically takes 60-90 seconds
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default Experiment;
