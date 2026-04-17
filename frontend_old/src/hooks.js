import { useState, useCallback } from 'react';
import { endpoints } from './api';

export const useAnalyze = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingTime, setProcessingTime] = useState(0);

  const analyze = useCallback(async (input) => {
    if (!input) return;
    
    setLoading(true);
    setError(null);
    const start = performance.now();
    
    try {
      const response = await endpoints.analyze(input);
      setData(response.data);
      setProcessingTime(performance.now() - start);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.response?.data?.detail || 'Analysis failed. Please check the backend connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, analyze, processingTime };
};
