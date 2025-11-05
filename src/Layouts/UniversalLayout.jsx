import React from "react";
import BaseNav from "../components/BaseNav.jsx";
import { Outlet } from "react-router-dom";

const UniversalLayout = () => {
  return (
    <div>
      <BaseNav />
    </div>
  );
};

export default UniversalLayout;
