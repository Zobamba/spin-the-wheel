import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { mockLogin } from '../api/mockAuth';
import './LoginModal.scss';

const LoginModal = ({ setModalOpen }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const msg = '';
  const [errMsg, setErrMsg] = useState(Array.isArray(msg) ? [] : '');

  const errRef = useRef(null);

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    document.body.classList.remove('modal-open');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');
  
    try {
      const response = await mockLogin({ email, password });
      const { token, data } = response?.data;
      localStorage.setItem('spin_the_wheel_token', token);
      localStorage.setItem('email', data?.email);
      localStorage.setItem('name', data?.firstName);
  
      handleCloseModal();
    } catch (error) {
      if (error.response && error.response.data) {
        if (Array.isArray(error.response.data.errors)) {
          setErrMsg(error.response.data.errors);
        } else {
          setErrMsg([{ msg: error.response.data.message }]);
        }
      } else {
        setErrMsg([{ msg: "No Server Response!" }]);
      }
      errRef?.current?.focus();
    }
  };
  
  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-content">
          <div className="header-txt">
            <h2>Welcome To Spin The Wheel</h2>
          </div>
          <div className="txt">
            <p>Please Login</p>
          </div>
          <div className="demo-hint">
            <p>Demo mode: enter any email and password to sign in — no real account needed.</p>
          </div>
          <div className="form-inputs">
            {Array.isArray(errMsg) ? (
              errMsg.map((error, index) => (
                <p key={index}
                  ref={index === 0 ? errRef : null}
                  className={errMsg ? "errmsg" : "offscreen"}
                  aria-live="assertive">
                  {error.msg}
                </p>
              ))
            ) : (
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive">
                {errMsg}
              </p>
            )}
            <form action="" onSubmit={handleSubmit}>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email address' />
              <div className="input">
                <input
                  type={passwordVisible ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your password' />
                <FontAwesomeIcon
                  icon={passwordVisible ? faEye : faEyeSlash}
                  className="eye-icon"
                  onClick={handleTogglePasswordVisibility}
                />
              </div>
              <div className="forgot-password">
                <Link to="/forgot-password">Forget Password?</Link>
              </div>
              <div className="btn">
                <button type='submit'>Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LoginModal
