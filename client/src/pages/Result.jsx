import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaTrophy, FaHome, FaRedo } from 'react-icons/fa';
import { RiFlaskLine } from 'react-icons/ri';
import { SiQuantconnect } from 'react-icons/si';
import { BsCpu } from 'react-icons/bs';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;

  // Redirect if no results
  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-charcoal-900 mb-4">No Results Found</h1>
          <p className="text-charcoal-600 mb-6">Please run an experiment first.</p>
          <Link
            to="/experiment"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all"
          >
            <RiFlaskLine />
            Run Experiment
          </Link>
        </div>
      </div>
    );
  }

  const { svm_metrics, vqc_metrics, winner, execution_time_seconds, dataset_name } = results;

  // Determine winner styling
  const getWinnerStyle = (model) => {
    if (winner === model) {
      return 'border-4 border-primary-500 bg-primary-50';
    }
    return 'border-2 border-parchment-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FaTrophy className="text-5xl text-primary-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-charcoal-900 mb-3">
            Experiment Results
          </h1>
          <p className="text-lg text-charcoal-600">
            Dataset: <span className="font-semibold text-primary-600">{dataset_name}</span>
          </p>
          <p className="text-sm text-charcoal-500 mt-2">
            ⏱️ Execution Time: {execution_time_seconds}s
          </p>
        </div>

        {/* Winner Announcement */}
        <div className="mb-12 text-center">
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl shadow-xl">
            <p className="text-sm font-semibold mb-1">🏆 Winner</p>
            <p className="text-3xl font-bold">
              {winner === 'SVM' ? 'Classical SVM' : winner === 'VQC' ? 'Quantum VQC' : 'It\'s a Tie!'}
            </p>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Classical SVM Card */}
          <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden ${getWinnerStyle('SVM')}`}>
            <div className="bg-gradient-to-r from-secondary-100 to-secondary-50 px-6 py-6 border-b-2 border-parchment-200">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white rounded-xl">
                  <BsCpu className="text-4xl text-secondary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-charcoal-900">Classical SVM</h2>
                  <p className="text-sm text-charcoal-600">Support Vector Machine</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <MetricRow label="Accuracy" value={svm_metrics.accuracy} />
              <MetricRow label="Precision" value={svm_metrics.precision} />
              <MetricRow label="Recall" value={svm_metrics.recall} />
              <MetricRow label="F1 Score" value={svm_metrics.f1_score} />
            </div>
          </div>

          {/* Quantum VQC Card */}
          <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden ${getWinnerStyle('VQC')}`}>
            <div className="bg-gradient-to-r from-accent-100 to-accent-50 px-6 py-6 border-b-2 border-parchment-200">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white rounded-xl">
                  <SiQuantconnect className="text-4xl text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-charcoal-900">Quantum VQC</h2>
                  <p className="text-sm text-charcoal-600">Variational Quantum Classifier</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <MetricRow label="Accuracy" value={vqc_metrics.accuracy} />
              <MetricRow label="Precision" value={vqc_metrics.precision} />
              <MetricRow label="Recall" value={vqc_metrics.recall} />
              <MetricRow label="F1 Score" value={vqc_metrics.f1_score} />
            </div>
          </div>

        </div>

        {/* Comparison Chart */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-charcoal-900 mb-6 text-center">
            Performance Comparison
          </h3>
          <div className="space-y-6">
            <ComparisonBar 
              label="Accuracy" 
              svm={svm_metrics.accuracy} 
              vqc={vqc_metrics.accuracy} 
            />
            <ComparisonBar 
              label="Precision" 
              svm={svm_metrics.precision} 
              vqc={vqc_metrics.precision} 
            />
            <ComparisonBar 
              label="Recall" 
              svm={svm_metrics.recall} 
              vqc={vqc_metrics.recall} 
            />
            <ComparisonBar 
              label="F1 Score" 
              svm={svm_metrics.f1_score} 
              vqc={vqc_metrics.f1_score} 
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/experiment"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg hover:shadow-xl"
          >
            <FaRedo />
            Run Another Experiment
          </Link>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-xl font-bold text-lg hover:bg-primary-50 transition-all"
          >
            <FaHome />
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

// Metric Row Component
const MetricRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-charcoal-700 font-medium">{label}</span>
    <div className="flex items-center gap-3">
      <div className="w-32 bg-parchment-200 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
          style={{ width: `${value * 100}%` }}
        ></div>
      </div>
      <span className="text-xl font-bold text-primary-600 w-16 text-right">
        {(value * 100).toFixed(1)}%
      </span>
    </div>
  </div>
);

// Comparison Bar Component
const ComparisonBar = ({ label, svm, vqc }) => (
  <div>
    <p className="text-sm font-semibold text-charcoal-700 mb-2">{label}</p>
    <div className="flex gap-4 items-center">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-charcoal-600 w-16">SVM</span>
          <div className="flex-1 bg-parchment-200 rounded-full h-6 overflow-hidden">
            <div 
              className="h-full bg-secondary-500 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
              style={{ width: `${svm * 100}%` }}
            >
              <span className="text-xs font-bold text-white">{(svm * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal-600 w-16">VQC</span>
          <div className="flex-1 bg-parchment-200 rounded-full h-6 overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
              style={{ width: `${vqc * 100}%` }}
            >
              <span className="text-xs font-bold text-white">{(vqc * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Result;
