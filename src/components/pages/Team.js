import React, { useState, useEffect } from 'react';
import {getFirestore, collection, addDoc, setDoc, doc, getDoc, deleteDoc} from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';
import {onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js';
import {app, auth} from '../../Javascript/firebaseInit.js';
import LoginPopup from '../common/LoginPopup';

import {config} from '../../Javascript/config.js';

import '../../styles/styles.css';
import Headbar from '../common/Headbar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Use Link for navigation



const Team = () => {

  const [teamName, setTeamName] = useState('');
  const [menAthletes, setMenAthletes] = useState([]);
  const [womenAthletes, setWomenAthletes] = useState([]);
  const [initialBudget, setInitialBudget] = useState(0);
  const [remainingBudgetMen, setRemainingBudgetMen] = useState(0);
  const [remainingBudgetWomen, setRemainingBudgetWomen] = useState(0);
  const [showMen, setShowMen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);


  const [nbAthletes, setNbAthletes] = useState(0);


  const [chosenMen, setChosenMen] = useState([]);
  const [chosenWomen, setChosenWomen] = useState([]);
  const [editDeadline, setEditDeadline] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  const [miniCompetitions, setMiniCompetitions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const [searchMenQuery, setSearchMenQuery] = useState(''); // State to track search input
  const [searchWomenQuery, setSearchWomenQuery] = useState(''); // State to track search input

  const [showLoginPopup, setShowLoginPopup] = useState(false);


  const navigate = useNavigate();

  const handleLoginTextClick = () => {
      setShowLoginPopup(true);
  };

  useEffect(() => {
    // Function to handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    // Attach the event listener to the window
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array means this effect runs once when the component mounts



  async function fetchEditDeadline() {    try {
    const db = getFirestore(app);

    // Reference to the Firestore document you want to create with a custom ID
    const deadlineCollection  = collection(db, config.DeadlinesColletion);

    const deadlineDocRef = doc(deadlineCollection, config.season)
    const docSnapshot = await getDoc(deadlineDocRef);
    
    if (docSnapshot.exists()) {
        const valuesArray = Object.values(docSnapshot.data()); // Get only the values as an array
        const filteredTimestamps = valuesArray.filter((timestamp) => timestamp.toDate() > new Date()
    ).map((timestamp) => timestamp.toDate());
        
        const newEditDeadline = new Date(Math.min.apply(null, filteredTimestamps));
        setEditDeadline(newEditDeadline); // Set the state variable
        
    } else {
        console.log('Error reading deadlines');
    }
} catch (error) {
    console.error('Error fetching or writing document: ', error);
}  }

  useEffect(() => {
    checkUserLoggedIn();
    fetchEditDeadline();

  }, []);

  const extractValue = (athleteName) => {
    const match = athleteName.match(/\((\d+)\)/); // This regex captures the number inside parentheses
    return match ? parseInt(match[1], 10) : 0;   // Return the number as an integer, or 0 if not found
  };
  
  useEffect(() => {
    const updateTimeRemaining = () => {
        if (editDeadline) {
            const now = new Date();
            const difference = editDeadline - now;

            if (difference < 0) {
                setTimeRemaining('Deadline is verstreken');
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeRemaining(`${days} dagen, ${hours} uur, ${minutes} minuten, ${seconds} seconden`);
            }
        }
    };

    // Update the time remaining immediately and then every second
    updateTimeRemaining();
    const intervalId = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(intervalId); // Clean up on unmount
}, [editDeadline]);
  
  useEffect(() => {
    // Calculate the sum by extracting the values from chosenMen
    const totalMenBudget = chosenMen.reduce((total, athleteName) => {
      const value = extractValue(athleteName); // Extract value from each athlete
      return total + value;
    }, 0);
  


    
    // You can also update state if needed
    setRemainingBudgetMen(initialBudget - totalMenBudget);
  }, [chosenMen]); // The effect runs every time chosenMen changes

  useEffect(() => {
    // Calculate the sum by extracting the values from chosenMen
    const totalWomenBudget = chosenWomen.reduce((total, athleteName) => {
      const value = extractValue(athleteName); // Extract value from each athlete
      return total + value;
    }, 0);
  
    
    // You can also update state if needed
    setRemainingBudgetWomen(initialBudget - totalWomenBudget);
  }, [chosenWomen]); // The effect runs every time chosenMen changes

  const handleMenSearchInputChange = (event) => {
    setSearchMenQuery(event.target.value); // Update the search query as the user types
  };

  const handleWomenSearchInputChange = (event) => {
    setSearchWomenQuery(event.target.value); // Update the search query as the user types
  };

  const handleRemoveAthlete = (gender, id) => {
    // Gebruik de bestaande checkbox functie om de atleet te verwijderen
    const event = {
        target: {
            id: id,
            value: 'placeholder'
        }
    };
    if (gender === 'men') {handleMenCheckboxChange(event);}
    else if (gender === 'women') {handleWomenCheckboxChange(event);}
};

  const handleMenCheckboxChange = (event) => {
    const { id, value } = event.target;

    setChosenMen((prevChosenMen) => {
      if (prevChosenMen.includes(id)) {
        // If the value is already selected, remove it (uncheck)
        return prevChosenMen.filter((athlete) => athlete !== id);
      } else if ( chosenMen.length < nbAthletes && remainingBudgetMen >= value){
        // If it's not selected, add it to the list (check)
        return [...prevChosenMen, id];
      }
      else {return prevChosenMen;}
    });


  };

  const handleWomenCheckboxChange = (event) => {
    const { id, value } = event.target;
    setChosenWomen((prevChosenWomen) => {
      if (prevChosenWomen.includes(id)) {
        // If the value is already selected, remove it (uncheck)
        return prevChosenWomen.filter((athlete) => athlete !== id);
      } else if ( chosenWomen.length < nbAthletes && remainingBudgetWomen >= value){
        // If it's not selected, add it to the list (check)
        return [...prevChosenWomen, id];
      }
      else {return prevChosenWomen;}
    });  };

  const handleTeamNameChange = (e) => {
    setTeamName(e.target.value);
  };

  function handleSaveTeam() {
    if (teamName.length == 0) {alert('Gelieve een teamnaam in te vullen');}

    if (remainingBudgetMen < 0 || remainingBudgetWomen < 0) {
      alert('U hebt te veel geld uitgeven. Kies atleten die binnen uw budget vallen.');
    } else {
      if (nbAthletes !=  chosenMen.length || nbAthletes != chosenWomen.length) {
        alert('Gelieve exact 8 manneljke en 8 vrouwelijke atleten te selecteren.');
      } else {
        send_data();
      }
    }
  }
  
  async function check_team_name(teamName) {
    const db = getFirestore(app);
    const collectionRef = collection(db, config.TakenTeamNamesCollection);
    const docId = teamName;
  
    const docRef = doc(collectionRef, docId);
    try {
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
        // console.log("exists already");
        // Document with the specified ID exists
        return false;
      } else {
        // Document with the specified ID does not exist
        return true;
      }
    } catch (error) {
      console.error('Error checking document existence:', error);
      return false;
    }
  }
  
  
  function send_data() {
    let userEmail;
    if (auth.currentUser) {
      // User is signed in, you can access the user's email like this:
      userEmail = auth.currentUser.email;
    } else {
      alert('Log in om een team te selecteren.');
      return;
    }
  
    // Get a Firestore reference
    const db = getFirestore(app);
  
    const data = [];
    const currentDate = new Date();
  
    const team_name = teamName
    // data.push(written_data[0].value.toLowerCase().trimEnd());
    // data.push(written_data[1].value.trimEnd());
  
  
    const dataToAdd = {
      date: currentDate,
      user: userEmail,
      team_name: team_name,
      men_athletes: chosenMen,
      women_athletes: chosenWomen,
      mini_competitions: miniCompetitions,
      BerlareOpstelling: {
        men: chosenMen.slice(0, 6),
        women: chosenWomen.slice(0, 6),
      },
      RoeselareOpstelling: {
        men: chosenMen.slice(0, 6),
        women: chosenWomen.slice(0, 6),
      },
      HulshoutOpstelling: {
        men: chosenMen.slice(0, 6),
        women: chosenWomen.slice(0, 6),
      },
      HannuitOpstelling: {
        men: chosenMen.slice(0, 6),
        women: chosenWomen.slice(0, 6),
      },
      DiestOpstelling: {
        men: chosenMen.slice(0, 6),
        women: chosenWomen.slice(0, 6),
      },
      editDeadline: editDeadline
    };
  
    // Reference to the Firestore collection you want to write to
    const usersDocRef = collection(db, config.UserCollection);
  
    // Reference to the Firestore document you want to create with a custom ID
    const customDocRef = doc(usersDocRef, userEmail);
  
    // Check if the document already exists
    getDoc(customDocRef)
        .then((docSnapshot) => {
          const currentDate = new Date();
  
          if (docSnapshot.exists()) {
            // The document already exists
            const userData = docSnapshot.data();
            const editDeadline = userData.editDeadline.toDate();
  
  
            if (currentDate <= editDeadline) {
              const shouldEdit = true; //confirm('Bent u zeker dat u uw team wil aanpassen?');
  
  
              if (shouldEdit) {
                dataToAdd.editDeadline = editDeadline;
  
                const old_team_name = userData.team_name;
                if (team_name != old_team_name) {
                  check_team_name(team_name)
                      .then((isAvailable) => {
                        if (isAvailable) {
                          const teamsCollectionRef = collection(db, config.TakenTeamNamesCollection);
                          const newTeamRef = doc(teamsCollectionRef, team_name);
                          // Add an empty document with the specified ID
                          setDoc(newTeamRef, {})
                              .then(() => {
                                console.log('succes');
                              })
                              .catch((error) => {
                                console.error('Error adding document: ', error);
                              });
                          const oldDocRef = doc(teamsCollectionRef, old_team_name);
  
                          deleteDoc(oldDocRef)
                              .then(() => {
                              })
                              .catch((error) => {
                                console.error('Error deleting document:', error);
                              });
  
                          setDoc(customDocRef, dataToAdd)
                              .then(() => {
                                navigate('/Opstelling'); 
                              })
                              .catch((error) => {
                                console.error('Error adding document with custom ID (email): ', error);
                              });
                        } else {
                          const teamNameInput = document.getElementById('teamname');
                          if (teamNameInput) {
                            teamNameInput.value = old_team_name;
                          }
                          alert('Uw team naam is niet beschikbaar');
                        }
                      })
                      .catch((error) => {
                        console.error('Error checking team name availability:', error);
                      });
                } else {
                  setDoc(customDocRef, dataToAdd)
                      .then(() => {
                        // console.log("Document with custom ID (email) written successfully: ", userEmail);
                        navigate('/Opstelling'); 
                      })
                      .catch((error) => {
                        console.error('Error adding document with custom ID (email): ', error);
                      });
                }
              } else {
                // User canceled, no action needed
                console.log('User canceled editing');
              }
            } else {
              alert('Het is te laat om uw team nog aan te passen!');
            }
          } else {
            check_team_name(team_name)
                .then((isAvailable) => {
                  if (isAvailable) {
   
                    // Reference to the Firestore document you want to create with a custom ID
    
                        const teamsCollectionRef = collection(db, config.TakenTeamNamesCollection);
                        const newTeamRef = doc(teamsCollectionRef, team_name);
                        // Add an empty document with the specified ID
                        setDoc(newTeamRef, {})
                            .then(() => {
                              console.log('succes');
                            })
                            .catch((error) => {
                              console.error('Error adding document: ', error);
                            });
                        setDoc(customDocRef, dataToAdd)
                            .then(() => {
                              // console.log("Document with custom ID (email) written successfully: ", userEmail);
                                navigate('/Opstelling'); 
                            })
                            .catch((error) => {
                              console.error('Error adding document with custom ID (email): ', error);
                            });

                    }
                   else {
                    alert('Uw team naam is niet beschikbaar');
                  }
                })
                .catch((error) => {
                  console.error('Error checking team name availability:', error);
                });
          }
        })
        .catch((error) => {
          console.error('Error checking if the document exists: ', error);
        });
  }
  

  const checkUserLoggedIn = () => {
    const db = getFirestore(app);
    const yourCollectionRef = collection(db, config.UserCollection);

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in
        setIsLoggedIn(true); // Set user as logged in
        const userEmail = user.email;
        const customDocRef = doc(yourCollectionRef, userEmail);

        getDoc(customDocRef)
          .then(async (docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              const { team_name, men_athletes, women_athletes, editDeadline: deadline, mini_competitions } = userData;
              
              setTeamName(team_name);
              setChosenMen(men_athletes || []);
              setChosenWomen(women_athletes || []);
              setEditDeadline(deadline.toDate());
              setMiniCompetitions(mini_competitions || []);

            } else {
                
              setMiniCompetitions([]);
            }
          })
          .catch((error) => {
            console.error('Error reading document:', error);
          });
      } else {
        // User is not logged in
        setIsLoggedIn(false);    
          
      }
    });
    
  };

    // Function to fetch and display athlete data from Firestore
    useEffect(() => {
        const db = getFirestore(app);
    
        const fetchAthleteData = async () => {
            const docRef = doc(db, config.AthletesCollection, config.season); // Replace 'your_collection_name' with actual collection
            
            try {
              const docSnapshot = await getDoc(docRef);
              if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                setInitialBudget(userData.budget);
                setRemainingBudgetMen(userData.budget);
                setRemainingBudgetWomen(userData.budget);

                setNbAthletes(userData.numberOfAthletes);
    
                // Sort men and women athletes based on the values (descending order)
                const sortedMenArray = Object.entries(userData.men).sort((a, b) => b[1] - a[1]);
                setMenAthletes(sortedMenArray);
                const sortedWomenArray = Object.entries(userData.women).sort((a, b) => b[1] - a[1]);
                setWomenAthletes(sortedWomenArray);
              } else {
                console.error('No such document!');
              }
            } catch (error) {
              console.error('Error fetching athlete data:', error);
            }
          
        };
    
        fetchAthleteData();
      }, []);

  return (
    <div>
      {/* Navigatie-bar */}
      <Headbar highlightedLink="Team" />

      <div id="full-container">
        <div className='PaginaTitel' style={{padding: '0.2em', fontSize: '2em',backgroundColor: 'var(--darkcolor)', color: 'white', margin: '0px', marginBottom: '0.4em' }}>
         {editDeadline && (     
                    <div>
                      <span>
                        Deadline: <br/> {timeRemaining} {/* Weergeven van het verschil */}
                      </span>
                    </div>
                )}
        
        </div>
        <label className='subtitel' style={{ marginTop: '1em' }} htmlFor="teamname">Vul hier je teamnaam in:</label>
        <div className="form-container">
          <div className="form-group">
            
            <input
              type="text"
              className="form-control form-data"
              id="teamname"
              value={teamName}
              onChange={handleTeamNameChange}
            />
          </div>

          <div className="form-group" style={{ justifyContent: 'center', width: '50%' }}>
            <button type="button" className="btn btn-primary" onClick={handleSaveTeam}>
              Team voorlopig opslaan
            </button>
          </div>
        </div>

        <div className="subtitel" id="subtitel">    
            {isLoggedIn ? (
                <>
                Maak je favoriete crosscup team! Lees zeker ook het 
                <Link to="/Reglement" style={{ color: 'var(--accentcolor)' }}> reglement </Link> 
                en bekijk de puntentelling!
            </>
            ) : (
                <>
                    <span style={{ color: 'red' }}>
                        
                        <span 
                            style={{ cursor: 'pointer', textDecoration: 'underline' }} 
                            onClick={handleLoginTextClick}
                        >
                             Gelieve in te loggen om een team te maken.  
                        </span>
                    </span>
                </>
            )}
            {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />} {/* Render the popup */}
        </div>


        <div>
          {isMobile && <button style={showMen ? { backgroundColor: 'var(--accentcolor)', color: 'white' } : {}} className='selectorButton' onClick={() => setShowMen(true)}> Mannen  </button>}
         {isMobile && <button style={!showMen ? { backgroundColor: 'var(--accentcolor)', color: 'white' } : {}} className='selectorButton' onClick={() => setShowMen(false)}>Vrouwen</button>}
        </div>
        <div id="team-container" className="container" style={{ justifyContent: 'space-around', padding: '0%' }}>
          {/* Kolom1: Alles van Mannen */}
          {!(isMobile && !showMen) &&<ul id="middle" className="column men">
            <h5 id="budgetmen">Budget mannen: {remainingBudgetMen}</h5>
            <div className="gekozenteam">
            {Array.from({ length: nbAthletes }, (_, index) => (
                <h6 key={index} className="chosen-athlete">
                    {chosenMen[index] || "Kies een atleet"} {/* Vult lege slots met "Kies een atleet" */}
                    {chosenMen[index] && (
                        <span 
                            style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }} 
                            onClick={() => handleRemoveAthlete('men',chosenMen[index])} // hier kun je de waarde aanpassen
                        >
                            ❌ {/* Of je kunt hier een afbeelding van een kruisje gebruiken */}
                        </span>
                    )}
                </h6>
            ))}
        </div>
            <ul id="formleft" className="zoek-container">
              <input
                type="text"
                className="zoekatleet"
                id="myMenInput"
                placeholder="Zoek atleten..."
                title="Type in a name"
                value={searchMenQuery}
                onChange={handleMenSearchInputChange} // Handle search input change
              />
              {menAthletes.filter(([name, value]) =>
                    name.toLowerCase().includes(searchMenQuery.toLowerCase()) || value.toString().includes(searchMenQuery)
                ).map(([name, value], index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    name="menAthlete"
                    value={value}
                    id={`${name} (${value})`}
                    checked={chosenMen.includes(`${name} (${value})`)} // Check if the athlete is in chosenMen

                    onChange={handleMenCheckboxChange}
                  />
                  <label htmlFor={`${name} (${value})`}>
                    <a href={`https://worldathletics.org/search/?q=${name.replace(/ /g, '+')}`} target="_blank" rel="noreferrer">
                      {name} 
                    </a>
                  </label>
                  <div style={{marginLeft:"auto"}}>{value}M</div>
                </li>
              ))}
            </ul>
            </ul>}

          {/* Kolom2: Alles van Vrouwen */}
          {!(isMobile && showMen) && <ul id="middle" className="column women">
            <h5 id="budgetwomen">Budget vrouwen: {remainingBudgetWomen}</h5>
            <div className="gekozenteam">
                {Array.from({ length: nbAthletes }, (_, index) => (
                    <h6 key={index} className="chosen-athlete-women">
                    {chosenWomen[index] || "Kies een atlete"} {/* Fills empty slots with "Atleet" */}
                    {chosenWomen[index] && (
                        <span 
                            style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }} 
                            onClick={() => handleRemoveAthlete('women',chosenWomen[index])} // hier kun je de waarde aanpassen
                        >
                            ❌ {/* Of je kunt hier een afbeelding van een kruisje gebruiken */}
                        </span>
                    )}
                    </h6>
                ))}
                </div>

            <ul id="formright" className="zoek-container">
              <input
                type="text"
                className="zoekatleet"
                id="myWomenInput"
                placeholder="Zoek atleten..."
                title="Type in a name"
                value={searchWomenQuery}
                onChange={handleWomenSearchInputChange} // Handle search input change
              />
              {womenAthletes.filter(([name, value]) =>
                    name.toLowerCase().includes(searchWomenQuery.toLowerCase()) || value.toString().includes(searchWomenQuery)
                ).map(([name, value], index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    name="womenAthlete"
                    value={value}
                    id={`${name} (${value})`}
                    onChange={handleWomenCheckboxChange}
                    checked={chosenWomen.includes(`${name} (${value})`)} // Check if the athlete is in chosenMen

                  />
                  <label htmlFor={`${name} (${value})`}>
                    <a href={`https://worldathletics.org/search/?q=${name.replace(/ /g, '+')}`} target="_blank" rel="noreferrer">
                      {name} ({value})
                    </a>
                  </label>
                  <div style={{marginLeft:"auto"}}>{value}M</div>
                </li>
              ))}
            </ul>
          </ul>}
        </div>
      </div>
    </div>
  );
};

export default Team;
