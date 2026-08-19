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
              <li className="static">
                <span><FontAwesomeIcon className="icon" icon={faComment} />Feedback</span>
              </li>
              <li className="static">
                <span><FontAwesomeIcon className="icon" icon={faQuestionCircle} />FAQ</span>
              </li>
              <li className="static">
                <span><FontAwesomeIcon className="icon" icon={faUserSecret} />Privacy policy</span>
              </li>
              <li className="static">
                <span><FontAwesomeIcon className="icon" icon={faLegal} />Terms & conditions</span>
              </li>
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
