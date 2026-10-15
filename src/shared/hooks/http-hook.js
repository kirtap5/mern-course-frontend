import { useCallback, useRef, useState, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl,
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (e) {
        setError(e.message);
        setIsLoading(false);

        //throw error so the component using this hook has a chance of knowing something went wrong.
        throw e;
      }
    },
    [],
  );
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      //Ensure we don't continue with esisting request(s) if the component(s) using this hook unmounts
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);
  return { isLoading, error, sendRequest, clearError };
};
