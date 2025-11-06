import React from "react";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>MTL SSE | Home</title>
        <meta
          name="description"
          content="Welcome to the Home Page of our application."
        />
        <meta property="og:title" content="Home Page" />
      </Helmet>
    </div>
  );
};

export default Home;
