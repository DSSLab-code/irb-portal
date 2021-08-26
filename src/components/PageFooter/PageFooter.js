import React from "react";

function PageFooter(props) {
  return (
    <footer className="page-footer container">
      <h6>Softhread</h6>
      <nav className="page-footer__nav">
        <ul>
          <li className="page-footer__nav-item">
            <a href="#">Terms of Use</a>
          </li>
          <li className="page-footer__nav-item">
            <a href="#">Accessibility</a>
          </li>
          <li className="page-footer__nav-item">
            <a href="#">Privacy</a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default PageFooter;