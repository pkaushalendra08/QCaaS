const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 300000;

/**
 * Run experiment comparison
 */
export const runExperiment = async (dataset) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    console.log(' Sending to backend:', { dataset_name: dataset });

    const response = await fetch(`${API_URL}/run_comparison`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dataset_name: dataset }), // ✅ Sends user's choice
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Analysis failed');
    }

    return await response.json();

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    } else if (error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server.');
    }
    throw error;
  }
};

