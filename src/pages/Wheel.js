import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { v4 as uuidv4 } from 'uuid';
import spin from '../sounds/spin.mp3';
import clap from '../sounds/clap.mp3';
import Header from './Header';
import More from './More';
import ShareModal from './ShareModal';
import Sponsors from './Sponsors';
import LoginModal from './LoginModal';
import GuestUserSpinResults from './GuestUserSpinResults';
import Winner from './Winner';
import './Wheel.scss';

const Wheel = ({ isAdmin }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [wheel, setWheel] = useState(null);
  const [adminWheels, setAdminWheels] = useState({});
  const [expandedWheels, setExpandedWheels] = useState([]);

  const [newName, setNewName] = useState('');
  const [winner, setWinner] = useState(null);
  const [isWinner, setIsWinner] = useState(false);
  const [wheelName, setWheelName] = useState('');

  const [results, setResults] = useState(false);
  const [entries, setEntries] = useState(true);
  const [history, setHistory] = useState(false);
  const [guestResults, setGuestResults] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState();
  const [shareModalVisible, setShareModalVisible] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [viewResults, setViewResults] = useState(false);

  const wheelRef = useRef();
  const spinAudioRef = useRef(new Audio(spin));
  const clapAudioRef = useRef(new Audio(clap));

  useEffect(() => {
    const preExistingNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
    const storedWheels = JSON.parse(localStorage.getItem('wheels')) || {};

    if (isAdmin) {
      setAdminWheels(storedWheels);

      const adminWheelId = id || uuidv4();
      const existingWheel = storedWheels[adminWheelId] || { name: '', id: adminWheelId, names: [...preExistingNames], results: [] };
      setWheel(existingWheel);
    } else {
      const existingWheel = storedWheels[id] || { id, names: [...preExistingNames], results: [] };
      setWheel(existingWheel);
    }
  }, [id, isAdmin]);

  useEffect(() => {
    const loggedInUserToken = localStorage.getItem('spin_the_wheel_token');
    if (loggedInUserToken) {
      setModalOpen(false);
    } else {
      setModalOpen(true);
    }

    if (wheel) {
      const storedWheels = JSON.parse(localStorage.getItem('wheels')) || {};
      storedWheels[wheel.id] = wheel;
      localStorage.setItem('wheels', JSON.stringify(storedWheels));
    }
  }, [wheel]);


  useEffect(() => {
    if (isAdmin) {
      const storedWheels = JSON.parse(localStorage.getItem('wheels')) || {};
      setAdminWheels(Object.values(storedWheels));  // Load all wheels for admin
    }
  }, [isAdmin]);

  useEffect(() => {
    const deletedWheels = JSON.parse(localStorage.getItem('deletedWheels')) || [];

    if (!isAdmin && deletedWheels.includes(id)) {
      alert("This wheel is no longer accessible.");
      navigate('/not-found');
    }
  }, [id, isAdmin, navigate]);

  const handleSpinWheel = () => {
    if (wheel.names.length === 0) return;

    const spinAudio = spinAudioRef.current;
    spinAudio.currentTime = 0;
    spinAudio.play();

    const randomIndex = Math.floor(Math.random() * wheel.names.length);
    spinAnimation(randomIndex);
  };

  const handleNewWheel = () => {
    const storedWheels = JSON.parse(localStorage.getItem('wheels')) || {};
    setAdminWheels(Object.values(storedWheels));
    const preExistingNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];

    const newWheelId = uuidv4();
    const newWheel = { id: newWheelId, names: [...preExistingNames], results: [] };
    setWheel(newWheel);
    setEntries(true);
    setResults(false);
    setHistory(false);
  };

  const spinAnimation = (randomIndex) => {
    const segments = wheel.names.length;
    const degreesPerSegment = 360 / segments;
    const spins = 5;
    const totalRotation = randomIndex * degreesPerSegment + 360 * spins;
    const wheelElement = wheelRef.current;
    const spinAudio = spinAudioRef.current;

    wheelElement.style.transition = 'transform 6s ease-out';
    wheelElement.style.transform = `rotate(${totalRotation}deg)`;

    const triggerConfetti = (x, y) => {
      let count = 0;
      const intervalId = setInterval(() => {
        if (count >= 3) {  // Stop after 3 times
          clearInterval(intervalId);
        } else {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: x, y: y },  // Left side
            colors: ['#ff0', '#ff5733', '#00ff00', '#00f', '#f0f'],
          });
          count++;
        }
      }, 1000);  // Repeat every 1 second (1000 milliseconds)
    };

    setTimeout(() => {
      spinAudio.pause();
      spinAudio.currentTime = 0;
    }, 6000);

    setTimeout(() => {
      setIsWinner(true);
      const finalRotation = totalRotation % 360;

      const pointerPosition = 360;
      const adjustedRotation = (finalRotation + pointerPosition) % 360;

      let winningIndex = Math.floor((segments - (adjustedRotation / degreesPerSegment)) % segments);

      if (winningIndex < 0) {
        winningIndex += segments;
      }

      const newWinner = wheel.names[winningIndex];
      const username = localStorage.getItem('name') || 'Guest';

      // If not an admin, store guest user results
      if (!isAdmin) {
        const newResult = {
          username,
          winner: newWinner,
          date: new Date(),
        };

        // Update guest results state
        setGuestResults((prevResults) => [
          ...prevResults,
          newResult,
        ]);

        // Update session storage for guest results
        const guestResultsFromSession = JSON.parse(sessionStorage.getItem(`wheel_${wheel.id}_guestResults`)) || guestResults;
        guestResultsFromSession.push(newResult);
        sessionStorage.setItem(`wheel_${wheel.id}_guestResults`, JSON.stringify(guestResultsFromSession));
      }

      setWinner(newWinner);
      setWheel({
        ...wheel,
        results: [
          ...wheel.results,
          { username: username, winner: newWinner, date: new Date() }
        ],
      });

      wheelElement.style.transition = 'none';
      wheelElement.style.transform = `rotate(${finalRotation}deg)`;

      triggerConfetti(0.2, 0.5)
      triggerConfetti(0.8, 0.5)
      triggerConfetti(0.5, 0.2)
      triggerConfetti(0.5, 0.8)
      triggerConfetti(0.4, 0.1)

      clapAudioRef.current.play();
      setTimeout(() => {
        clapAudioRef.current.pause();
        clapAudioRef.current.currentTime = 0;
      }, 12000);

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

  const toggleWheelResults = (wheelId) => {
    if (expandedWheels.includes(wheelId)) {
      setExpandedWheels(expandedWheels.filter(id => id !== wheelId));
    } else {
      setExpandedWheels([...expandedWheels, wheelId]);
    }
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

  const convertToCSV = (data) => {
    const header = ['Index', 'Username', 'Winner', 'Date', 'Time'];
    const rows = data.map((result, index) => [
      index + 1,
      result.username,
      result.winner,
      new Date(result.date).toLocaleDateString(),
      new Date(result.date).toLocaleTimeString()
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + header.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    return csvContent;
  };

  const handleDownloadCSV = (xWheel) => {
    const csvContent = convertToCSV(xWheel.results);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "spin-results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveWheelToLocalStorage = (updatedWheel) => {
    const updatedWheels = { ...adminWheels, [updatedWheel.id]: updatedWheel };
    localStorage.setItem('wheels', JSON.stringify(updatedWheels));
  };

  const handleWheelNameChange = (value) => {
    setWheelName(value);
    const updatedWheel = { ...wheel, name: value };
    setWheel(updatedWheel);
    saveWheelToLocalStorage(updatedWheel);
  };

  const handleDeleteWheel = (adminWheelId) => {
    const storedWheels = JSON.parse(localStorage.getItem('wheels')) || {};

    if (storedWheels.hasOwnProperty(adminWheelId)) {
      delete storedWheels[adminWheelId];
      localStorage.setItem('wheels', JSON.stringify(storedWheels));

      const deletedWheels = JSON.parse(localStorage.getItem('deletedWheels')) || [];
      deletedWheels.push(adminWheelId);
      localStorage.setItem('deletedWheels', JSON.stringify(deletedWheels));

      setAdminWheels(Object.values(storedWheels));
    } else {
      console.error(`Wheel with id ${adminWheelId} does not exist.`);
    }
  };

  return (
    <div className="container">
      <Header
        onNew={handleNewWheel}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        setShareModalVisible={setShareModalVisible}
        isAdmin={isAdmin}
        setViewResults={setViewResults}
      />
      <div className="more">
        {isModalVisible && <More />}
      </div>
      <div className="wheel-container">
        {modalOpen && <LoginModal setModalOpen={setModalOpen} />}
        {isWinner && <Winner setIsWinner={setIsWinner} winner={winner} />}
        {shareModalVisible && <ShareModal setShareModalVisible={setShareModalVisible} wheel={wheel} />}
        {viewResults && <GuestUserSpinResults setViewResults={setViewResults} wheel={wheel} />}
        <div className={isAdmin ? "ads" : ""}>
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
              {/* Calculate the length of the longest name */}
              {(() => {
                const maxLength = Math.max(...wheel.names.map((name) => name.length));
                const fontSize = Math.max(4, 13 - maxLength); // Uniform font size based on longest name

                return wheel.names.map((name, index) => (
                  <text
                    key={index}
                    x="80%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={fontSize}
                    fontFamily="Montserrat, sans-serif"
                    fill="#fff"
                    transform={`rotate(${(360 / wheel.names.length) * index}, 50, 50)`}
                  >
                    {name.length > 10 ? `${name.substring(0, 10)}...` : name}
                  </text>
                ));
              })()}
            </svg>
            <div className="center-circle"></div>
          </div>
        </div>
        <div className={isAdmin ? "wheel-settings" : ""}>
          {isAdmin && (
            <div className="settings">
              <div className="list-hdr">
                <nav>
                  <ul>
                    <li className={entries ? 'active' : ''} onClick={() => { setEntries(true); setResults(false); setHistory(false); }}>
                      <p>Entries <span>{wheel.names.length}</span></p>
                    </li>
                    <li className={results ? 'active' : ''} onClick={() => { setResults(true); setEntries(false); setHistory(false); }}>
                      <p>Results <span>{wheel.results.length}</span></p>
                    </li>
                    <li className={history ? 'active' : ''} onClick={() => { setHistory(true); setEntries(false); setResults(false); }}>
                      <p>History <span>{adminWheels.filter(w => w.results.length > 0).length}</span></p>
                    </li>
                  </ul>
                </nav>
              </div>

              {entries && (
                <div className="name-section">
                  <div className="wheel-name">
                    <input
                      type="text"
                      value={wheelName}
                      onChange={(e) => handleWheelNameChange(e.target.value)}
                      placeholder="Type wheel name here..."
                    />
                  </div>
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
                  </div>
                </div>
              )}

              {results && (
                <div className="results-list">
                  {wheel.results.length > 0 ? (
                    <>
                      <div className="download">
                        <button onClick={() => { handleDownloadCSV(wheel) }}>Download CSV</button>
                      </div>
                      <ul>
                        {wheel.results.map((result, index) => (
                          <li key={index}>
                            <p><strong>Username:</strong> {result.username}</p>
                            <p><strong>Winner:</strong> {result.winner}</p>
                            <p><strong>Date:</strong> {new Date(result.date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {new Date(result.date).toLocaleTimeString()}</p>
                          </li>
                        ))}
                      </ul>
                    </>

                  ) : (
                    <p>No results yet</p>
                  )}
                </div>
              )}

              {history && (
                <div className="history-list">
                  {Object.values(adminWheels).filter(wheel => wheel.results.length > 0).length > 0 ? (
                    <ul>
                      {Object.values(adminWheels).filter(wheel => wheel.results.length > 0).map((wheel, index) => (
                        <li className="list-data" key={index}>
                          <div className="wheel-id">
                            <div onClick={() => toggleWheelResults(wheel.id)}>
                              {wheel.name ? (
                                <span className='wheel-name'>{wheel.name}</span>
                              ) : (
                                <p><span>Wheel ID:</span> {wheel.id}</p>
                              )}
                            </div>
                            <div className="download">
                              <button onClick={() => { handleDownloadCSV(wheel) }}>Download CSV</button>
                              <button onClick={() => handleDeleteWheel(wheel.id)} className="delete">Delete</button>
                            </div>
                          </div>
                          {expandedWheels.includes(wheel.id) && (
                            <ul className="list-result">
                              {wheel.results.map((result, idx) => (
                                <li key={idx}>
                                  <p><strong>Username:</strong> {result.username}</p>
                                  <p><strong>Winner:</strong> {result.winner}</p>
                                  <p><strong>Date:</strong> {new Date(result.date).toLocaleDateString()}</p>
                                  <p><strong>Time:</strong> {new Date(result.date).toLocaleTimeString()}</p>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No wheels with results available yet.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {!isAdmin && <Sponsors />}
    </div>
  );
};

export default Wheel;
