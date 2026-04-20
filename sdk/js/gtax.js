/**
 * Global Tax API - JavaScript SDK (v1.0.0)
 * Lightweight compliance engine for Web & Node.js
 */
class GTaxClient {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || '/api';
  }

  async _request(endpoint, options = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'GTax API Request Failed');
    }

    return response.json();
  }

  /**
   * Simple Tax Rate Lookup
   * @param {string} country - ISO Alpha-2 country code
   * @param {string} [state] - US State code (required for US)
   */
  async lookupRate(country, state = null) {
    const query = new URLSearchParams({ country, ...(state && { state }) });
    return this._request(`/lookup?${query}`);
  }

  /**
   * Comprehensive Compliance Calculation
   * @param {Object} params - Calculation parameters
   */
  async calculate(params) {
    return this._request('/calculate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}

export default GTaxClient;
