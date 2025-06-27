import { Col, Row } from "antd";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Logo,
  Telegram,
  Twitter,
  Uparrow,
} from "../assets/StoreAsset/StoreAsset";
import "./Footer.scss";
import GitGub from "../assets/github.png";
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section
      // // style={{ display: pathname === Routes.HOME && "block" }}
      // className={`footer`}
      className="footernew"
    >
      <div className="container">
        <div className="footernew_topFooterItem">
          <div className="footernew_topFooterItem_socialIcon">
            <Link to="https://x.com/qubetics?mx=2" target="_blank">
              <Twitter />
            </Link>
            <Link to="https://www.facebook.com/" target="_blank">
              <Facebook />
            </Link>
            <Link to="https://t.me/qubetics" target="_blank">
              <Telegram />
            </Link>
            <Link to="https://www.instagram.com/qubetics/#" target="_blank">
              <Instagram />
            </Link>
            <Link to="https://github.com/Qubetics" target="_blank">
              <img
                src={GitGub}
                height={16}
                width={16}
                alt="logo"
                className="githubIcon"
              />
            </Link>
          </div>
          <div
            className="footernew_topFooterItem_backTopTop"
            onClick={scrollToTop}
          >
            <span className="rotateIcon">
              <Uparrow />
            </span>
            <p>Back to Top</p>
          </div>
          {/* <Commonbtn
          className="footernew_topFooterItem_backTopTop"
          text="Back to Top"
          onClick={scrollToTop}
          Lefticon={[<Uparrow />]}
        /> */}
        </div>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} lg={12}>
            <h2>
              {" "}
              <Logo />
              Powered By {process.env.REACT_APP_PROJECT_NAME ?? ""}
            </h2>
            <p>
              Build without limits. {process.env.REACT_APP_PROJECT_NAME ?? ""} combines the interoperability of the
              Cosmos, development power of EVM and WASM.
            </p>
            {/* <Image src="/map.png" height={150} width={300} alt="logo" /> */}
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <h3>About Us</h3>
            <Link to="" target="">
              Privacy Policy
            </Link>
            <Link to="" target="">
              Terms of Service
            </Link>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <h3>Product & Services</h3>
            <Link to="" target="_blank">
              {process.env.REACT_APP_PROJECT_NAME ?? ""} Validator App
            </Link>
            <Link to="" target="_blank">
              {process.env.REACT_APP_PROJECT_NAME ?? ""} Delegator App
            </Link>
            <Link to="" target="_blank">
              {" "}
              {process.env.REACT_APP_PROJECT_NAME ?? ""} DEX
            </Link>
            <Link to="" target="_blank">
              {" "}
              {process.env.REACT_APP_PROJECT_NAME ?? ""} App
            </Link>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <h3>Resources</h3>
            <Link to="" target="_blank">
              Official web
            </Link>
            <Link to="https://docs.qubetics.com/" target="_blank">
              {process.env.REACT_APP_PROJECT_NAME ?? ""} Network documentation
            </Link>
            <Link to="" target="_blank">
              {process.env.REACT_APP_PROJECT_NAME ?? ""} documentation
            </Link>
            <Link to="" target="_blank">
              {process.env.REACT_APP_PROJECT_NAME ?? ""} IDE
            </Link>
          </Col>
        </Row>
        <p className="footernew_year">
          {/* © 2024 {EXPLORER_CHAIN_NAME}. All Rights Reserved. */}
          © 2025 Copyright {process.env.REACT_APP_PROJECT_NAME ?? ""}
        </p>
      </div>
    </section>
  );
};

export default Footer;
