import React from "react";
import { Helmet } from "react-helmet";

const Projects = () => {
  return (
    <div>
      <Helmet>
        <title>MTL SSE | Projects</title>
        <meta
          name="description"
          content="Projects - Overview of all projects and their statuses."
        />
        <meta property="og:title" content="Projects" />
      </Helmet>
    </div>
  );
};

export default Projects;
