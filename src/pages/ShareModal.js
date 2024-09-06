import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import './ShareModal.scss';

const ShareModal = ({ setShareModalVisible, wheel }) => {
  const [shareableLink, setSharableLink] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const handleCloseModal = () => {
    setShareModalVisible(false);
    document.body.classList.remove('modal-open');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        setCopySuccess('Link copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear success message after 2 seconds
      })
      .catch(err => {
        setCopySuccess('Failed to copy link');
      });
  };

  useEffect(() => {
    const handleShareLink = () => {
      const newWheelId = uuidv4();
      const storedWheels = JSON.parse(localStorage.getItem('wheels')) || {};
      storedWheels[newWheelId] = wheel;
      localStorage.setItem('wheels', JSON.stringify(storedWheels));
      setSharableLink(`${window.location.origin}/wheel/${newWheelId}`);
    };

    handleShareLink();
  }, [wheel]);

  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-content">
          <div className="hdr">
            <h2><span><FontAwesomeIcon icon={faShareAlt} /></span>Link To Wheel</h2>
          </div>
          <div className="txt">
            <p>Link to this wheel with current names, colors and settings:</p>
          </div>
          <div className="link">
            <h6>{shareableLink}</h6>
            <button onClick={handleCopyLink}>Copy Link</button>
          </div>
          <div className="to-do">
            <div className="close">
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
          <div className="success">
            {copySuccess && <p>{copySuccess}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
