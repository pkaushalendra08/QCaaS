import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaTrophy, FaHome, FaRedo, FaChartBar, FaRobot, FaMicrochip } from 'react-icons/fa';
import { SiQuantconnect } from 'react-icons/si';
import { BsCpu } from 'react-icons/bs';
import {
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import logo from '../assets/QCaaS-logo.png'

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;

  // Redirect if no results
  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200 flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold text-charcoal-900 mb-4">No Results Found</h1>
          <p className="text-charcoal-600 mb-6">Please run an experiment first.</p>
          <Link
            to="/experiment"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all"
          >
            <FaChartBar />
            Run Experiment
          </Link>
        </div>
      </div>
    );
  }

  const { svm_metrics, vqc_metrics, winner, execution_time_seconds, dataset_name } = results;

  // Prepare data for charts
  const comparisonData = [
    {
      metric: 'Accuracy',
      SVM: (svm_metrics.accuracy * 100).toFixed(2),
      VQC: (vqc_metrics.accuracy * 100).toFixed(2)
    },
    {
      metric: 'Precision',
      SVM: (svm_metrics.precision * 100).toFixed(2),
      VQC: (vqc_metrics.precision * 100).toFixed(2)
    },
    {
      metric: 'Recall',
      SVM: (svm_metrics.recall * 100).toFixed(2),
      VQC: (vqc_metrics.recall * 100).toFixed(2)
    },
    {
      metric: 'F1 Score',
      SVM: (svm_metrics.f1_score * 100).toFixed(2),
      VQC: (vqc_metrics.f1_score * 100).toFixed(2)
    }
  ];

  // Radar chart data
  const radarData = [
    {
      metric: 'Accuracy',
      SVM: svm_metrics.accuracy * 100,
      VQC: vqc_metrics.accuracy * 100,
      fullMark: 100
    },
    {
      metric: 'Precision',
      SVM: svm_metrics.precision * 100,
      VQC: vqc_metrics.precision * 100,
      fullMark: 100
    },
    {
      metric: 'Recall',
      SVM: svm_metrics.recall * 100,
      VQC: vqc_metrics.recall * 100,
      fullMark: 100
    },
    {
      metric: 'F1',
      SVM: svm_metrics.f1_score * 100,
      VQC: vqc_metrics.f1_score * 100,
      fullMark: 100
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header with Actions */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-charcoal-900 mb-2">
              Experiment Results
            </h1>
            <p className="text-lg text-charcoal-600">
              Dataset: <span className="font-semibold text-primary-600 capitalize">{dataset_name}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-parchment-50 text-charcoal-700 rounded-lg font-semibold border-2 border-charcoal-200 transition-all shadow-md hover:shadow-lg"
            >
              <FaHome />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              to="/experiment"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <FaRedo />
              <span className="hidden sm:inline">New Experiment</span>
            </Link>
          </div>
        </div>

        {/* Winner Announcement */}
        <div className="mb-8 text-center">
          <div className="inline-block px-8 py-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-2">
              <FaTrophy className="text-4xl" />
              <p className="text-lg font-semibold">Winner</p>
            </div>
            <p className="text-4xl font-bold mb-2">
              {winner === 'SVM' ? 'Classical SVM' : winner === 'VQC' ? 'Quantum VQC' : "It's a Tie!"}
            </p>
            <p className="text-sm opacity-90">
              Execution Time: {execution_time_seconds}s
            </p>
          </div>
        </div>

        {/* Interactive Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">

          {/* Bar Chart Comparison */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-parchment-200 p-6">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
              <FaChartBar className="text-primary-600" />
              Performance Comparison
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="metric" stroke="#4b5563" />
                <YAxis stroke="#4b5563" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="SVM" fill="#10b981" name="Classical SVM" radius={[8, 8, 0, 0]} />
                <Bar dataKey="VQC" fill="#d97706" name="Quantum VQC" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-parchment-200 p-6">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
              <SiQuantconnect className="text-primary-600" />
              Performance Radar
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" stroke="#4b5563" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#4b5563" />
                <Radar
                  name="SVM"
                  dataKey="SVM"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Radar
                  name="VQC"
                  dataKey="VQC"
                  stroke="#d97706"
                  fill="#d97706"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Academic Metrics Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">

          {/* Classical SVM Card - Academic Design */}
          <div className={`relative rounded-2xl shadow-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${winner === 'SVM' ? 'border-secondary-500 shadow-secondary-500/50' : 'border-charcoal-200'
            }`}>
            {/* Winner Badge */}
            {winner === 'SVM' && (
              <div className="absolute -top-4 -right-4 z-10">
                <div className="bg-gradient-to-br from-secondary-600 to-secondary-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold">
                  <FaTrophy className="text-lg" />
                  <span>Winner</span>
                </div>
              </div>
            )}

            {/* Card Header */}
            <div className="bg-gradient-to-br from-secondary-600 via-secondary-500 to-secondary-400 text-white px-8 py-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                      <BsCpu className="text-3xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Classical ML</h2>
                      <p className="text-sm opacity-90">Support Vector Machine</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg inline-block">
                    <p className="text-xs font-semibold opacity-90">OVERALL ACCURACY</p>
                    <p className="text-4xl font-bold mt-1">{(svm_metrics.accuracy * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body - Metrics Grid */}
            <div className="bg-white p-8">
              <h3 className="text-lg font-bold text-charcoal-900 mb-6 flex items-center gap-2">
                <FaChartBar className="text-secondary-600" />
                Performance Metrics
              </h3>

              <div className="space-y-6">
                <AcademicMetricRow
                  label="Accuracy"
                  value={svm_metrics.accuracy}
                  color="secondary"
                  icon="📊"
                  description="Correctly classified instances"
                />
                <AcademicMetricRow
                  label="Precision"
                  value={svm_metrics.precision}
                  color="secondary"
                  icon="🎯"
                  description="True positives / Predicted positives"
                />
                <AcademicMetricRow
                  label="Recall"
                  value={svm_metrics.recall}
                  color="secondary"
                  icon="🔍"
                  description="True positives / Actual positives"
                />
                <AcademicMetricRow
                  label="F1 Score"
                  value={svm_metrics.f1_score}
                  color="secondary"
                  icon="⚖️"
                  description="Harmonic mean of precision & recall"
                />
              </div>

              {/* Technical Details */}
              <div className="mt-8 pt-6 border-t-2 border-parchment-200">
                <h4 className="text-sm font-bold text-charcoal-700 mb-3">Algorithm Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailBadge label="Kernel" value="RBF" />
                  <DetailBadge label="Type" value="Supervised" />
                  <DetailBadge label="Paradigm" value="Classical" />
                  <DetailBadge label="Complexity" value="O(n²)" />
                </div>
              </div>
            </div>
          </div>

          {/* Quantum VQC Card - Academic Design */}
          <div className={`relative rounded-2xl shadow-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${winner === 'VQC' ? 'border-primary-500 shadow-primary-500/50' : 'border-charcoal-200'
            }`}>
            {/* Winner Badge */}
            {winner === 'VQC' && (
              <div className="absolute -top-4 -right-4 z-10">
                <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold">
                  <FaTrophy className="text-lg" />
                  <span>Winner</span>
                </div>
              </div>
            )}

            {/* Card Header */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white px-8 py-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                      <img
                        src={logo}
                        alt="QCaaS Logo"
                        className="h-8 w-auto sm:h-10 md:h-12 object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Quantum ML</h2>
                      <p className="text-sm opacity-90">Variational Quantum Classifier</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg inline-block">
                    <p className="text-xs font-semibold opacity-90">OVERALL ACCURACY</p>
                    <p className="text-4xl font-bold mt-1">{(vqc_metrics.accuracy * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body - Metrics Grid */}
            <div className="bg-white p-8">
              <h3 className="text-lg font-bold text-charcoal-900 mb-6 flex items-center gap-2">
                <SiQuantconnect className="text-primary-600" />
                Performance Metrics
              </h3>

              <div className="space-y-6">
                <AcademicMetricRow
                  label="Accuracy"
                  value={vqc_metrics.accuracy}
                  color="primary"
                  icon="📊"
                  description="Correctly classified instances"
                />
                <AcademicMetricRow
                  label="Precision"
                  value={vqc_metrics.precision}
                  color="primary"
                  icon="🎯"
                  description="True positives / Predicted positives"
                />
                <AcademicMetricRow
                  label="Recall"
                  value={vqc_metrics.recall}
                  color="primary"
                  icon="🔍"
                  description="True positives / Actual positives"
                />
                <AcademicMetricRow
                  label="F1 Score"
                  value={vqc_metrics.f1_score}
                  color="primary"
                  icon="⚖️"
                  description="Harmonic mean of precision & recall"
                />
              </div>

              {/* Technical Details */}
              <div className="mt-8 pt-6 border-t-2 border-parchment-200">
                <h4 className="text-sm font-bold text-charcoal-700 mb-3">Algorithm Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailBadge label="Qubits" value="2" />
                  <DetailBadge label="Type" value="Supervised" />
                  <DetailBadge label="Paradigm" value="Quantum" />
                  <DetailBadge label="Circuit Depth" value="O(d)" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-parchment-200 p-8">
          <h2 className="text-2xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
            <FaRobot className="text-primary-600" />
            Key Insights
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <InsightCard
              icon={<FaMicrochip />}
              title="Execution Time"
              value={`${execution_time_seconds}s`}
              description="Total processing time"
              color="accent"
            />
            <InsightCard
              icon={<BsCpu />}
              title="Classical Performance"
              value={`${(svm_metrics.accuracy * 100).toFixed(1)}%`}
              description="SVM Accuracy"
              color="secondary"
            />
            <InsightCard
              icon={<SiQuantconnect />}
              title="Quantum Performance"
              value={`${(vqc_metrics.accuracy * 100).toFixed(1)}%`}
              description="VQC Accuracy"
              color="primary"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

// Enhanced Academic Metric Row Component
const AcademicMetricRow = ({ label, value, color, icon, description }) => {
  const percentage = (value * 100).toFixed(2);
  const numericValue = parseFloat(percentage);

  const colorClasses = {
    primary: {
      bg: 'bg-primary-500',
      text: 'text-primary-700',
      light: 'bg-primary-50',
      border: 'border-primary-200'
    },
    secondary: {
      bg: 'bg-secondary-500',
      text: 'text-secondary-700',
      light: 'bg-secondary-50',
      border: 'border-secondary-200'
    }
  };

  const getPerformanceRating = (score) => {
    if (score >= 95) return 'Excellent';
    if (score >= 85) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Poor';
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${colorClasses[color].border} ${colorClasses[color].light} transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h4 className="text-base font-bold text-charcoal-900">{label}</h4>
            <p className="text-xs text-charcoal-600">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-charcoal-900">{percentage}%</p>
          <p className={`text-xs font-semibold ${colorClasses[color].text}`}>
            {getPerformanceRating(numericValue)}
          </p>
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="relative">
        <div className="w-full bg-charcoal-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full ${colorClasses[color].bg} transition-all duration-1000 ease-out rounded-full relative`}
            style={{ width: `${percentage}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
        {/* Threshold markers */}
        <div className="flex justify-between mt-1 text-xs text-charcoal-500">
          <span>0%</span>
          <span className="opacity-50">|</span>
          <span className="opacity-50">50%</span>
          <span className="opacity-50">|</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

// Detail Badge Component
const DetailBadge = ({ label, value }) => {
  return (
    <div className="text-center p-3 bg-parchment-100 rounded-lg border border-parchment-300">
      <p className="text-xs font-semibold text-charcoal-600 mb-1">{label}</p>
      <p className="text-sm font-bold text-charcoal-900">{value}</p>
    </div>
  );
};

// Insight Card Component
const InsightCard = ({ icon, title, value, description, color }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    accent: 'bg-accent-100 text-accent-600'
  };

  return (
    <div className="text-center p-6 bg-parchment-50 rounded-xl border-2 border-parchment-200 transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className={`inline-flex p-4 rounded-full ${colorClasses[color]} mb-3 text-3xl`}>
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-charcoal-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-charcoal-900 mb-1">{value}</p>
      <p className="text-xs text-charcoal-500">{description}</p>
    </div>
  );
};

export default Result;
