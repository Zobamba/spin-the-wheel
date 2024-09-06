import React from 'react'
import './Winner.scss';

const Winner = ({ setIsWinner, winner }) => {
  const handleCloseModal = () => {
    setIsWinner(false);
    document.body.classList.remove('modal-open');
  };
  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-content">
          <div className="hdr">
            <h2>We have a winner</h2>
          </div>
          <div className="winner">
            <h2>{winner}</h2>
          </div>
          <div className="to-do">
            <div className="copy">
              <button onClick={handleCloseModal}>Close</button>
            </div>
            <div className="download">
              <button>Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Winner
