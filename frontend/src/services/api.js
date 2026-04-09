/**
 * API Service
 * Handles all backend API calls for contract evaluations
 */

const API_BASE_URL = '/api';

/**
 * Fetch available vendors (with current evaluation status)
 * Endpoint: GET /vendors
 */
export const fetchVendors = async () => {
    const response = await fetch(`${API_BASE_URL}/vendors`);
    if (!response.ok) {
        throw new Error('Failed to fetch vendors');
    }
    const data = await response.json();
    return data.vendors || [];
};

/**
 * Evaluate a specific sample contract by name
 * Endpoint: POST /evaluate-sample/{name}
 */
export const evaluateSample = async (sampleName) => {
    const response = await fetch(`${API_BASE_URL}/evaluate-sample/${sampleName}`, {
        method: 'POST'
    });
    if (!response.ok) {
        throw new Error(`Failed to evaluate vendor: ${sampleName}`);
    }
    return await response.json();
};

/**
 * Check API health
 * Endpoint: GET /health
 */
export const checkHealth = async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
        throw new Error('API health check failed');
    }
    return await response.json();
};

/**
 * Register a new user
 * Endpoint: POST /auth/register
 */
export const register = async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
    }
    return await response.json();
};

/**
 * Login an existing user
 * Endpoint: POST /auth/login
 */
export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
    }
    return await response.json();
};

/**
 * Update the active data source for the system
 * Endpoint: POST /config/data-source
 */
export const updateDataSource = async (sourceType, mongoUri, dbName) => {
    const response = await fetch(`${API_BASE_URL}/config/data-source`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            source_type: sourceType,
            mongo_uri: mongoUri,
            db_name: dbName
        })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update data source configuration');
    }
    return await response.json();
};
