import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faList, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import './Header.scss';

const Header = ({
  onNew, isAdmin,
  isModalVisible,
  setIsModalVisible,
  setShareModalVisible, setViewResults }) => {
  return (
    <header>
      <div className="header">
        <div className="header-title">
          <h2>SPIN <span>THE</span> WHEEL</h2>
        </div>
        <div className="nav">
          <nav>
            <ul>
              {isAdmin &&
                <li onClick={onNew}><p>New</p></li>
              }
              {
                isAdmin &&
                <li onClick={() => setShareModalVisible(true)}>
                  <span><FontAwesomeIcon icon={faShareAlt} /></span>
                  <p>Share</p>
                </li>
              }
              {
                !isAdmin &&
                <li onClick={() => setViewResults(true)}>
                  <span><FontAwesomeIcon icon={faList} /></span>
                  <p>View Results</p>
                </li>
              }
              <li onClick={() => setIsModalVisible(!isModalVisible)}>
                <p>More</p>
                {!isModalVisible ?
                  <span><FontAwesomeIcon icon={faAngleDown} /></span>
                  :
                  <span><FontAwesomeIcon icon={faAngleUp} /></span>}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
