import React from "react";
import "./Homepage.css";
import laptopImage from "./assets/laptopimage.png";
import robologo from "./assets/robosensy_logo.png";
import algologo from "./assets/algodive_logo.png";
import doctorImg from "./assets/Doctor_profile.png";
import Navbar from "./Navbar.homepage";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { ImLinkedin } from "react-icons/im";

const Homepage = () => {
  // const handleScrollToSection = (sectionId) => {
  //   const section = document.getElementById(sectionId);
  //   if (section) {
  //     section.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  const testimonials = [
    {
      name: "Dr Saira",
      text: "RoboSensy has revolutionized the way we manage our clinic. Scheduling appointments is now effortless, and our patients appreciate the digital prescriptions. Highly recommend!",
      image: doctorImg
    },
    {
      name: "Dr Sakeena",
      text: "Managing patient records and staff tasks has never been easier. The intuitive interface and robust document management features of RoboSensy have significantly improved our clinic's efficiency.",
      image: doctorImg
    },
    {
      name: "Nasreen",
      text: "With RoboSensy, we have streamlined our entire workflow. From appointment scheduling to patient communication, everything is seamless. It's truly the best clinic management solution out there.",
      image: doctorImg
    }
  ];

  return (
    <div className="App">
      <main>
        <div className="navbar">
          <Navbar />
        </div>
        <section id="home" className="hero">
          <div className="hero-content">
            <h1>RoboSensy</h1>
            <p>The Future of Healthcare</p>
            <button className="book-demo">BOOK DEMO</button>
          </div>
          <div className="hero-image">
            <img src={robologo} alt="RoboSensy" />
          </div>
        </section>
        <section id="services" className="services">
          <div className="services-heading">
            <h1>Our Services</h1>
          </div>
          <div className="services-content">
            <ul className="services-list">
              <li>
                <span className="custom-span" role="img" aria-label="appointment">
                  📅
                </span>{" "}
                Appointment Scheduling & Management
              </li>
              <li>
                <span className="custom-span" role="img" aria-label="medicine">
                  💊
                </span>{" "}
                Medicine Management
              </li>
              <li>
                <span className="custom-span" role="img" aria-label="patient">
                  👨‍⚕️
                </span>{" "}
                Patient Management
              </li>
              <li>
                <span className="custom-span" role="img" aria-label="prescription">
                  📝
                </span>{" "}
                Prescription Generator
              </li>
              <li>
                <span className="custom-span" role="img" aria-label="invoice">
                  💵
                </span>{" "}
                Invoice Generator
              </li>
              <li>
                <span className="custom-span" role="img" aria-label="analytics">
                  📊
                </span>{" "}
                Analytic Dashboard
              </li>
              <li>
                <span className="custom-span" role="img" aria-label="hrms">
                  📋
                </span>{" "}
                HRMS Portal
              </li>
            </ul>
            <div className="services-image">
              <img src={laptopImage} alt="RoboSensy Dashboard" />
            </div>
          </div>
        </section>
        <section id="testimonials" className="testimonials">
          <div className="testimonial-heading">
            <h2>What Doctors Say About Us</h2>
          </div>
          <div className="testimonial-cards">
            {testimonials.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" />
                <h3>{testimonial.name}</h3>
                <p>{testimonial.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="contact" className="contact">
          <div className="contact-content">
            <div className="contact-details">
              <h2>Contact</h2>
              <p>
                For any questions or concerns call <br /> 8619131789 <br />
                or fill out our form
              </p>
            </div>
            <div className="contact-forms">
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" style={{ width: "20%" }}>
                    Name
                  </label>
                  <input type="text" id="name" name="name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email" style={{ width: "20%" }}>
                    Email
                  </label>
                  <input type="email" id="email" name="email" />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" style={{ width: "20%" }} className="phone-label">
                    Phone <br /> Number
                  </label>
                  <input type="tel" id="phone" name="phone" />
                </div>
                <div className="form-group">
                  <label htmlFor="message" style={{ width: "20%" }}>
                    Message
                  </label>
                  <textarea id="message" name="message"></textarea>
                </div>
                <button type="submit">SUBMIT NOW</button>
              </form>
            </div>
          </div>
          <div className="footer">
            <div className="logo-section">
              <img src={robologo} alt="RoboSensy Logo" className="logo-image" />
              <div className="logo-text">
                <h1>RoboSensy</h1>
                <p>The Future of Healthcare</p>
              </div>
            </div>
            <div className="social-section">
              <FaInstagram />
              <FaFacebookF />
              <FaTwitter />
              <ImLinkedin />
            </div>
            <div className="powered-by-section">
              <p>Powered By</p>
              <img src={algologo} alt="Powered By Logo" className="powered-by-image" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
