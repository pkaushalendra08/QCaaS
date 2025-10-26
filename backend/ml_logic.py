"""
QCaaS ML Logic - Machine Learning Operations
Handles data loading, preprocessing, SVM training, and VQC training
Supports: iris, stroke, water_potability, heart, diabetes
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
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
NUM_QUBITS = 4
TEST_SIZE = 0.2
RANDOM_STATE = 42
VQC_REPS = 1  
VQC_MAXITER = 100  


def run_comparison_pipeline(dataset_name):
    """
    Main pipeline - orchestrates the entire comparison process
    
    Args:
        dataset_name (str): Name of the dataset to load
    
    Returns:
        tuple: (svm_metrics, vqc_metrics)
    """
    print(f"\n{'='*70}")
    print(f"STARTING COMPARISON PIPELINE: {dataset_name.upper()}")
    print(f"{'='*70}\n")
    
    # Load and prepare data from CSV
    X, y = _load_and_prepare_data(dataset_name)
    
    # Run classical SVM
    print(f"\n{'='*70}")
    print("PHASE 1: CLASSICAL SVM")
    print(f"{'='*70}")
    svm_metrics = _run_svm(X, y)
    
    # Run quantum VQC
    print(f"\n{'='*70}")
    print("PHASE 2: QUANTUM VQC")
    print(f"{'='*70}")
    vqc_metrics = _run_vqc(X, y)
    
    return svm_metrics, vqc_metrics


def _load_and_prepare_data(dataset_name):
    """
    Load CSV data and perform preprocessing
    
    Args:
        dataset_name (str): Name of the dataset
    
    Returns:
        tuple: (X, y) - features and labels as numpy arrays
    
    Raises:
        FileNotFoundError: If CSV file doesn't exist
        ValueError: If data format is invalid
    """
    print(f"[LOADING] Dataset: {dataset_name}")
    
    # Dataset configuration: (filename, target_column)
    dataset_config = {
        'iris': ('iris.csv', 'species'),
        'heart': ('heart.csv', 'target'),
        'diabetes': ('diabetes.csv', 'Outcome'),
        'stroke': ('stroke.csv', 'stroke'),
        'water_potability': ('water_potability.csv', 'Potability')
    }
    
    if dataset_name not in dataset_config:
        raise ValueError(
            f"Unknown dataset: {dataset_name}. "
            f"Valid options: {list(dataset_config.keys())}"
        )
    
    filename, target_column = dataset_config[dataset_name]
    filepath = f'data/{filename}'
    
    # Load CSV with optimizations
    try:
        df = pd.read_csv(filepath, low_memory=False)
        print(f"[OK] Loaded {len(df)} rows from {filepath}")
    except FileNotFoundError:
        raise FileNotFoundError(
            f"CSV file not found: {filepath}\n"
            f"Please add {filename} to the backend/data/ directory"
        )
    
    # Data cleaning
    initial_size = len(df)
    
    # Drop rows with missing values in target column
    if target_column in df.columns:
        df = df.dropna(subset=[target_column])
    
    # For remaining columns, fill numeric with median
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
    
    # Drop any remaining rows with NaN
    df = df.dropna()
    
    dropped = initial_size - len(df)
    if dropped > 0:
        print(f"[CLEAN] Processed {dropped} rows with missing values")
    
    # Validate target column exists
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' not found in {filename}")
    
    # Separate features and target
    y = df[target_column].values
    X_df = df.drop(columns=[target_column])
    
    # Encode categorical features
    categorical_cols = X_df.select_dtypes(include=['object']).columns
    if len(categorical_cols) > 0:
        print(f"[ENCODING] Converting {len(categorical_cols)} categorical features to numeric")
        for col in categorical_cols:
            X_df[col] = LabelEncoder().fit_transform(X_df[col].astype(str))
    
    X = X_df.values
    
    # Encode categorical target
    if y.dtype == object or isinstance(y[0], str):
        print(f"[ENCODING] Converting categorical target to numeric")
        label_encoder = LabelEncoder()
        y = label_encoder.fit_transform(y)
        print(f"[OK] Encoded {len(label_encoder.classes_)} classes: {label_encoder.classes_}")
    
    # Convert to proper types
    X = X.astype(np.float64)
    y = y.astype(np.int64)
    
    # Data summary
    print(f"\n[DATA SUMMARY]")
    print(f"  Samples: {X.shape[0]}")
    print(f"  Features: {X.shape[1]}")
    print(f"  Classes: {len(np.unique(y))}")
    print(f"  Class distribution: {dict(zip(*np.unique(y, return_counts=True)))}")
    
    return X, y


def _calculate_metrics(y_true, y_pred):
    """
    Calculate classification metrics
    
    Args:
        y_true: True labels
        y_pred: Predicted labels
    
    Returns:
        dict: Metrics dictionary with accuracy, precision, recall, f1_score
    """
    metrics = {
        'accuracy': round(float(accuracy_score(y_true, y_pred)), 4),
        'precision': round(float(precision_score(y_true, y_pred, average='weighted', zero_division=0)), 4),
        'recall': round(float(recall_score(y_true, y_pred, average='weighted', zero_division=0)), 4),
        'f1_score': round(float(f1_score(y_true, y_pred, average='weighted', zero_division=0)), 4)
    }
    return metrics


def _run_svm(X_original, y):
    """
    Train and evaluate classical SVM
    
    Args:
        X_original: Original feature matrix
        y: Target labels
    
    Returns:
        dict: SVM performance metrics
    """
    print("\n[SVM] Preprocessing data...")
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_original)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=y
    )
    
    print(f"[SVM] Data split: {len(X_train)} train | {len(X_test)} test")
    
    # Train SVM with RBF kernel
    print("[SVM] Training Support Vector Machine...")
    svm = SVC(kernel='rbf', C=1.0, gamma='scale', random_state=RANDOM_STATE)
    svm.fit(X_train, y_train)
    
    # Make predictions
    print("[SVM] Making predictions...")
    y_pred = svm.predict(X_test)
    
    # Calculate metrics
    metrics = _calculate_metrics(y_test, y_pred)
    
    # Display results
    print(f"\n[SVM RESULTS]")
    print(f"  ✓ Accuracy:  {metrics['accuracy']:.4f}")
    print(f"  ✓ Precision: {metrics['precision']:.4f}")
    print(f"  ✓ Recall:    {metrics['recall']:.4f}")
    print(f"  ✓ F1 Score:  {metrics['f1_score']:.4f}")
    
    return metrics


def _run_vqc(X_original, y):
    """
    Train and evaluate Variational Quantum Classifier
    OPTIMIZED: 4 qubits, reduced reps, faster convergence
    
    Args:
        X_original: Original feature matrix
        y: Target labels
    
    Returns:
        dict: VQC performance metrics
    """
    print("\n[VQC] Preprocessing data...")
    
    # Step 1: Dimensionality reduction with PCA
    pca = PCA(n_components=NUM_QUBITS)
    X_reduced = pca.fit_transform(X_original)
    
    explained_variance = pca.explained_variance_ratio_.sum()
    print(f"[VQC] PCA: {X_original.shape[1]} features → {NUM_QUBITS} features")
    print(f"[VQC] Explained variance: {explained_variance:.4f}")
    
    # Step 2: Scale reduced features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_reduced)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=y
    )
    
    print(f"[VQC] Data split: {len(X_train)} train | {len(X_test)} test")
    
    # Configure quantum circuit - OPTIMIZED
    print(f"\n[VQC] Quantum Circuit Configuration:")
    print(f"  • Qubits: {NUM_QUBITS}")
    print(f"  • Feature Map: ZZFeatureMap (reps={VQC_REPS}, entanglement='linear')")
    print(f"  • Ansatz: RealAmplitudes (reps={VQC_REPS}, entanglement='linear')")
    print(f"  • Optimizer: COBYLA (maxiter={VQC_MAXITER})")
    
    # Feature map - linear entanglement for speed
    feature_map = ZZFeatureMap(
        feature_dimension=NUM_QUBITS,
        reps=VQC_REPS,
        entanglement='linear'
    )
    
    # Ansatz - linear entanglement for speed
    ansatz = RealAmplitudes(
        num_qubits=NUM_QUBITS,
        reps=VQC_REPS,
        entanglement='linear'
    )
    
    # Sampler
    sampler = Sampler()
    
    # Optimizer - limited iterations for speed
    optimizer = COBYLA(maxiter=VQC_MAXITER)
    
    # Initialize VQC
    vqc = VQC(
        sampler=sampler,
        feature_map=feature_map,
        ansatz=ansatz,
        optimizer=optimizer
    )
    
    # Train VQC
    print(f"\n[VQC] ⚛️  Training quantum classifier...")
    print(f"[VQC] ⏱️  Estimated time: 20-40 seconds")
    vqc.fit(X_train, y_train)
    
    # Make predictions
    print("[VQC] 🔮 Making predictions...")
    y_pred = vqc.predict(X_test)
    
    # Calculate metrics
    metrics = _calculate_metrics(y_test, y_pred)
    
    # Display results
    print(f"\n[VQC RESULTS]")
    print(f"  ⚛️  Accuracy:  {metrics['accuracy']:.4f}")
    print(f"  ⚛️  Precision: {metrics['precision']:.4f}")
    print(f"  ⚛️  Recall:    {metrics['recall']:.4f}")
    print(f"  ⚛️  F1 Score:  {metrics['f1_score']:.4f}")
    
    return metrics
