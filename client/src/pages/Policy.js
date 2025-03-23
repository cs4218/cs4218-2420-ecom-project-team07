import React from "react";
import Layout from "./../components/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p>First Policy: </p>
          <p>Second Policy: </p>
          <p>Third Policy: </p>
          <p>Fourth Policy: </p>
          <p>Fifth Policy: </p>
          <p>Sixth Policy: </p>
          <p>Seventh Policy: </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;