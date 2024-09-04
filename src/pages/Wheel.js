import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import spin from '../sounds/spin.mp3';
import Header from './Header';
import './Wheel.scss';

const preExistingNames = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'
];

const Wheel = ({ isAdmin }) => {
  const { id } = useParams();
  const [wheel, setWheel] = useState(null);

  const [newName, setNewName] = useState('');
  const [winner, setWinner] = useState(null);

  const [results, setResults] = useState(false);
  const [entries, setEntries] = useState(true);

  const wheelRef = useRef();
  const audioRef = useRef(new Audio(spin));

  useEffect(() => {
    const storedWheels = JSON.parse(localStorage.getItem('wheels')) || {};
    const existingWheel = storedWheels[id] || { id, names: [...preExistingNames], results: [] };
    setWheel(existingWheel);
  }, [id]);

  useEffect(() => {
    if (wheel) {
      const storedWheels = JSON.parse(localStorage.getItem('wheels')) || {};
      storedWheels[wheel.id] = wheel;
      localStorage.setItem('wheels', JSON.stringify(storedWheels));
    }
  }, [wheel]);

  const handleSpinWheel = () => {
    if (wheel.names.length === 0) return;

    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play();

    const randomIndex = Math.floor(Math.random() * wheel.names.length);
    spinAnimation(randomIndex);
  };

  const handleShareLink = () => {
    const newWheelId = uuidv4();
    const storedWheels = JSON.parse(localStorage.getItem('wheels')) || {};
    storedWheels[newWheelId] = wheel;
    localStorage.setItem('wheels', JSON.stringify(storedWheels));
    const shareableLink = `${window.location.origin}/wheel/${newWheelId}`;
    alert(`Share this link: ${shareableLink}`);
  };

  const spinAnimation = (randomIndex) => {
    const segments = wheel.names.length;
    const degreesPerSegment = 360 / segments;
    const spins = 5;
    const totalRotation = randomIndex * degreesPerSegment + 360 * spins;
    const wheelElement = wheelRef.current;
    const audio = audioRef.current;

    wheelElement.style.transition = 'transform 6s ease-out';
    wheelElement.style.transform = `rotate(${totalRotation}deg)`;

    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 6000);

    setTimeout(() => {
      const finalRotation = totalRotation % 360;

      const pointerPosition = 270;
      const adjustedRotation = (finalRotation + pointerPosition) % 360;

      let winningIndex = Math.floor((segments - (adjustedRotation / degreesPerSegment)) % segments);

      if (winningIndex < 0) {
        winningIndex += segments;
      }

      const newWinner = wheel.names[winningIndex];

      setWinner(newWinner);
      setWheel({
        ...wheel,
        results: [
          ...wheel.results,
          { username: 'Zoba', winner: newWinner, date: new Date() }
        ],
      });

      wheelElement.style.transition = 'none';
      wheelElement.style.transform = `rotate(${finalRotation}deg)`;
    }, 6000);
  };


  const handleNameChange = (index, value) => {
    const updatedNames = [...wheel.names];
    if (value.trim() === '') {
      updatedNames.splice(index, 1);
    } else {
      updatedNames[index] = value;
    }
    setWheel({ ...wheel, names: updatedNames });
  };

  const handleAddName = () => {
    if (newName.trim() === '') return;
    setWheel({ ...wheel, names: [...wheel.names, newName.trim()] });
    setNewName('');
  };

  if (!wheel) return <div>Loading...</div>;

  const getSegmentPath = (index, segments) => {
    if (segments === 1) {
      return 'M0,0 L100,0 A50,50 0 1,1 0,100 Z';
    }
    const angle = (360 / segments) * index;
    const x = 50;
    const y = 50;
    const radius = 50;
    const startAngle = angle;
    const endAngle = angle + (360 / segments);
    const startX = x + radius * Math.cos((startAngle - 90) * (Math.PI / 180));
    const startY = y + radius * Math.sin((startAngle - 90) * (Math.PI / 180));
    const endX = x + radius * Math.cos((endAngle - 90) * (Math.PI / 180));
    const endY = y + radius * Math.sin((endAngle - 90) * (Math.PI / 180));

    return `M${x},${y} L${startX},${startY} A${radius},${radius} 0 0,1 ${endX},${endY} Z`;
  };

  return (
    <div className="container">
      <Header />
      <div className="wheel-container">
        <div className="winner">
          {winner && <h2><span> Winner: </span>{winner}</h2>}
        </div>
        <div className="wheel-display">
          <div className="pointer"></div>
          <div className="wheel" ref={wheelRef} onClick={handleSpinWheel}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {wheel.names.map((_, index) => (
                <path
                  key={index}
                  d={getSegmentPath(index, wheel.names.length)}
                  fill={`hsl(${(index * 137.5) % 360}, 70%, 60%)`}
                />
              ))}
              {wheel.names.map((name, index) => (
                <text
                  key={index}
                  x="70%"
                  y="20%"
                  textAnchor="center"
                  dominantBaseline="center"
                  fontSize="4"
                  fill="#fff"
                  transform={`rotate(${(360 / wheel.names.length) * index}, 50, 50)`}
                >
                  {name}
                </text>
              ))}
            </svg>
            <div className="center-circle"></div>
          </div>
        </div>
        <div className="wheel-settings">
          {isAdmin && (
            <>
              <div className="list-hdr">
                <nav>
                  <ul>
                    <li onClick={() => { setEntries(true); setResults(false); }}>
                      <p>Entries <span>{wheel.names.length}</span></p>
                    </li>
                    <li className='active' onClick={() => { setResults(true); setEntries(false) }}>
                      <p>Result <span>{wheel.names.length}</span></p>
                    </li>
                    <li>
                      <p><input type="checkbox" /><span>Hide</span></p>
                    </li>
                  </ul>
                </nav>
              </div>
              {entries ?
                <>
                  <div className="names-list">
                    <div className="name-entries">
                      {wheel.names.map((name, index) => (
                        <input
                          key={index}
                          type="text"
                          value={name}
                          onChange={(e) => handleNameChange(index, e.target.value)}
                          placeholder="Enter a name"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="new-name">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Add new name"
                    />
                    <button onClick={handleAddName}>Add Name</button>
                    <button onClick={handleShareLink}>Share Wheel Link</button>
                  </div>
                </>
                : results ?
                  <div className="results-list">
                    {wheel.results.length > 0 ? (
                      <ul>
                        {wheel.results.map((result, index) => (
                          <li key={index}>
                            <p><strong>username:</strong> {result.username}</p>
                            <p><strong>Winner:</strong> {result.winner}</p>
                            <p><strong>Date:</strong> {new Date(result.date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {new Date(result.date).toLocaleTimeString()}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No results yet</p>
                    )}
                  </div>
                  :
                  ''
              }
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wheel;
