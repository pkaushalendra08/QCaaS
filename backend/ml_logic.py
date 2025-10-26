"""
TEMPORARY TEST VERSION - Uses sklearn built-in datasets
Replace with CSV version once data files are ready
"""

import numpy as np
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)

# Qiskit imports
from qiskit.primitives import Sampler
from qiskit.circuit.library import ZZFeatureMap, RealAmplitudes
from qiskit_machine_learning.algorithms import VQC
from qiskit.algorithms.optimizers import COBYLA

# Constants
NUM_QUBITS = 2  # Reduced for speed
TEST_SIZE = 0.2
RANDOM_STATE = 42


def run_comparison_pipeline(dataset_name):
    """Main pipeline"""
    print(f"\n{'='*70}")
    print(f"STARTING: {dataset_name}")
    print(f"{'='*70}\n")
    
    X, y = _load_and_prepare_data(dataset_name)
    
    print(f"\n{'='*70}")
    print("PHASE 1: SVM")
    print(f"{'='*70}")
    svm_metrics = _run_svm(X, y)
    
    print(f"\n{'='*70}")
    print("PHASE 2: VQC")
    print(f"{'='*70}")
    vqc_metrics = _run_vqc(X, y)
    
    return svm_metrics, vqc_metrics


def _load_and_prepare_data(dataset_name):
    """Load built-in sklearn datasets"""
    print(f"[LOADING] {dataset_name}")
    
    # Map to sklearn datasets
    loaders = {
        'iris': datasets.load_iris,
        'wine': datasets.load_wine,
        'breast_cancer': datasets.load_breast_cancer,
        'diabetes': datasets.load_diabetes,  # Regression dataset
        'heart': datasets.load_breast_cancer,  # Using breast_cancer as substitute
        'stroke': datasets.load_wine,  # Using wine as substitute
        'water_potability': datasets.load_iris  # Using iris as substitute
    }
    
    if dataset_name not in loaders:
        raise ValueError(f"Unknown dataset: {dataset_name}")
    
    # Load dataset
    dataset = loaders[dataset_name]()
    X = dataset.data
    y = dataset.target
    
    # For diabetes (regression), convert to binary
    if dataset_name == 'diabetes':
        y = (y > np.median(y)).astype(int)
    
    print(f"[OK] Loaded {len(X)} samples, {X.shape[1]} features, {len(np.unique(y))} classes")
    
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
    print("[SVM] Preprocessing...")
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_original)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    
    print(f"[SVM] Training on {len(X_train)} samples...")
    svm = SVC(kernel='rbf', C=1.0, gamma='scale', random_state=RANDOM_STATE)
    svm.fit(X_train, y_train)
    
    y_pred = svm.predict(X_test)
    metrics = _calculate_metrics(y_test, y_pred)
    
    print(f"[SVM] Accuracy: {metrics['accuracy']:.4f}")
    return metrics


def _run_vqc(X_original, y):
    """Train VQC"""
    print("[VQC] Preprocessing...")
    
    # PCA to 2 features (faster)
    pca = PCA(n_components=NUM_QUBITS)
    X_reduced = pca.fit_transform(X_original)
    print(f"[VQC] PCA: {X_original.shape[1]} → {NUM_QUBITS} features")
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_reduced)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    
    print(f"[VQC] Configuring quantum circuit (2 qubits)...")
    
    feature_map = ZZFeatureMap(feature_dimension=NUM_QUBITS, reps=1)
    ansatz = RealAmplitudes(num_qubits=NUM_QUBITS, reps=1)
    sampler = Sampler()
    optimizer = COBYLA(maxiter=50)
    
    vqc = VQC(
        sampler=sampler,
        feature_map=feature_map,
        ansatz=ansatz,
        optimizer=optimizer
    )
    
    print(f"[VQC] Training (15-30 seconds)...")
    vqc.fit(X_train, y_train)
    
    y_pred = vqc.predict(X_test)
    metrics = _calculate_metrics(y_test, y_pred)
    
    print(f"[VQC] Accuracy: {metrics['accuracy']:.4f}")
    return metrics
