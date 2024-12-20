import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  linkWithPopup,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js';
import {firebaseConfig} from './config'

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

// Initialize Firebase Authentication

// Create an instance of the Google provider
const googleProvider = new GoogleAuthProvider();

const signInButton = document.getElementById('login-button-google');
const loginButton = document.getElementById('login-button');

if (signInButton) {
  signInButton.addEventListener('click', () => {
  // Sign in with Google popup
    signInWithPopup(auth, googleProvider)
        .then((result) => {
          // Signed in successfully
          const user = result.user;
          // Check if the user is already linked with another provider
        })
        .catch((error) => {
          if (error.code == 'auth/account-exists-with-different-credential') {
            alert('Uw email is al gekoppeld aan een Facebook account. Log in met Facebook.');
          }
          // Handle sign-in errors
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(`Sign-in error: ${errorMessage}`);
        });
  });
}

const signInButtonFacebook = document.getElementById('login-button-facebook');


const facebookProvider = new FacebookAuthProvider();
if (signInButtonFacebook) {
  signInButtonFacebook.addEventListener('click', () => {
  // Sign in with Facebook popup
    signInWithPopup(auth, facebookProvider)
        .then((result) => {
          // Signed in successfully
          const user = result.user;
          // Check if the user is already linked with another provider
        })
        .catch((error) => {
          if (error.code == 'auth/account-exists-with-different-credential') {
            alert('U email is al gekoppeld aan een Google account. Log in met Google.');
          }
          // Handle sign-in errors
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(`Sign-in error: ${errorMessage}`);
        });
  });
}


const signOutButton = document.getElementById('logout-button');
const loggedInUser = document.getElementById('logged-in-user');
const username = document.getElementById('username');
const popup = document.getElementById('popup');
// Event listener for the sign-out button
if (signOutButton) {
  signOutButton.addEventListener('click', () => {
  signOut(auth)
      .then(() => {
      // Signed out successfully
      // console.log("Signed out successfully");

      })
      .catch((error) => {
      // Handle sign-out errors
        const errorMessage = error.message;
        console.error(`Sign-out error: ${errorMessage}`);
      });
});
}
// Add an event listener to check the user's authentication state
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.
    // const uid = user.uid; // User's unique ID
    // const displayName = user.displayName; // User's display name
    const email = user.email; // User's email address
    // const photoURL = user.photoURL; // User's photo URL
    // const emailVerified = user.emailVerified; // User's email verification status
    if (popup) {
      popup.style.display = 'none';
    }
    if (loginButton) {
      loginButton.style.display = 'none';
    }
    if (signOutButton) signOutButton.style.display = 'block';
    if (loggedInUser) loggedInUser.style.display = 'block';
    if (username) username.textContent = email;
    // console.log(`User is signed in as ${displayName} (ID: ${uid})`);
  } else {
    // User is signed out.
    if (popup) {
      popup.style.display = 'block';
    }
    if (signOutButton) signOutButton.style.display = 'none';
    if (loginButton) {
      loginButton.style.display = 'flex';
    }
    if (loggedInUser) loggedInUser.style.display = 'none';
    // console.log('User is signed out');
  }
});


export {app, auth}; // Export 'app' and 'auth' objects

