import "./Homepage.css";
import { useNavigate, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { IoListSharp } from "react-icons/io5";
// import { TfiPencilAlt } from "react-icons/tfi";
// import { MdOutlineDashboard } from "react-icons/md";

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const isWideScreen = windowWidth > 850;
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    //checks if click is not on sidebar
    if (sidebar && !isWideScreen && !document.querySelector(".sidebar-menu").contains(event.target) && !document.querySelector(".sidebar-icons").contains(event.target)) {
      setSidebar(false);
    }
  };

  useEffect(() => {
    if (!isWideScreen) {
      if (sidebar && !isWideScreen) {
        document.addEventListener("mousedown", handleClickOutside);
      } else if (!isWideScreen) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
    // eslint-disable-next-line
  }, [sidebar]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isWideScreen ? (
        <>
          <nav className="navbar-wideScreen">
            <div className="logo" onClick={() => navigate(`/dashboard`)} style={{ marginLeft: "30px" }}>
              {" "}
              RoboSensy
            </div>
            <ul className="nav-links" style={{ marginRight: "50px" }}>
              <li>
                <Link to="/project">Home</Link>
              </li>
              <li>
                <Link to="/project">Services</Link>
              </li>
              <li>
                <Link to="/project">Demo</Link>
              </li>
              <li>
                <Link to="/project">Blog</Link>
              </li>
              <li>
                <Link to="/project">Contact</Link>
              </li>
              <li onClick={() => navigate("/login")}>
                <Link>SignIn/LogIn</Link>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <>
          <div style={{ maxWidth: "100vw" }}>
            <div className="navbar">
              <Link to="#" className="sidebar-icons">
                <FaBars onClick={showSidebar} />
              </Link>
            </div>
            <nav className={sidebar ? "sidebar-menu active" : "sidebar-menu"}>
              <ul className="sidebar-menu-items" onClick={showSidebar}>
                <li className="sidebar-toggle">
                  <Link to="#" className="sidebar-icons">
                    <IoMdClose style={{ color: "black" }} />
                  </Link>
                </li>
                <li className="list-items">
                  <Link to="#">
                    <IoListSharp style={{ color: "black" }} />
                    <span className="custom-span" style={{ color: "black" }}>
                      Home
                    </span>
                  </Link>
                </li>
                <li className="list-items">
                  <Link to="#">
                    <IoListSharp style={{ color: "black" }} />
                    <span className="custom-span" style={{ color: "black" }}>
                      Services
                    </span>
                  </Link>
                </li>
                <li className="list-items">
                  <Link to="#">
                    <IoListSharp style={{ color: "black" }} />
                    <span className="custom-span" style={{ color: "black" }}>
                      Demo
                    </span>
                  </Link>
                </li>
                <li className="list-items">
                  <Link to="#">
                    <IoListSharp style={{ color: "black" }} />
                    <span className="custom-span" style={{ color: "black" }}>
                      Blog
                    </span>
                  </Link>
                </li>
                <li className="list-items">
                  <Link to="#">
                    <IoListSharp style={{ color: "black" }} />
                    <span className="custom-span" style={{ color: "black" }}>
                      Contact
                    </span>
                  </Link>
                </li>
                <li className="list-items" onClick={() => navigate("/login")}>
                  <Link to="#">
                    <CiLogout style={{ color: "black" }} />
                    <span className="custom-span" style={{ color: "black" }}>
                      SignIn/LogIn
                    </span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
