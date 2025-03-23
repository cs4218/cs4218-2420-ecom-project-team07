import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout";

const Categories = () => {
  const categories = useCategory();
  
  return (
    <Layout title={"All Categories"}>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center">All Categories</h1>
            <div className="row">
              {categories && categories.length > 0 ? (
                categories.map((c) => (
                  <div className="col-md-4 col-sm-6 mb-3 text-center" key={c._id}>
                    <Link 
                      to={`/category/${c.slug}`} 
                      className="btn btn-primary w-100"
                      style={{ 
                        height: '60px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        margin: '10px 0'
                      }}
                    >
                      {c.name}
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center w-100">No categories found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;