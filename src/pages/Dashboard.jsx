import React from "react";
import { Helmet } from "react-helmet";

const Dashboard = () => {
  return (
    <div>
      <Helmet>
        <title>MTL SSE | Dashboard</title>
        <meta
          name="description"
          content="Dashboard - Overview of key metrics and recent activity."
        />
        <meta property="og:title" content="Dashboard" />
      </Helmet>
    </div>
  );
};

export default Dashboard;
