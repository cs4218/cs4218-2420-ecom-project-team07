import React from "react";
import { Link } from "react-router-dom";
import Layout from "./../components/Layout";

const Pagenotfound = () => {
  return (
    <Layout title={"404 - Page Not Found"}>
      <div className="pnf">
        <h1 className="pnf-title">404</h1>
        <h2 className="pnf-heading">Oops! Page Not Found</h2>
        <Link to="/" className="pnf-btn">
          Return to Homepage
        </Link>
      </div>
    </Layout>
  );
};

export default Pagenotfound;
