import { Navigate, Outlet } from "react-router-dom";

import React from "react";
import { useSelector } from "react-redux";

const Auth = () => {
  const user = useSelector((state) => state.user);

  return user.email ? <Outlet /> : <Navigate to="/signup" />;
};

export default Auth;
