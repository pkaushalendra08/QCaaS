"""
QCaaS Backend - Flask API Server
Handles HTTP requests and routing
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import os
from ml_logic import run_comparison_pipeline

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all origins (required for frontend communication)
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Valid dataset names
VALID_DATASETS = ['iris', 'stroke', 'water_potability', 'heart', 'diabetes']


@app.route('/', methods=['GET'])
def home():
    """Root endpoint - API information"""
    return jsonify({
        'message': 'QCaaS API - Quantum-Enhanced Classification as a Service',
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
    return jsonify({
        'status': 'healthy',
        'message': 'QCaaS API is running',
        'timestamp': time.time()
    }), 200


@app.route('/api/run_comparison', methods=['POST', 'OPTIONS'])
def run_comparison():
    """
    Main endpoint - Runs SVM vs VQC comparison
    
    Request Body:
        {
            "dataset_name": "iris"  // One of: iris, stroke, water_potability, heart, diabetes
        }
    
    Response:
        {
            "svm_metrics": {
                "accuracy": 0.97,
                "precision": 0.97,
                "recall": 0.97,
                "f1_score": 0.97
            },
            "vqc_metrics": {
                "accuracy": 0.94,
                "precision": 0.94,
                "recall": 0.94,
                "f1_score": 0.94
            },
            "winner": "SVM" | "VQC" | "Tie",
            "execution_time_seconds": 45.3,
            "dataset_name": "iris"
        }
    """
    
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 204
    
    # Start execution timer
    start_time = time.time()
    
    try:
        # Get and validate request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No JSON data provided in request body'
            }), 400
        
        if 'dataset_name' not in data:
            return jsonify({
                'error': 'Missing required field: dataset_name',
                'valid_datasets': VALID_DATASETS
            }), 400
        
        dataset_name = data['dataset_name'].strip().lower()
        
        # Validate dataset name
        if dataset_name not in VALID_DATASETS:
            return jsonify({
                'error': f'Invalid dataset_name: "{dataset_name}"',
                'message': 'Please select a valid dataset',
                'valid_datasets': VALID_DATASETS
            }), 400
        
        # Log request
        print(f"\n{'='*70}")
        print(f"[REQUEST] Starting comparison for dataset: {dataset_name}")
        print(f"{'='*70}\n")
        
        # Run the comparison pipeline
        svm_metrics, vqc_metrics = run_comparison_pipeline(dataset_name)
        
        # Calculate execution time
        end_time = time.time()
        execution_time_seconds = round(end_time - start_time, 2)
        
        # Determine winner based on accuracy
        svm_accuracy = svm_metrics['accuracy']
        vqc_accuracy = vqc_metrics['accuracy']
        
        if svm_accuracy > vqc_accuracy:
            winner = 'SVM'
        elif vqc_accuracy > svm_accuracy:
            winner = 'VQC'
        else:
            winner = 'Tie'
        
        # Log completion
        print(f"\n{'='*70}")
        print(f"[SUCCESS] Comparison completed in {execution_time_seconds}s")
        print(f"[WINNER] {winner}")
        print(f"[SVM] Accuracy: {svm_accuracy:.4f}")
        print(f"[VQC] Accuracy: {vqc_accuracy:.4f}")
        print(f"{'='*70}\n")
        
        # Construct success response
        response = {
            'svm_metrics': svm_metrics,
            'vqc_metrics': vqc_metrics,
            'winner': winner,
            'execution_time_seconds': execution_time_seconds,
            'dataset_name': dataset_name
        }
        
        return jsonify(response), 200
    
    except FileNotFoundError as fnf_error:
        print(f"[ERROR] File not found: {str(fnf_error)}")
        return jsonify({
            'error': f'Dataset file not found: {str(fnf_error)}',
            'message': 'Please ensure the CSV file exists in the /data directory'
        }), 404
    
    except ValueError as val_error:
        print(f"[ERROR] Validation error: {str(val_error)}")
        return jsonify({
            'error': str(val_error),
            'message': 'Data validation error occurred'
        }), 400
    
    except Exception as e:
        print(f"[ERROR] Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'error': str(e),
            'message': 'An unexpected error occurred during comparison'
        }), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug_mode = os.getenv('FLASK_ENV', 'production') == 'development'
    
    print(f"\n{'='*70}")
    print(f"🚀 QCaaS Backend Server Starting...")
    print(f"{'='*70}")
    print(f"Port: {port}")
    print(f"Debug Mode: {debug_mode}")
    print(f"Valid Datasets: {', '.join(VALID_DATASETS)}")
    print(f"{'='*70}\n")
    
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
