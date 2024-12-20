import React, { useEffect, useState } from 'react';
import '../../styles/styles.css'; 
import '../../styles/mini_competition.css'
import { getFirestore, collection, doc, getDoc, updateDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';
import { app, config,auth } from '../../Javascript/config.js'; 
import Headbar from '../common/Headbar.js';
import RankingList from '../common/RankingList.js'; 
import InviteComponent from '../common/InviteComponent.js';
import { useNavigate } from 'react-router-dom';


const MiniCompetition = () => {
  const [miniCompetitions, setMiniCompetitions] = useState([]);
  const [selectedComp, setSelectedComp] = useState('');
  const [minicompetitionMap, setMinicompetitionMap] = useState(new Map());

  const [selectedRace, setSelectedRace] = useState('Totaal');
  const [rankings, setRankings] = useState([]);
  const [inviteUrl, setInviteUrl] = useState('');
  const navigate = useNavigate();
    // Firestore and authentication
    const db = getFirestore(app);

  
    useEffect(() => {
      // Load mini competitions on component mount
      loadMiniComp();
    }, []);

    useEffect(() => {
      // Load mini competitions on component mount
      updateStandings(selectedRace);

    }, [selectedRace, selectedComp]);

    // Check for invite link when the component mounts
    useEffect(() => {
      const checkForInviteLink = async () => {
        console.log(window.location.href);
          const minicomp = new URL(window.location.href).searchParams.get('minicomp');
          const action = new URL(window.location.href).searchParams.get('action');
          if (action === 'join') {
              // Set the mini competition value in the state
              await joinMiniComp(minicomp); // Call the join function with the miniComp
              navigate('/MiniCompetitie');
              console.log('join nav');
          }


      };

      checkForInviteLink();
  }, []); // Empty dependency array means this runs once when the component mounts



    const loadMiniComp = () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userEmail = user.email;
          const userDocRef = doc(collection(db, config.UserCollection), userEmail);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const miniComps = userData.mini_competitions || [];
            
            // Populate the selector options and the minicompetition map
            const loadedComps = [];
            // Use map to create an array of promises
            const promises = miniComps.map(async (miniComp) => {
              const miniCompDocRef = doc(collection(db, config.MiniCompetitionsCollection), miniComp);
              const miniCompDoc = await getDoc(miniCompDocRef);
              if (miniCompDoc.exists()) {
                const miniCompData = miniCompDoc.data();
                minicompetitionMap.set(miniCompData.name, miniCompData.participants);
                loadedComps.push(miniCompData.name); // This will now correctly push after the data is fetched
                
              }
            });

            // Use Promise.all to wait for all the promises to resolve
            await Promise.all(promises);

            setMiniCompetitions(loadedComps);
            if (selectedComp === '') {
              setSelectedComp(loadedComps[0]);}
          }
        }
      });
    };


      // Function to handle joining a mini competition
      const joinMiniComp = async (miniCompInput) => {
        if (!miniCompInput) return;
    
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userDocRef = doc(collection(db, config.UserCollection), user.email);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const miniComps = userData.mini_competitions || [];
                    
                    if (!miniComps.includes(miniCompInput)) {
                        const miniCompRef = doc(collection(db, config.MiniCompetitionsCollection), miniCompInput);
                        const miniCompDoc = await getDoc(miniCompRef);
                        if (miniCompDoc.exists()) {
                            const participants = miniCompDoc.data().participants || []; // Ensure participants is an array
                            participants.push(user.email);
    
                            // Update both user and mini competition documents
                            await updateDoc(miniCompRef, { participants });
                            miniComps.push(miniCompInput);
                            await updateDoc(userDocRef, { mini_competitions: miniComps });
    
                            loadMiniComp();
                            setSelectedComp(miniCompInput);
                        } else {
                            alert('This mini competition does not exist.');
                        }
                    } else {
                        alert('You are already part of this mini competition!');
                    }
                }
            }
        });
    };
    

  async function createMiniComp() {
  
    const inputField = document.getElementById('minicompetition-input-maak');
    const miniComp = inputField.value;
  
    auth.onAuthStateChanged((user) => {
      if (user) {
        const db = getFirestore(app);
        const collectionRef = collection(db, config.MiniCompetitionsCollection);
  
        // Check if the mini-competition already exists
        getDoc(doc(collectionRef, miniComp))
            .then((docSnapshot) => {
              if (docSnapshot.exists()) {
                alert('Deze minicompetitie bestaat al. Kies een andere naam.');
              } else {
                // Mini-competition doesn't exist; create a new one
                const newMiniCompData = {
                  name: miniComp,
                  owner: user.email,
                  participants: [user.email], // Add the creator as the first participant
                };
  
                // Add the new mini-competition document
                setDoc(doc(collectionRef, miniComp), newMiniCompData)
                    .then(() => {
                      const userCollectionRef = collection(db, config.UserCollection);
                      const UserDocRef = doc(userCollectionRef, user.email);
  
                      getDoc(UserDocRef).then((docSnapshot) => {
                        if (docSnapshot.exists()) {
                          const userData = docSnapshot.data();
                          // Check if "participants" field is already there or is an array; if not, initialize it as an empty array
                          if (!userData.mini_competitions) {
                            userData.mini_competitions = [];
                          } else {
                            if (userData.mini_competitions.includes(miniComp)) {
                              alert('Je bent al lid van deze minicompetitie!');
                              return;
                            }
                          }
                          userData.mini_competitions.push(miniComp);
                          // Update the Firestore document with the modified "participants" array
                          const dataToUpdate = {'mini_competitions': userData.mini_competitions};
                          // Use the updateDoc function with merge: true
                          updateDoc(UserDocRef, dataToUpdate, {merge: true})
                              .then(() => {
                                alert('Je hebt succesvol een nieuwe minicompetitie aangemaakt!');
                                setSelectedComp(miniComp);
                                loadMiniComp();

                              })
                              .catch((error) => {
                                console.error('Error updating document: ', error);
                              });
                        } else {
                          alert('Deze minicompetitie bestaat niet.');
                        }
                      });
                    })
                    .catch((error) => {
                      alert('Er is een fout opgetreden bij het aanmaken van de minicompetitie.');
                    });
              }
            });
      } else {
        alert('Gelieve in te loggen.');
      }
    });
  }


  
  const leaveMiniComp = async () => {

    auth.onAuthStateChanged(async (user) => {
      
        if (user) {
            const userDocRef = doc(collection(db, config.UserCollection), user.email);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const miniComps = userData.mini_competitions || [];

                if (miniComps.includes(selectedComp)) {
                    const miniCompRef = doc(collection(db, config.MiniCompetitionsCollection), selectedComp);
                    const miniCompDoc = await getDoc(miniCompRef);
                    if (miniCompDoc.exists()) {
                        const participants = miniCompDoc.data().participants;
                        const updatedParticipants = participants.filter(participant => participant !== user.email);

                        // Update both user and mini competition documents
                        await updateDoc(miniCompRef, { participants: updatedParticipants });
                        const updatedMiniComps = miniComps.filter(comp => comp !== selectedComp);
                        await updateDoc(userDocRef, { mini_competitions: updatedMiniComps });

                        loadMiniComp();
                    } else {
                        alert('This mini competition does not exist.');
                    }
                } else {
                    alert('You are not part of this mini competition!');
                }
            }
        }
    });
};

  


    const updateStandings = async (docRaceId) => {
      const emailsToInclude = minicompetitionMap.get(selectedComp);
      const docRef = doc(collection(db, config.StandingsCollection), docRaceId);
      const docSnapshot = await getDoc(docRef);
  
      
if (docSnapshot.exists() && emailsToInclude) { // TODO set back to show current standings
        const standingsData = docSnapshot.data().standing;
        const filteredStandings = Object.entries(standingsData)
        .filter(([email]) => emailsToInclude.includes(email))
        .sort(([, dataA], [, dataB]) => (dataB.men + dataB.women) - (dataA.men + dataA.women))
        .map(([, data], index) => ({
          place: index + 1,
          name: data.team_name,
          pointsMen: data.men,
          pointsWomen: data.women,
          menTeam: data['men-team'],
          womenTeam: data['women-team'],
        }));
        setRankings(filteredStandings);
      } else /*if (emailsToInclude) {
        const _ranking = emailsToInclude
        .map(email => ({
          place: 1,
          name: email,
          pointsMen: 0,
          pointsWomen: 0,
          menTeam: [],
          womenTeam: [],
        }));
      setRankings(_ranking);}
        else */{
        setRankings([]);
      }
  
      // Generate the invite URL
      const baseInviteUrl = 'https://www.crosscupmanager.be/Minicompetitie.html';
      const params = new URLSearchParams();
      params.append('minicomp', selectedComp);
      params.append('action', 'join');
      setInviteUrl(`${baseInviteUrl}?${params.toString()}`);
    };


  return (
    <div>
        <Headbar highlightedLink="Minicompetitie" />

      {/* Title */}
      <div className="paginatitel">Mini-competities</div>

      {/* Selectors */}
      <div className="select-container">
      <select
            className="selectorRaces"
            id="raceSelector"
            value={selectedRace}
            onChange={(e) => setSelectedRace(e.target.value)}
        >
            <option className="filterButton" key="Totaal" value="Totaal">Totaal</option>
            <option className="filterButton" key="Berlare" value="Berlare">Berlare</option>
            <option className="filterButton" value="Roeselare">Roeselare</option>
            <option className="filterButton" value="Hulshout">Hulshout</option>
            <option className="filterButton" value="Hannuit">Hannuit</option>
            <option className="filterButton" value="Diest">Diest</option>
        </select>

        <select
        className="form-control selectorRaces" 
        id="minicompetitionSelector"
        value={selectedComp}
        onChange={(e) => setSelectedComp(e.target.value)}
      >
        {miniCompetitions.map((comp) => (
          <option key={comp} value={comp}>{comp}</option>
        ))}
      </select>
      </div>

      {/* Join competition */}
      <div className="minicompetition-search">
    <input
        type="text"
        className="minicompetition-input"
        id="minicompetition-input"
        placeholder="Zoek een bestaande minicompetitie"
    />
<button 
    className="minicompetition-button" 
    id="search-button" 
    onClick={() => joinMiniComp(document.getElementById('minicompetition-input').value)} // Pass the current input value as an argument
>
    Join
</button>

</div>


      {/* Create competition */}
      <div className="minicompetition-search">
        <input
          type="text"
          className="minicompetition-input"
          id="minicompetition-input-maak"
          placeholder="Maak een minicompetitie"
        />
            <button className="minicompetition-button" id="maak-button" onClick={createMiniComp}>
                Creëer
            </button>      
      </div>

      {/* Standings */}
      <RankingList rankingData={rankings} filter={''} /> {}


      {/* Leave competition button */}
      {miniCompetitions.length && <button
        id="verlaat-button"
        className="verlaat-button-style"
        onClick={leaveMiniComp} // Add onClick handler
      >
        Verlaat minicompetitie
      </button>}

        {miniCompetitions.length && false && <InviteComponent inviteUrl={inviteUrl} />}

    </div>
  );
};

export default MiniCompetition;
