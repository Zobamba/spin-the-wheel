import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './More.scss';
import { faArrowRightToBracket, faLegal, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { faComment, faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

const More = () => {
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');
  
  const logout = () => {
    let keysToRemove = ["spin_the_wheel_token", "email", "firstName"];

    keysToRemove.forEach((k) => {
      localStorage.removeItem(k)
    });
    window.location.href = '/';
  }

  return (
    <section className="acc-s">
      <div className="acc">
        <div className="cnt">
          <article className="card">
            <ul className="list">
              <div className="basic-info">
                <h6>{name}</h6>
                <p>{email}</p>
              </div>
              <li>
                <Link to="https://cliqitgroup.com/contact" target='blank'>
                  <FontAwesomeIcon className="icon" icon={faComment} />Feedback
                </Link>
              </li>
              <li>
                <Link to="https://cliqitgroup.com/blog/spin-the-wheel" target='blank'>
                  <FontAwesomeIcon className="icon" icon={faQuestionCircle} />FAQ
                </Link>
              </li>
              <li>
                <Link to="https://cliqitgroup.com/privacy" target='blank'>
                  <FontAwesomeIcon className="icon" icon={faUserSecret} />Privacy policy
                </Link>
              </li>
              <li>
                <Link to="https://cliqitgroup.com/terms" target='blank'>
                  <FontAwesomeIcon className="icon" icon={faLegal} />Terms & conditions
                </Link>
              </li>
              {/* <li>
                <Link to="/">
                  <FontAwesomeIcon className="icon" icon={faUserCircle} />My account
                </Link>
              </li> */}
              <div className="divider"></div>
              <li >
                <Link onClick={logout}>
                  <FontAwesomeIcon className="icon" icon={faArrowRightToBracket} />Logout
                </Link>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}

export default More
