import React from 'react';
import './Header.scss';

const Header = ({ onNew, onShare }) => {
  return (
    <header>
      <div className="header">
        <div className="header-title">
          <h2>WHEEL OF <span>NAMES</span></h2>
        </div>
        <div className="nav">
          <nav>
            <ul>
              <li onClick={onNew}><p>New</p></li>
              <li onClick={onShare}><p>Share</p></li>
              <li><p>More</p></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
