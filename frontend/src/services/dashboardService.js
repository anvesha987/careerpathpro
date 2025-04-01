import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const dashboardService = {
  /**
   * Fetch dashboard summary data
   * @param {string} userId - Current user ID
   * @returns {Promise<Object>} - Dashboard summary data
   */
  async getDashboardSummary(userId) {
    try {
      const response = await axios.get(`${API_URL}/dashboard/summary/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to load dashboard summary');
    }
  },

  /**
   * Fetch career recommendations
   * @param {string} userId - Current user ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} - Array of career recommendations
   */
  async getCareerRecommendations(userId, filters = {}) {
    try {
      const response = await axios.get(`${API_URL}/dashboard/recommendations/${userId}`, {
        params: filters,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to load career recommendations');
    }
  },

  /**
   * Fetch skill gap analysis
   * @param {string} userId - Current user ID
   * @returns {Promise<Object>} - Skill gap analysis data
   */
  async getSkillGapAnalysis(userId) {
    try {
      const response = await axios.get(`${API_URL}/dashboard/skill-gaps/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to load skill gap analysis');
    }
  },

  /**
   * Fetch learning resources
   * @param {string} userId - Current user ID
   * @param {Array} skillIds - Array of skill IDs to get resources for
   * @returns {Promise<Array>} - Array of learning resources
   */
  async getLearningResources(userId, skillIds = []) {
    try {
      const response = await axios.post(
        `${API_URL}/dashboard/learning-resources/${userId}`,
        { skillIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to load learning resources');
    }
  },

  /**
   * Fetch career progress data
   * @param {string} userId - Current user ID
   * @returns {Promise<Object>} - Career progress data
   */
  async getCareerProgress(userId) {
    try {
      const response = await axios.get(`${API_URL}/dashboard/progress/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to load career progress');
    }
  },

  /**
   * Unified error handler
   * @param {Error} error - The error object
   * @param {string} defaultMessage - Default error message
   * @throws {Error} - Error with proper message
   */
  handleError(error, defaultMessage) {
    console.error('Dashboard Service Error:', error);
    
    let errorMessage = defaultMessage;
    if (error.response) {
      errorMessage = error.response.data?.message || 
                   error.response.data?.error || 
                   defaultMessage;
      
      if (error.response.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (error.response.status === 404) {
        errorMessage = 'Requested data not found';
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    throw new Error(errorMessage);
  }
};

export default dashboardService;