"""
QCaaS Backend
"""

import os
import logging
import time
import sys 

logging.critical("--- V4 DEPLOYMENT TEST ---")

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv



CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CURRENT_DIR)



load_dotenv()

try:
    from ml_logic import run_comparison_pipeline
except ImportError as e:
   
    logging.critical(f"ImportError: {e}")
    def run_comparison_pipeline(dataset_name):
        raise ImportError(f"ml_logic.py not found or corrupted. Cannot process {dataset_name}")


log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=log_level, 
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = Flask(__name__)


origins_str = os.environ.get("CORS_ORIGINS", "*")

if origins_str == "*":
    logging.warning("CORS is open to all origins ('*'). Set CORS_ORIGINS env var in production.")
    origins_list = "*"
else:

    origins_list = origins_str.split(',')
    logging.info(f"CORS configured for the following origins: {origins_list}")


CORS(app, resources={
    r"/api/*": {
        "origins": origins_list, 
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

VALID_DATASETS = ['iris', 'stroke', 'water_potability', 'heart', 'diabetes']


@app.route('/', methods=['GET'])
def home():
    """Root endpoint - API information"""
    return jsonify({
        'message': 'QCaaS API - Quantum-Enhanced Classification as aService',
        'version': '1.0.0',
        'status': 'running',
        'endpoints': {
            'health': '/api/health',
            'run_comparison': '/api/run_comparison (POST)'
        },
        'valid_datasets': VALID_DATASETS
    }), 200


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    logging.info("Health check endpoint was hit.")
    return jsonify({
        'status': 'healthy',
        'message': 'QCaaS API is running',
        'timestamp': time.time()
    }), 200


@app.route('/api/run_comparison', methods=['POST', 'OPTIONS'])
def run_comparison():

    if request.method == 'OPTIONS':
        return '', 204


    start_time = time.time()

    try:

        data = request.get_json()

        if not data:
            logging.warning("API call failed: No JSON data provided in request body")
            return jsonify({'error': 'No JSON data provided in request body'}), 400

        if 'dataset_name' not in data:
            logging.warning("API call failed: Missing 'dataset_name' field")
            return jsonify({
                'error': 'Missing required field: dataset_name',
                'valid_datasets': VALID_DATASETS
            }), 400

        dataset_name = data['dataset_name'].strip().lower()


        if dataset_name not in VALID_DATASETS:
            logging.warning(f"API call failed: Invalid dataset_name '{dataset_name}'")
            return jsonify({
                'error': f'Invalid dataset_name: "{dataset_name}"',
                'message': 'Please select a valid dataset',
                'valid_datasets': VALID_DATASETS
            }), 400


        logging.info(f"--- [REQUEST START] --- Dataset: {dataset_name} ---")


        svm_metrics, vqc_metrics = run_comparison_pipeline(dataset_name)


        end_time = time.time()
        execution_time_seconds = round(end_time - start_time, 2)


        svm_accuracy = svm_metrics['accuracy']
        vqc_accuracy = vqc_metrics['accuracy']

        winner = 'Tie'
        if svm_accuracy > vqc_accuracy:
            winner = 'SVM'
        elif vqc_accuracy > svm_accuracy:
            winner = 'VQC'


        logging.info(f"--- [REQUEST SUCCESS] --- Dataset: {dataset_name} ---")
        logging.info(f"Execution Time: {execution_time_seconds}s")
        logging.info(f"Winner: {winner} (SVM: {svm_accuracy:.4f} vs VQC: {vqc_accuracy:.4f})")


        response = {
            'svm_metrics': svm_metrics,
            'vqc_metrics': vqc_metrics,
            'winner': winner,
            'execution_time_seconds': execution_time_seconds,
            'dataset_name': dataset_name
        }

        return jsonify(response), 200

    except FileNotFoundError as fnf_error:
        logging.error(f"[ERROR] File not found: {str(fnf_error)}", exc_info=True)
        return jsonify({
            'error': f'Dataset file not found: {str(fnf_error)}',
            'message': 'Please ensure the CSV file exists in the /data directory on the server'
        }), 404

    except ValueError as val_error:
        logging.warning(f"[ERROR] Validation error: {str(val_error)}", exc_info=True)
        return jsonify({
            'error': str(val_error),
            'message': 'Data validation error occurred'
        }), 400

    except Exception as e:

        logging.critical(f"[CRITICAL ERROR] Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            'error': str(e),
            'message': 'An unexpected error occurred during comparison'
        }), 500


if __name__ == '__main__':

    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV', 'production') == 'development'

    logging.info(f"🚀 QCaaS Backend Server Starting...")
    logging.info(f"Valid Datasets: {', '.join(VALID_DATASETS)}")
    logging.info(f"Mode: {'Development' if debug_mode else 'Production'}")
    logging.info(f"CORS accepting origins from: {origins_list}")


    app.run(debug=debug_mode, host='0.0.0.0', port=port)