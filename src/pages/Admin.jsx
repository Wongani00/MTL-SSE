import React from "react";
import { Helmet } from "react-helmet";

const Admin = () => {
  return (
    <div>
      <Helmet>
        <title>MTL SSE | Admin Panel</title>
        <meta
          name="description"
          content="Admin Panel - Management of application settings and users."
        />
        <meta property="og:title" content="Admin Panel" />
      </Helmet>
    </div>
  );
};

export default Admin;
