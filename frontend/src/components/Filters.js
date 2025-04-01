import React from 'react';
import './styles/components/Filters.css';

const Filters = ({ filters, onChange }) => {
  const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Creative Arts'];
  const salaryRanges = ['Entry Level', 'Mid Level', 'Senior Level'];
  const educationLevels = ['High School', 'Associate', 'Bachelor', 'Master', 'PhD'];

  const handleChange = (e) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="filters-panel">
      <h3>Filters</h3>
      
      <div className="filter-group">
        <label>Industry</label>
        <select 
          name="industry" 
          value={filters.industry} 
          onChange={handleChange}
        >
          <option value="">All Industries</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Salary Range</label>
        <select 
          name="salaryRange" 
          value={filters.salaryRange} 
          onChange={handleChange}
        >
          <option value="">All Ranges</option>
          {salaryRanges.map(range => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Education Level</label>
        <select 
          name="educationLevel" 
          value={filters.educationLevel} 
          onChange={handleChange}
        >
          <option value="">All Levels</option>
          {educationLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;