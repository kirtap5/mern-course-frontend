import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [userId, setUserId] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [token, setToken] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

    setTokenExpirationDate(tokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      }),
    );
  }, []);
  const logout = useCallback(() => {
    setUserId(null);
    setTokenExpirationDate(null);
    setToken(null);
    localStorage.removeItem("userData");
    clearTimeout(logoutTimer);
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration),
      );
    }
  }, [login]);
  return { token, login, logout, userId };
};
