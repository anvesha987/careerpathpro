import React, { useState, useEffect } from 'react';
import { getAllCareers, searchCareers } from '../services/careerService';
import CareerCard from './CareerCard';
import Filters from './Filters';
import SearchBar from './SearchBar';
import LoadingSpinner from './LoadingSpinner';
import './CareerExplorer.css';

const CareerExplorer = () => {
  const [careers, setCareers] = useState([]);
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    industry: '',
    salaryRange: '',
    educationLevel: '',
    experienceLevel: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setLoading(true);
        const data = await getAllCareers();
        setCareers(data);
        setFilteredCareers(data);
      } catch (err) {
        setError(err.message || 'Failed to load careers');
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let results = [...careers];
      
      // Apply search term
      if (searchTerm) {
        results = results.filter(career =>
          career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          career.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply filters
      if (filters.industry) {
        results = results.filter(career => career.industry === filters.industry);
      }
      
      if (filters.salaryRange) {
        results = results.filter(career => career.salaryRange === filters.salaryRange);
      }
      
      if (filters.educationLevel) {
        results = results.filter(career => 
          career.requiredEducation.includes(filters.educationLevel)
        );
      }
      
      if (filters.experienceLevel) {
        results = results.filter(career => 
          career.experienceLevel === filters.experienceLevel
        );
      }
      
      setFilteredCareers(results);
    };

    applyFilters();
  }, [careers, filters, searchTerm]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="career-explorer">
      <div className="explorer-header">
        <h2>Explore Career Paths</h2>
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="explorer-content">
        <div className="filters-sidebar">
          <Filters 
            filters={filters}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="careers-list">
          {filteredCareers.length === 0 ? (
            <div className="no-results">
              <p>No careers match your current filters.</p>
              <button 
                onClick={() => {
                  setFilters({
                    industry: '',
                    salaryRange: '',
                    educationLevel: '',
                    experienceLevel: ''
                  });
                  setSearchTerm('');
                }}
                className="btn-clear"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredCareers.map(career => (
              <CareerCard 
                key={career.id}
                career={career}
                showDetails={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerExplorer;