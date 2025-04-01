import React from 'react';
import PropTypes from 'prop-types';
import './styles/components/CareerCard.css';

const CareerCard = ({ career, showDetails = false }) => {
  return (
    <div className="career-card">
      <div className="card-header">
        <h3>{career.title}</h3>
        {career.matchScore && (
          <span className="match-score">{career.matchScore}% Match</span>
        )}
      </div>
      <div className="card-body">
        <p className="industry">{career.industry}</p>
        <p className="salary">Avg. Salary: {career.salaryRange}</p>
        
        {showDetails && (
          <>
            <p className="description">{career.description}</p>
            <div className="skills-section">
              <h4>Key Skills Needed:</h4>
              <div className="skills-list">
                {career.requiredSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

CareerCard.propTypes = {
  career: PropTypes.object.isRequired,
  showDetails: PropTypes.bool
};

export default CareerCard;