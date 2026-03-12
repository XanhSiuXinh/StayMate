import { useState, useEffect, useCallback } from 'react';
import { authApiRequest } from '../utils/apiHelpers';

export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await authApiRequest(endpoint, options);
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  useEffect(() => {
    if (endpoint) {
      fetchData();
    }
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useMutation = (endpoint, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authApiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options
      });
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  return { mutate, loading, error };
};
