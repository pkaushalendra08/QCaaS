const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 120000;

/**
 * Run experiment comparison
 */
export const runExperiment = async (dataset) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    console.log('🚀 Sending request to backend:', {
      url: `${API_URL}/run_comparison`,
      dataset_name: dataset
    });

    const response = await fetch(`${API_URL}/run_comparison`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dataset_name: dataset }), // ✅ Ensure correct key
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Backend error:', errorData);
      throw new Error(errorData.error || errorData.message || 'The analysis failed. Please try again.');
    }

    const data = await response.json();
    console.log('✅ Success:', data);
    return data;

  } catch (error) {
    clearTimeout(timeoutId);
    console.error('💥 Fetch error:', error);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout. The analysis is taking too long. Please try again.');
    } else if (error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check your connection.');
    }
    throw error;
  }
};
