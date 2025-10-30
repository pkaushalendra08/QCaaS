"""
QCaaS ML Logic 
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import logging 

# Qiskit imports
from qiskit.primitives import Sampler
from qiskit.circuit.library import ZZFeatureMap, RealAmplitudes
from qiskit_machine_learning.algorithms import VQC
from qiskit.algorithms.optimizers import COBYLA

# ⚡ SPEED OPTIMIZATIONS
NUM_QUBITS = 2
TEST_SIZE = 0.25
RANDOM_STATE = 42
VQC_REPS = 1
VQC_MAXITER = 50


def run_comparison_pipeline(dataset_name):
    """Main pipeline"""
    logging.info(f"{'='*70}")
    logging.info(f"STARTING PIPELINE: {dataset_name.upper()}")
    logging.info(f"{'='*70}")
    
    X, y = _load_and_prepare_data(dataset_name)
    
    logging.info(f"PHASE 1: SVM")
    svm_metrics = _run_svm(X, y)
    
    logging.info(f"PHASE 2: VQC")
    vqc_metrics = _run_vqc(X, y)
    
    return svm_metrics, vqc_metrics


def _load_and_prepare_data(dataset_name):
    """Load CSV - optimized"""
    dataset_config = {
        'iris': {'file': 'iris.csv', 'target': 'Species', 'drop': ['Id']},
        'heart': {'file': 'heart.csv', 'target': 'num', 'drop': ['id']},
        'diabetes': {'file': 'diabetes.csv', 'target': 'Outcome', 'drop': []},
        'stroke': {'file': 'stroke.csv', 'target': 'stroke', 'drop': ['id']},
        'water_potability': {'file': 'water_potability.csv', 'target': 'Potability', 'drop': []}
    }
    
    if dataset_name not in dataset_config:
        logging.error(f"Unknown dataset: {dataset_name}")
        raise ValueError(f"Unknown dataset: {dataset_name}")
    
    config = dataset_config[dataset_name]
    filepath = f'data/{config["file"]}'
    
    try:
        df = pd.read_csv(filepath, low_memory=False)
    except FileNotFoundError:
        logging.error(f"Data file not found at: {filepath}")
        raise FileNotFoundError(f"Required data file not found on server: {filepath}")
        
    logging.info(f"[OK] Loaded {len(df)} rows from {filepath}")
    
    if config['drop']:
        df.drop(columns=config['drop'], errors='ignore', inplace=True)
    
    if config['target'] not in df.columns:
        logging.error(f"Target '{config['target']}' not found in {filepath}")
        raise ValueError(f"Target '{config['target']}' not found")
    
    y = df[config['target']].copy()
    X_df = df.drop(columns=[config['target']])
    
    X_df.fillna(X_df.median(numeric_only=True), inplace=True)
    X_df.fillna('Unknown', inplace=True)
    
    valid_mask = y.notna()
    y = y[valid_mask]
    X_df = X_df[valid_mask]
    
    categorical_cols = X_df.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        X_df[col] = LabelEncoder().fit_transform(X_df[col].astype(str))
    
    X = X_df.values.astype(np.float64)
    
    if y.dtype == object:
        y = LabelEncoder().fit_transform(y.astype(str))
    else:
        y = y.values.astype(np.int64)
        if dataset_name == 'heart':
            y = (y > 0).astype(np.int64)
    
    if np.isnan(X).any():
        col_median = np.nanmedian(X, axis=0)
        inds = np.where(np.isnan(X))
        X[inds] = np.take(col_median, inds[1])
    
    logging.info(f"Data Prep OK: Samples={X.shape[0]} | Features={X.shape[1]} | Classes={len(np.unique(y))}")
    return X, y


def _calculate_metrics(y_true, y_pred):
    """Calculate metrics"""
    return {
        'accuracy': round(float(accuracy_score(y_true, y_pred)), 4),
        'precision': round(float(precision_score(y_true, y_pred, average='weighted', zero_division=0)), 4),
        'recall': round(float(recall_score(y_true, y_pred, average='weighted', zero_division=0)), 4),
        'f1_score': round(float(f1_score(y_true, y_pred, average='weighted', zero_division=0)), 4)
    }


def _run_svm(X_original, y):
    """Train SVM"""
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_original)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    
    logging.info(f"Training SVM on {len(X_train)} samples...")
    svm = SVC(kernel='rbf', random_state=RANDOM_STATE)
    svm.fit(X_train, y_train)
    
    y_pred = svm.predict(X_test)
    metrics = _calculate_metrics(y_test, y_pred)
    
    logging.info(f"✓ SVM Accuracy: {metrics['accuracy']:.4f}")
    return metrics


def _run_vqc(X_original, y):
    """Train VQC"""
    logging.info("Preprocessing for VQC...")
    
    pca = PCA(n_components=NUM_QUBITS)
    X_reduced = pca.fit_transform(X_original)
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_reduced)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    
    logging.info(f"Configuring {NUM_QUBITS}-qubit quantum circuit...")
    
    feature_map = ZZFeatureMap(
        feature_dimension=NUM_QUBITS,
        reps=VQC_REPS,
        entanglement='linear',
        insert_barriers=False
    )
    
    ansatz = RealAmplitudes(
        num_qubits=NUM_QUBITS,
        reps=VQC_REPS,
        entanglement='linear',
        insert_barriers=False
    )
    
    sampler = Sampler()
    optimizer = COBYLA(maxiter=VQC_MAXITER)
    
    try:
        vqc = VQC(
            sampler=sampler,
            feature_map=feature_map,
            ansatz=ansatz,
            optimizer=optimizer,
            callback=None
        )
        
        logging.info(f"⚛️  Training VQC (this may take 60-90 seconds)...")
        vqc.fit(X_train, y_train)
        
        logging.info(f"🔮 Making predictions...")
        y_pred = vqc.predict(X_test)
        
    except Exception as e:
        error_msg = str(e)
        logging.warning(f"⚠️  VQC error occurred: {error_msg[:100]}")
        
        if "Register size" in error_msg or "integer" in error_msg.lower():
            logging.info(f"[FALLBACK] VQC error detected. Using simplified 1-qubit VQC...")
            
            pca_fb = PCA(n_components=1)
            X_reduced_fb = pca_fb.fit_transform(X_original)
            X_scaled_fb = StandardScaler().fit_transform(X_reduced_fb)
            X_train_fb, X_test_fb, _, _ = train_test_split(
                X_scaled_fb, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
            )
            
            feature_map_fb = ZZFeatureMap(1, reps=1, entanglement='linear', insert_barriers=False)
            ansatz_fb = RealAmplitudes(1, reps=1, entanglement='linear', insert_barriers=False)
            optimizer_fb = COBYLA(maxiter=25)
            
            vqc = VQC(
                sampler=Sampler(),
                feature_map=feature_map_fb,
                ansatz=ansatz_fb,
                optimizer=optimizer_fb
            )
            
            vqc.fit(X_train_fb, y_train)
            y_pred = vqc.predict(X_test_fb)
            
        else:
            logging.error(f"Unhandled VQC Exception: {e}", exc_info=True)
            raise e
    
    metrics = _calculate_metrics(y_test, y_pred)
    logging.info(f"⚛️  VVQC Accuracy: {metrics['accuracy']:.4f}")
    
    return metrics