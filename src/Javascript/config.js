import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js';
 
export const config = {
  AthletesCollection: process.env.REACT_APP_ATHLETES_COLLECTION, 
  DeadlinesColletion: process.env.REACT_APP_DEADLINES_COLLECTION, 
  MiniCompetitionsCollection: process.env.REACT_APP_MINI_COMPETITIONS_COLLECTION, 
  RaceResultsCollection: process.env.REACT_APP_RACE_RESULTS_COLLECTION, 
  StandingsCollection: process.env.REACT_APP_STANDINGS_COLLECTION, 
  TakenTeamNamesCollection: process.env.REACT_APP_TAKEN_TEAM_NAMES_COLLECTION, 
  UserCollection: process.env.REACT_APP_USER_COLLECTION, 
  season: process.env.REACT_APP_SEASON, 
  atleten_per_wedstrijd: parseInt(process.env.REACT_APP_ATLETEN_PER_WEDSTRIJD, 6),
};

 
/*export const config = {
    AthletesCollection: 'Athletes',
    DeadlinesColletion: 'Deadlines',
    MiniCompetitionsCollection: 'MiniCompetitions',
    RaceResultsCollection: 'RaceResults',
    StandingsCollection: 'Standings',
    TakenTeamNamesCollection: 'Taken-team-names',
    UserCollection: 'Users',

    season: 'season2324',

    atleten_per_wedstrijd: 6,

  }; 
  */


export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };

