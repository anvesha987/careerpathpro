import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const careerService = {
  /**
   * Get all available careers
   * @param {Object} filters - Optional filters (industry, salaryRange, etc.)
   * @returns {Promise<Array>} - Array of career objects
   */
  async getAllCareers(filters = {}) {
    try {
      const response = await axios.get(`${API_URL}/careers`, {
        params: filters,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch careers');
    }
  },

  /**
   * Search careers by keyword
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Array>} - Array of matching careers
   */
  async searchCareers(query, filters = {}) {
    try {
      const response = await axios.get(`${API_URL}/careers/search`, {
        params: { q: query, ...filters },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to search careers');
    }
  },

  /**
   * Get career details by ID
   * @param {string} careerId - Career ID
   * @returns {Promise<Object>} - Complete career details
   */
  async getCareerDetails(careerId) {
    try {
      const response = await axios.get(`${API_URL}/careers/${careerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch career details');
    }
  },

  /**
   * Compare multiple careers
   * @param {Array} careerIds - Array of career IDs to compare
   * @returns {Promise<Object>} - Comparison data
   */
  async compareCareers(careerIds) {
    try {
      const response = await axios.post(
        `${API_URL}/careers/compare`,
        { careerIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to compare careers');
    }
  },

  /**
   * Get related careers
   * @param {string} careerId - Career ID to find related careers for
   * @returns {Promise<Array>} - Array of related careers
   */
  async getRelatedCareers(careerId) {
    try {
      const response = await axios.get(`${API_URL}/careers/${careerId}/related`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch related careers');
    }
  },

  /**
   * Save career to user's favorites
   * @param {string} userId - User ID
   * @param {string} careerId - Career ID to save
   * @returns {Promise<Object>} - Updated favorites list
   */
  async saveCareerToFavorites(userId, careerId) {
    try {
      const response = await axios.post(
        `${API_URL}/users/${userId}/favorites`,
        { careerId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to save career to favorites');
    }
  },

  /**
   * Get career growth statistics
   * @param {string} careerId - Career ID
   * @returns {Promise<Object>} - Growth data (projections, trends)
   */
  async getCareerGrowthStats(careerId) {
    try {
      const response = await axios.get(`${API_URL}/careers/${careerId}/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch career statistics');
    }
  },

  /**
   * Handle API errors consistently
   * @param {Error} error - The error object
   * @param {string} defaultMessage - Default error message
   * @throws {Error} - Error with proper message
   */
  handleError(error, defaultMessage) {
    console.error('Career Service Error:', error);
    
    let errorMessage = defaultMessage;
    if (error.response) {
      errorMessage = error.response.data?.message || 
                   error.response.data?.error || 
                   defaultMessage;
      
      if (error.response.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (error.response.status === 404) {
        errorMessage = 'Career not found';
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    throw new Error(errorMessage);
  }
};

export default careerService;