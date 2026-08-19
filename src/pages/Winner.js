import React from 'react'
import './Winner.scss';

const Winner = ({ setIsWinner, winner, onRemoveWinner }) => {
  const handleCloseModal = () => {
    setIsWinner(false);
    document.body.classList.remove('modal-open');
  };

  const handleRemoveWinner = () => {
    onRemoveWinner();
    document.body.classList.remove('modal-open');
  };

  return (
    <div className="modal-container" onClick={handleCloseModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
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
              <button onClick={handleRemoveWinner} title="Remove this value from the wheel">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Winner
