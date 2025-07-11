import "./Header.scss";
import { Button } from "antd";
import logo from "../../logo.svg";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import CommonModal from "../commonModal/CommonModal";
import { CopyIcon } from "../assets/StoreAsset/StoreAsset";
import { copyToClipBoard, formatString } from "../Utility";
import { UserContext } from "../../Context/store";

function Header() {
  const navigate = useNavigate();
  const { walletAddress, setWalletAddress, setWallet } = useContext(UserContext);
  const [address, setAddress] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showLogoutModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleLogout = async () => {
    localStorage.clear();
    setWalletAddress("")
    setWallet("false")
    navigate("/");
    handleModalClose();
  };

  useEffect(() => {
    if (window !== undefined) {

      const handleScroll = () => {
        setScrolled(window.scrollY > 100);
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      setAddress(walletAddress ?? "");

    } else {
      const address = localStorage.getItem("wltAddress");
      setAddress(address ?? "");
    }
  }, [walletAddress]);

  return (
    <div className={`header-main ${scrolled ? "sticky" : ""}`} id="foo">
      <div className="container">
        <div className="header-main_inner">
          <div className="header-main_inner__left">
            <div className="svgLogo" onClick={(() => { navigate("/") })}>
              <img src={logo} alt="" />
              <h3> {process.env.REACT_APP_PROJECT_NAME ?? ""} - Governance Portal</h3>
            </div>
          </div>
          {
            address &&
            <div className="header-main_inner__right">
              <button
                color="primary"
                className="headermetaBtn"
              >
                <div className="copyBtns">
                  {formatString(address)}
                  <text
                    className="copy-btn"
                    style={{ cursor: "pointer", zIndex: "9999" }}
                  >
                    <span
                      className="pointer"
                      onClick={() => copyToClipBoard(address)}
                    >
                      <CopyIcon />
                    </span>
                  </text>
                </div>
              </button>


              <Button className="btns headermetaBtn" onClick={showLogoutModal}>
                <div
                  style={{ zIndex: "99999" }}
                >
                  Logout
                </div>
              </Button>

              <CommonModal
                customClass="logOut"
                visible={isModalVisible}
                onClose={handleModalClose}
                title="LOGOUT"
                content={
                  <div className="logout-modal-content">
                    <p>Do you want to logout?</p>
                    <div className="modal-buttons">
                      <button className="headermetaBtn" onClick={handleLogout}>Yes</button>
                      <button className="headermetaBtn noBtn" onClick={handleModalClose}>No</button>
                    </div>
                  </div>
                }
              />

            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default Header;
