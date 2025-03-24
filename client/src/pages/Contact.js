import React from "react";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
import Layout from "./../components/Layout";

const Contact = () => {
  return (
    <Layout title={"Contact Us"}>
      <div className="row contactus">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            For any queries, feel free to contact us via the methods below. We are available 24/7.
          </p>
          <p className="mt-3" data-testid="MailSend">
            <BiMailSend /> : contact@virtualvault.com
          </p>
          <p className="mt-3" data-testid="PhoneCall">
            <BiPhoneCall /> : +65 6246 7050
          </p>
          <p className="mt-3" data-testid="Support">
            <BiSupport /> : 1800-6565-6565 (toll-free)
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
