import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const assessmentService = {
  /**
   * Save assessment progress
   * @param {Object} answers - Current assessment answers
   * @param {string} userId - Current user ID
   * @returns {Promise<Object>} - Saved progress data
   */
  async saveProgress(answers, userId) {
    try {
      const response = await axios.post(
        `${API_URL}/assessments/progress`,
        { answers, userId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to save assessment progress');
    }
  },

  /**
   * Submit completed assessment
   * @param {Object} answers - Completed assessment answers
   * @param {string} userId - Current user ID
   * @returns {Promise<Object>} - Assessment results
   */
  async submitAssessment(answers, userId) {
    try {
      const response = await axios.post(
        `${API_URL}/assessments/submit`,
        { answers, userId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to submit assessment');
    }
  },

  /**
   * Get saved progress for a user
   * @param {string} userId - Current user ID
   * @returns {Promise<Object>} - Saved progress data
   */
  async getSavedProgress(userId) {
    try {
      const response = await axios.get(
        `${API_URL}/assessments/progress/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to load saved progress');
    }
  },

  /**
   * Get assessment questions
   * @returns {Promise<Array>} - Array of assessment questions
   */
  async getQuestions() {
    try {
      const response = await axios.get(`${API_URL}/assessments/questions`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to load assessment questions');
    }
  },

  /**
   * Handle API errors consistently
   * @param {Error} error - The error object
   * @param {string} defaultMessage - Default error message
   * @throws {Error} - Error with proper message
   */
  handleError(error, defaultMessage) {
    console.error('Assessment Service Error:', error);
    
    let errorMessage = defaultMessage;
    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data?.message || 
                    error.response.data?.error || 
                    defaultMessage;
      
      // Handle specific status codes
      if (error.response.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
        // Optionally trigger logout here
      } else if (error.response.status === 404) {
        errorMessage = 'Resource not found';
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'Network error. Please check your connection.';
    }
    
    throw new Error(errorMessage);
  }
};

export default assessmentService;