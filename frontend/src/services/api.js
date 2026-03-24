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
