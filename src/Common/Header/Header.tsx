import "./Header.scss";
import { useEffect, useState } from "react";
import logo  from "../../logo.svg";
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

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

          <div className="header-main_inner__right">
            {/* <Select
              defaultValue="lucy"
              style={{
                width: 122,
              }}
              className="cmnSelect"
              onChange={handleChange}
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
              ]}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
