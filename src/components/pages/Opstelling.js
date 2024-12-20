import React, { useState, useEffect } from 'react';
import '../../styles/styles.css'; 

import Headbar from '../common/Headbar';


import {getFirestore, collection, addDoc, setDoc, doc, getDoc, docSnapshot, deleteDoc, updateDoc} from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';
import {app, auth} from '../../Javascript/firebaseInit.js';
import {config} from '../../Javascript/config.js';

import {onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js';


const Opstelling = () => {
    
    const [userData, setUserData] = useState(null);
    const [menAthletes, setMenAthletes] = useState([]);
    const [womenAthletes, setWomenAthletes] = useState([]);
    const [selectedMen, setSelectedMen] = useState({});
    const [selectedWomen, setSelectedWomen] = useState({});  
    const [punten, setPunten] = useState(null);
    const [raceIsVoorbij, setRaceIsVoorbij] = useState(false);

    const [nbOpstelling, setNbOpstelling] = useState(6);
    const [deadlines, setDeadlines] = useState({});
    const [timeRemaining, setTimeRemaining] = useState('');

  
    const [race, setRace] = useState('Hulshout');


    useEffect(() => {
      const updateTimeRemaining = () => {
          if (deadlines && deadlines[race]) {
              const now = new Date();
              const difference = deadlines[race] - now;
              if (difference < 0) {
                  setTimeRemaining('De wedstrijd is gelopen. Bekijk je punten!');
              } else {
                  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
                  setTimeRemaining(`Tijd tot deadline: ${days} dagen, ${hours} uur, ${minutes} minuten, ${seconds} seconden`);
              }
          }
      };
  
      // Update the time remaining immediately and then every second
      updateTimeRemaining();
      const intervalId = setInterval(updateTimeRemaining, 1000);
  
      return () => clearInterval(intervalId); // Clean up on unmount
  }, [deadlines, race]);


  useEffect(() => {
    const isVoorbij = deadlines[race] < new Date();
    setRaceIsVoorbij(isVoorbij);
}, [deadlines, race]);


 
  useEffect(() => {
    // Check if the user is logged in and fetch the athlete data
  

  const checkDeadlines = async () => {
      const newPunten = {}
      for (const [race, deadline] of Object.entries(deadlines)) {
        // Convert Firestore Timestamp to JavaScript Date
        // Check if the deadline has passed
        if (new Date() > deadline) {
          
          const db = getFirestore(app);
          const resultRef = doc(collection(db, config.RaceResultsCollection), config.season + race);
          const resultDoc = await getDoc(resultRef);
          
          if (resultDoc.exists()) {
            const data = resultDoc.data();
            const menPoints = data['men-points'];
            const womenPoints = data['women-points'];
            
            const racePoints = {};
            // Populate racePoints for men athletes
            menAthletes.forEach(men => {
              const lowercasename = men.replace(/\s*\(\d+\)/, '').toLowerCase().trim();
              racePoints[men] = menPoints[lowercasename] || 0; // Default to 0 if no points exist for the athlete
            });

            // Populate racePoints for women athletes
            womenAthletes.forEach(women => {
              const lowercasename = women.replace(/\s*\(\d+\)/, '').toLowerCase().trim();

              racePoints[women] = womenPoints[lowercasename] || 0; // Default to 0 if no points exist for the athlete
            });

            newPunten[race] = racePoints;
            
            // You can now use racePoints as needed
          }
        }
      }
      console.log(newPunten);
      setPunten(newPunten);
    } 


  checkDeadlines();
}, [deadlines, menAthletes, userData]);






  
    useEffect(() => {
        // Check if the user is logged in and fetch the athlete data
        const db = getFirestore(app);
        const fetchUserData = async (user) => {
            const userDoc = doc(collection(db, config.UserCollection), user.email);
            const docSnapshot = await getDoc(userDoc);  // Correct naming
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();  // Use `docSnapshot` to get the data
              const team_name = userData.team_name;
              setUserData(userData);  // Set the state with the fetched user data
            } else {
              console.log("No such document!");
            }
          };
    
        onAuthStateChanged(auth, (user) => {
          if (user) {
            fetchUserData(user);
          }
        });

    const deadlineRef = doc(collection(db, config.DeadlinesColletion), config.season);
      getDoc(deadlineRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const deadlines = docSnapshot.data();
            for (let raceKey in deadlines) {
              deadlines[raceKey] = new Date(deadlines[raceKey].toDate()); // Convert to Date object
            }
            setDeadlines(deadlines);
            }
          });
      }, []);

    useEffect(() => {
        if (userData) {
            setMenAthletes(userData.men_athletes);
            setWomenAthletes(userData.women_athletes);
    
            const keys = ['Berlare', 'Roeselare', 'Hannuit', 'Diest', 'Hulshout'];
            const newSelectedMen = {};
            const newSelectedWomen = {};
            const newDeadlines = {}
    
            keys.forEach(key => {
                newSelectedMen[key] = userData[`${key}Opstelling`]?.men || [];
                newSelectedWomen[key] = userData[`${key}Opstelling`]?.women || [];

            });
    
            setSelectedMen(newSelectedMen);
            setSelectedWomen(newSelectedWomen);
        }
    }, [userData]);
    

    const handleRaceChange = (event) => {
        setRace(event.target.value); // Update the race state when a new team is selected
      };

    const handleCheckboxChange = (gender, e, athlete) => {
        const isChecked = e.target.checked;
    
        if (gender === 'men') {
            setSelectedMen((prevSelectedMen) => {
                const updatedSelectedMen = { ...prevSelectedMen };
                const raceAthletes = updatedSelectedMen[race] || [];
    
                if (isChecked) {
                    // Only allow adding an athlete if there are less than nbOpstelling athletes selected
                    if (!raceAthletes.includes(athlete) && raceAthletes.length < nbOpstelling) {
                        updatedSelectedMen[race] = [...raceAthletes, athlete];
                    }
                } else {
                    // Remove the athlete if it's unchecked
                    updatedSelectedMen[race] = raceAthletes.filter(a => a !== athlete);
                }
    
                return updatedSelectedMen;
            });
        } else if (gender === 'women') {
            setSelectedWomen((prevSelectedWomen) => {
                const updatedSelectedWomen = { ...prevSelectedWomen };
                const raceAthletes = updatedSelectedWomen[race] || [];
    
                if (isChecked) {
                    // Only allow adding an athlete if there are less than nbOpstelling athletes selected
                    if (!raceAthletes.includes(athlete) && raceAthletes.length < nbOpstelling) {
                        updatedSelectedWomen[race] = [...raceAthletes, athlete];
                    }
                } else {
                    // Remove the athlete if it's unchecked
                    updatedSelectedWomen[race] = raceAthletes.filter(a => a !== athlete);
                }
    
                return updatedSelectedWomen;
            });
        }
    };
    


    

    async function save() {
      let userEmail;
      if (auth.currentUser) {
        // User is signed in, you can access the user's email like this:
        userEmail = auth.currentUser.email;
      } else {
        alert('Log in om uw opstelling aan te passen.');
        return;
      }
      if (deadlines[race] > new Date()) { // not past deadline
        const selectedOption = race;
    
        const men = selectedMen[race]
        const women = selectedWomen[race];
    
        if (men.length == 6 && women.length == 6) {
          // Get a Firestore reference
          const db = getFirestore(app);
          const userCollection = collection(db, config.UserCollection);
    
          // Reference to the Firestore document you want to create with a custom ID
          const customDocRef = doc(userCollection, userEmail);
          const menOpstelling = men;
          const womenOpstelling = women;
          updateDoc(customDocRef, {[`${selectedOption}Opstelling`]: {
            men: menOpstelling,
            women: womenOpstelling,
          }}).then(() => {
            alert('Uw opstelling is opgeslagen');
          });
        } else {
          alert('Selecteer 6 manneljke en 6 vrouwelijke atleten');
        }
      } else {
        alert('Deze wedstrijd is al voorbij.');
      }
    }
    
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="icon" href="Images/Crosscupmanager.png" type="image/x-icon" />
        <title>CrosscupManager Opstelling</title>
      </head>
      <Headbar highlightedLink="Opstelling" />

        <div id="full-container">
          <div className="paginatitel" style={{ fontSize: '20px', paddingBottom: '10px' }}>
            Maak een selectie van 6 atleten voor elke wedstrijd, enkel deze atleten kunnen punten verdienen in deze wedstrijd.
          </div>
          <div className="form-container-opstelling">
          <div className="team-selector" style={{ width: '50%' }}>
            <label htmlFor="team">Selecteer wedstrijd:</label>
            <select className="selectorRaces" id="team" value={race} onChange={handleRaceChange}>
                <option className="filterButton" value="Berlare">Berlare</option>
                <option className="filterButton" value="Roeselare">Roeselare</option>
                <option className="filterButton" value="Hulshout">Hulshout</option>
                <option className="filterButton" value="Hannuit">Hannuit</option>
                <option className="filterButton" value="Diest">Diest</option>
            </select>
        </div>

            <div className="form-group" style={{ justifyContent: 'center', width: '50%' }}>
            <button type="button" className="btn btn-primary" id="save-button" onClick={save}>
              Opslaan
            </button>
            </div>
          </div>
          <div className="paginatitel" style={{ fontSize: '20px', paddingBottom: '10px' }}>
         {deadlines[race] && (
                    <span>
                        {timeRemaining} {/* Weergeven van het verschil */}
                    </span>
                )}
        </div>

          <div className="container" style={{ justifyContent: 'space-around', padding: '0%' }}>
            <div className="opstelling">
              <h5 className="subtitel" id="deadline" style={{ textAlign: 'left', marginLeft: '0%', fontSize: '30px', textDecoration: 'none' }}></h5>
              <h5 className="subtitel" id="subtitel-mannen" style={{ textAlign: 'left', marginLeft: '0%', fontSize: '30px', textDecoration: 'none' }}>Opstelling mannen</h5>
              <h5 id="budgetmen"></h5>

                {!raceIsVoorbij && <div className="opstelling-mannen" id="opstelling-mannen">
                    {menAthletes && menAthletes.map((athlete, index) => (
                        <div key={index}>
                        <input 
                            type="checkbox" 
                            className="chosen-athlete-checkbox-men" 
                            id={`chosen-${index + 1}-men`} 
                            value={athlete} 
                            checked={selectedMen[race]?.includes(athlete) || false} // Check if the athlete is selected
                            onChange={(e) => handleCheckboxChange('men',e, athlete)} // Handle checkbox change

                        />
                        <label htmlFor={`chosen-${index + 1}-men`}>{athlete}</label><br />
                        </div>
                    ))}
                </div>}


                {raceIsVoorbij &&  (
                <div className="punten-mannen" id="punten-mannen">
                {menAthletes.map((athlete, index) => {
                  const points = punten[race]?.[athlete] || 0; // Get points safely with default to 0
                  const classNameAthl = selectedMen[race]?.includes(athlete) ? "athlete-container" : "athlete-container-bench"; // Determine class based on selection

              
                  return (
                    <div key={index} className={classNameAthl} data-points={points}>
                      {athlete}
                    </div>
                  );
                })}
              </div>
              )}


            </div>
          </div>

          <div className="container" style={{ justifyContent: 'space-around', padding: '0%' }}>
            <div className="opstelling">
              <h5 className="subtitel" id="subtitel-vrouwen" style={{ textAlign: 'left', marginLeft: '0%', fontSize: '30px', textDecoration: 'none' }}>Opstelling vrouwen</h5>
              <h5 id="budgetwomen"></h5>

              {!raceIsVoorbij && <div className="opstelling-vrouwen" id="opstelling-vrouwen">
                    {womenAthletes && womenAthletes.map((athlete, index) => (
                        <div key={index}>
                        <input 
                            type="checkbox" 
                            className="chosen-athlete-checkbox-women" 
                            id={`chosen-${index + 1}-women`} 
                            value={athlete} 
                            checked={selectedWomen[race]?.includes(athlete) || false} // Check if the athlete is selected
                            onChange={(e) => handleCheckboxChange('women',e, athlete)} // Handle checkbox change

                        />
                        <label htmlFor={`chosen-${index + 1}-women`}>{athlete}</label><br />
                        </div>
                    ))}
                </div>}

                {raceIsVoorbij &&  (
                <div className="punten-vrouwen" id="punten-vrouwen">
                {womenAthletes.map((athlete, index) => {
                  const points = punten[race]?.[athlete] || 0; // Get points safely with default to 0
                  const classNameAthl = selectedWomen[race]?.includes(athlete) ? "athlete-container-women" : "athlete-container-women-bench"; // Determine class based on selection

              
                  return (
                    <div key={index} className={classNameAthl} data-points={points}>
                      {athlete}
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          </div>
        </div>
    </html>
  );
};

export default Opstelling;
