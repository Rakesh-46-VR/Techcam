import React from "react";
import "./footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} TechCam. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
