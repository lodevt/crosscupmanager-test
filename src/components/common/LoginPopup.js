// LoginPopup.js
import React, { useEffect, useState } from 'react';
import '../../styles/styles.css'

import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    linkWithPopup,
    signOut,
  } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js';
// LoginPopup.js


const LoginPopup = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  // Create instances of the providers
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // Signed in successfully
        const user = result.user;
        setUser(user);
        //console.log('Google sign-in successful:', user);
      })
      .catch((error) => {
        if (error.code === 'auth/account-exists-with-different-credential') {
          alert('U email is al gekoppeld aan een Facebook account. Log in met Facebook.');
        }
        const errorMessage = error.message;
        console.error(`Sign-in error: ${errorMessage}`);
      });
  };

  const signInWithFacebook = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        // Signed in successfully
        const user = result.user;
        setUser(user);
        console.log('Facebook sign-in successful:', user);
      })
      .catch((error) => {
        if (error.code === 'auth/account-exists-with-different-credential') {
          alert('U email is al gekoppeld aan een Google account. Log in met Google.');
        }
        const errorMessage = error.message;
        console.error(`Sign-in error: ${errorMessage}`);
      });
  };


  return (
    <div id="popup" className="popup">
      <div className="home-message" style={{ color: 'white', padding: '5%', width: '100%' }}>
        <div className="subtitel-home" style={{ color: 'white', textAlign: 'center', fontSize: '1.2em' }}>
          Inloggen
        </div>
        <div className="subtitel-home" style={{ color: 'white', textAlign: 'center', fontSize: '0.5em' }}>
          Inloggen via externe applicaties (bv. instagram) werkt mogelijks niet. In dit geval log je beter in{' '}
          <b>
            <u>via je browser</u>
          </b>
          . Veel Plezier!
        </div>
        <button id="login-button-google" onClick={signInWithGoogle}>Login met Google</button>
        <button id="login-button-facebook" onClick={signInWithFacebook}>Login met Facebook</button>
      </div>
    </div>
  );
};

export default LoginPopup;


