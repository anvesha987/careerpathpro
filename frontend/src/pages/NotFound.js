import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './styles/pages/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <Helmet>
        <title>Page Not Found | CareerPathPro</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Helmet>
      
      <div className="not-found-content">
        <div className="error-graphic">
          <div className="error-number">
            <span className="digit">4</span>
            <span className="digit">0</span>
            <span className="digit">4</span>
          </div>
          <div className="error-illustration">
            <div className="planet"></div>
            <div className="rocket">
              <i className="fas fa-rocket"></i>
            </div>
          </div>
        </div>

        <h1>Lost in Space?</h1>
        <p className="error-message">
          The page you're looking for doesn't exist or has been moved.
          <br />
          Don't worry, we'll help you get back on track!
        </p>

        <div className="action-buttons">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-secondary"
          >
            <i className="fas fa-arrow-left"></i> Go Back
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-primary"
          >
            <i className="fas fa-home"></i> Return Home
          </button>
        </div>

        <div className="search-suggestion">
          <p>Or try searching for what you need:</p>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search CareerPathPro..." 
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/search?q=${e.target.value}`);
                }
              }}
            />
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;