import React, { useEffect, useState } from 'react';

import { getFirestore, collection, doc, getDoc, updateDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';

import '../../styles/styles.css'; 
import { auth, app, config } from '../../Javascript/config.js'; 
import { Link } from 'react-router-dom'; // Use Link for navigation

import LoginPopup from './LoginPopup';
import logo from '../../Images/Crosscupmanager2.png';




const Headbar = ({ highlightedLink }) => {
    const [userEmail, setUserEmail] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasTeam, setHasTeam] = useState(false);

    const [wantsToLogIn, setWantsToLogIn] = useState(false);

    const handleHamburgerClick = () => {
        const hamburger = document.querySelector('.hamburger');
        const header = document.querySelector('.header');
        hamburger.classList.toggle('active');
        header.classList.toggle('active');
        document.querySelectorAll(".header a").forEach((link) =>
            link.addEventListener("click", () => {
              hamburger.classList.remove("active");
              header.classList.remove("active");
            }))
        document.querySelectorAll(".header button").forEach((button) => {
            button.addEventListener("click", () => {
                console.log("clicked");
              hamburger.classList.remove("active");
              header.classList.remove("active");
            })
        })}


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email);
                setIsLoggedIn(true);
                setWantsToLogIn(false);


                const db = getFirestore(app);
                const usercollectionRef = collection(db, config.UserCollection);
                try {const customDocRef = doc(usercollectionRef, user.email);
                getDoc(customDocRef)
                .then(async (docSnapshot) => {
                  if (docSnapshot.exists()) {
                    setHasTeam(true)
                  }})} catch (error) {
                    console.error("Error retrieving document:", error); // Log the error for debugging
                }

            } else {
                setUserEmail(null);
                setIsLoggedIn(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            setUserEmail(null);
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Sign-out error:', error.message);
        }
    };

    // Function to determine link style based on highlightedLink
    const getLinkStyle = (link) => {
        return highlightedLink === link ? { color: 'var(--accentcolor)' } : {};
    };

    return (
        <div>
        {!isLoggedIn && wantsToLogIn && <LoginPopup></LoginPopup>}
            <div className="headbar">
                <div className="headerlogo">
                    <a href="index.html">
                    <img src={logo} alt="Logo" />
                    </a>
                </div>

                <div className="header">
                <Link to="/" style={getLinkStyle('/index')}>Home</Link>
                    <Link to="/Team" style={getLinkStyle('Team')}>Team</Link>
                    <Link to="/Klassement" style={getLinkStyle('Klassement')}>Klassement</Link>
                    <Link to="/Kalender" style={getLinkStyle('Kalender')}>Kalender</Link>
                    <Link to="/Reglement" style={getLinkStyle('Reglement')}>Reglement</Link>
                    <Link to="/Contact" style={getLinkStyle('Contact')}>Contact</Link>
                    {hasTeam && <Link to="/Opstelling" style={getLinkStyle('Opstelling')}>Opstelling</Link>}
                    {hasTeam && <Link to="/Minicompetitie" style={getLinkStyle('Minicompetitie')}>Mini-competitie</Link>}
                    {!isLoggedIn ? (
                        <button id="login-button" className="btn-primary" onClick={() => setWantsToLogIn(true)}>
                            Login
                        </button>
                    ) : (
                        <button id="logout-button" className="btn-primary" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>

               
                </div>
                <div className="hamburger" onClick={handleHamburgerClick}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>

               
            {isLoggedIn && (
                <div className="headbar" id="logged-in-user">
                    User: <span id="username">{userEmail}</span>
                </div>
            )}

            <div className="headunderliner"></div>
        </div>
    );
}

export default Headbar;
