import { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';

const useFetchData = (baseUrl, local, local2, local3, local4, local5, local6, local7) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${baseUrl}?local=${encodeURIComponent(local)}&local2=${encodeURIComponent(local2)}&local3=${encodeURIComponent(local3)}&local4=${encodeURIComponent(local4)}&local5=${encodeURIComponent(local5)}&local6=${encodeURIComponent(local6)}&local7=${encodeURIComponent(local7)}`;
      console.log(`Fetching data from: ${url}`);
      const response = await Axios.get(url);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, local, local2, local3, local4, local5, local6, local7]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchData;
