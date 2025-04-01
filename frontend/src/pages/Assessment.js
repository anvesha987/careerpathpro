import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAssessmentProgress, submitAssessment } from '../services/assessmentService';
import AssessmentProgress from './AssessmentProgress';
import Tooltip from './Tooltip';
import './Assessment.css';

const Assessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const questions = [
    {
      id: 'work_environment',
      question: 'What type of work environment do you prefer?',
      type: 'radio',
      options: [
        { value: 'structured', label: 'Structured and predictable' },
        { value: 'creative', label: 'Creative and flexible' },
        { value: 'fast_paced', label: 'Fast-paced and dynamic' },
        { value: 'independent', label: 'Independent and self-directed' }
      ],
      tooltip: 'This helps us recommend careers that match your preferred work style'
    },
    // More questions...
  ];

  useEffect(() => {
    // Load saved progress
    const savedProgress = localStorage.getItem('assessmentProgress');
    if (savedProgress) {
      setAnswers(JSON.parse(savedProgress));
    }
  }, []);

  const handleAnswerChange = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    saveProgress(newAnswers);
  };

  const saveProgress = async (answers) => {
    try {
      localStorage.setItem('assessmentProgress', JSON.stringify(answers));
      await saveAssessmentProgress(answers);
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await submitAssessment(answers);
      localStorage.removeItem('assessmentProgress');
      navigate('/dashboard', { state: { assessmentResult: result } });
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'radio':
        return (
          <div className="question-group">
            <h3>
              {question.question}
              {question.tooltip && <Tooltip content={question.tooltip} />}
            </h3>
            <div className="options">
              {question.options.map(option => (
                <label key={option.value} className="option">
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onChange={() => handleAnswerChange(question.id, option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        );
      // Handle other question types...
    }
  };

  return (
    <div className="assessment-container">
      <AssessmentProgress 
        current={currentStep + 1} 
        total={questions.length} 
      />
      
      <div className="assessment-card">
        {renderQuestion(questions[currentStep])}
        
        <div className="navigation-buttons">
          {currentStep > 0 && (
            <button 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="btn-secondary"
            >
              Previous
            </button>
          )}
          
          {currentStep < questions.length - 1 ? (
            <button 
              onClick={() => setCurrentStep(currentStep + 1)}
              className="btn-primary"
              disabled={!answers[questions[currentStep].id]}
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          )}
        </div>
        
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Assessment;