import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCareerRecommendations, getSkillGapAnalysis } from '../services/dashboardService';
import CareerRecommendations from '../components/CareerRecommendations';
import SkillGapAnalysis from '../components/SkillGapAnalysis';
import UserProfileCard from '../components/UserProfileCard';
import NextSteps from '../components/NextSteps';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get assessment results from location state if coming from assessment
        const assessmentResult = location.state?.assessmentResult;
        
        // Fetch recommendations and skill gaps in parallel
        const [recs, gaps] = await Promise.all([
          getCareerRecommendations(assessmentResult),
          getSkillGapAnalysis()
        ]);
        
        setRecommendations(recs);
        setSkillGaps(gaps);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

  const handleCareerSelect = (careerId) => {
    navigate(`/career/${careerId}`);
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Your Career Dashboard</h1>
      </div>
      
      <div className="dashboard-grid">
        <div className="profile-section">
          <UserProfileCard />
        </div>
        
        <div className="recommendations-section">
          <CareerRecommendations 
            recommendations={recommendations} 
            onSelect={handleCareerSelect}
          />
        </div>
        
        <div className="skill-gap-section">
          <SkillGapAnalysis 
            skills={skillGaps} 
            title="Your Skill Gap Analysis"
          />
        </div>
        
        <div className="next-steps-section">
          <NextSteps 
            recommendations={recommendations} 
            skillGaps={skillGaps}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;