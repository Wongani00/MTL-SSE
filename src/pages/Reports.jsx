import React from "react";
import { Helmet } from "react-helmet";
import CompanyLog from "../assets/mtl-logo-75.png";

const Reports = () => {
  return (
    <div>
      <Helmet>
        <title>MTL SSE - Reports</title>
        <meta name="description" content="Reports for MTL SSE progress" />
        <meta property="og:title" content="MTL SSE | Reports" />
      </Helmet>
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative p-4">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${CompanyLog})` }}
        ></div>
        <h1 className="text-5xl md:text-7xl text-white font-bold mb-8 z-10">
          Coming Soon
        </h1>
        <p className="text-white text-xl font-semibold md:text-2xl">
          An important development is on the horizon. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default Reports;
