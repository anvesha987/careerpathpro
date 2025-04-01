import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CareerRecommendations.css';

const CareerRecommendations = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    salaryRange: '',
    experienceLevel: '',
    industry: ''
  });

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${userId}/recommendations`, {
          params: filters
        });
        setRecommendations(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading career recommendations...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  return (
    <div className="career-recommendations">
      <div className="recommendations-header">
        <h2>Career Recommendations</h2>
        <div className="filters">
          <select 
            name="salaryRange" 
            value={filters.salaryRange}
            onChange={handleFilterChange}
          >
            <option value="">All Salary Ranges</option>
            <option value="entry">Entry Level ($30k-$60k)</option>
            <option value="mid">Mid Level ($60k-$100k)</option>
            <option value="senior">Senior Level ($100k+)</option>
          </select>
          
          <select 
            name="experienceLevel" 
            value={filters.experienceLevel}
            onChange={handleFilterChange}
          >
            <option value="">All Experience Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level (2-5 years)</option>
            <option value="senior">Senior (5+ years)</option>
          </select>
          
          <select 
            name="industry" 
            value={filters.industry}
            onChange={handleFilterChange}
          >
            <option value="">All Industries</option>
            <option value="tech">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="education">Education</option>
          </select>
        </div>
      </div>
      
      {recommendations.length === 0 ? (
        <div className="no-results">
          <p>No career recommendations match your current filters.</p>
          <button onClick={() => setFilters({
            salaryRange: '',
            experienceLevel: '',
            industry: ''
          })}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map((career) => (
            <div key={career.id} className="career-card">
              <div className="card-header">
                <h3>{career.title}</h3>
                <span className="match-score">{career.matchScore}% Match</span>
              </div>
              <div className="card-body">
                <p className="industry">{career.industry}</p>
                <p className="salary">Avg. Salary: {career.salaryRange}</p>
                <p className="description">{career.description}</p>
                
                <div className="skills-section">
                  <h4>Key Skills Needed:</h4>
                  <div className="skills-list">
                    {career.requiredSkills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="growth-info">
                  <p>
                    <i className="fas fa-chart-line"></i> 
                    Projected Growth: {career.growthOutlook}
                  </p>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn-outline">Save for Later</button>
                <button className="btn-primary">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerRecommendations;