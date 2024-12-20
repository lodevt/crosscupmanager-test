// src/pages/RankingPage.js
import React, { useEffect, useState } from 'react';
import '../../styles/styles.css'; 
import { getFirestore, collection, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';
import { app, config } from '../../Javascript/config.js'; 
import Headbar from '../common/Headbar.js';
import RankingList from '../common/RankingList.js'; 

const Klassement = () => {
  const [filter, setFilter] = useState('');
  const [selectedRace, setSelectedRace] = useState('Totaal');
  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {
    const fetchRankingData = async (docRaceId) => {
      try {
        const db = getFirestore(app);
        const collectionRef = collection(db, config.StandingsCollection);
        const docRef = doc(collectionRef, docRaceId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const klassementData = docSnapshot.data().standing;
          const emailValuePairs = Object.entries(klassementData);

          // Sort the array by values in descending order
          emailValuePairs.sort((a, b) => b[1]['men'] + b[1]['women'] - (a[1]['men'] + a[1]['women']));

          const klassement = emailValuePairs.map((entry, index) => ({
            place: index + 1,
            name: entry[1]['team_name'],
            pointsMen: entry[1]['men'],
            pointsWomen: entry[1]['women'],
            menTeam: entry[1]['men-team'],
            womenTeam: entry[1]['women-team'],
          }));

          setRankingData(klassement);
        } else {
          setRankingData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRankingData('Totaal'); // Default to 'Totaal' on initial load

    const raceSelector = document.getElementById('raceSelector');
    const handleRaceChange = (e) => {
      const race = e.target.value;

      fetchRankingData(race);
      setSelectedRace(race);
    };

    raceSelector.addEventListener('change', handleRaceChange);
    
    return () => {
      raceSelector.removeEventListener('change', handleRaceChange);
    };
  }, []);

  return (
    <div>
      <head>
        <title>CrosscupManager Klassement</title>
        <link rel="icon" href="Images/Crosscupmanager.png" type="image/x-icon" />
      </head>
      <Headbar highlightedLink="Klassement" />
      <div className="paginaTitel">Klassement vorige editie</div>
      <div className="select-container">
        <input
          type="text"
          className="form-control selectorRaces"
          style={{ marginRight: '20%' }}
          id="AllTeams"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Zoek teams..."
          title="Type in a name"
        />
        <select className="selectorRaces" id="raceSelector" value={selectedRace}>
          <option className="filterButton" value="Totaal">Totaal</option>
          <option className="filterButton" value="Berlare">Berlare</option>
          <option className="filterButton" value="Roeselare">Roeselare</option>
          <option className="filterButton" value="Hulshout">Hulshout</option>
          <option className="filterButton" value="Hannuit">Hannuit</option>
          <option className="filterButton" value="Diest">Diest</option>
        </select>
      </div>
      <RankingList rankingData={rankingData} filter={filter} /> {}
    </div>
  );
};

export default Klassement;
