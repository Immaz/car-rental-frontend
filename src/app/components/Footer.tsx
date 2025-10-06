import React from "react";
const Footer = () => {
  return (
    <section id="section-footer" className="mt-6">
      <footer className="site-footer container">
        <div className="footer-main">
          <div className="footer-about">
            <a href="#" className="logo">
              <img src="/images/3311_359.svg" alt="CarRental favicon" />
              <span>CarRental</span>
            </a>
            <p>
              Premium car rental service with a wide selection of luxury and
              everyday vehicles for all your driving needs.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <img src="/images/3311_319.svg" alt="Facebook" />
              </a>
              <a href="#" aria-label="Instagram">
                <img src="/images/3311_322.svg" alt="Instagram" />
              </a>
              <a href="#" aria-label="Twitter">
                <img src="/images/3311_327.svg" alt="Twitter" />
              </a>
              <a href="#" aria-label="Email">
                <img src="/images/3311_330.svg" alt="Email" />
              </a>
            </div>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Browse Cars</a>
              </li>
              <li>
                <a href="#">List Your Car</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
            </ul>
          </div>
          <div className="footer-links">
            <h3>Resources</h3>
            <ul>
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Insurance</a>
              </li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Contact</h3>
            <ul>
              <li>Rashid Minhas Road</li>
              <li>Karachi, Sindh 75300</li>
              <li>+92 3180438851</li>
              <li>
                <a href="mailto:immaz.alam@systemsltd.com">
                  immaz.alam@systemsltd.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 CarRental. All rights reserved.</p>
          <div className="legal-links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
