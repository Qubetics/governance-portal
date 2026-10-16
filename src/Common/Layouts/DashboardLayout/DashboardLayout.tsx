import { Spin } from "antd";
import Footer from "../../Footer/Footer";
import Header from "../../Header/Header";
import { Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Loader from "../../Loader";
import SearchbarComponent from "../../SearchbarComponent/SearchbarComponent";

function DashboardLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
        // <div
        //   className="spinner-container"
        //   style={{
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     minHeight: "100vh",
        //     backdropFilter: "blur(12px)",
        //   }}
        // >
        //   <Spin size="large" />
        // </div>
      ) : (
        <div className="dashLayout">
          <div>
            <Header />
            <div className="addbgtheme" style={{ paddingTop: "110px" }}>
              {/* <SearchbarComponent /> */}
            </div>
          </div>

          <div className="dashLayout_container">
            <div className="dashLayout_body">
              <Outlet />
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

export default DashboardLayout;
