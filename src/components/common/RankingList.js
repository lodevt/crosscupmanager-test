// src/components/RankingList.js
import React from 'react';
import '../../styles/styles.css'; 
import WomenSymbol from '../../Images/WomenSymbol.png'; 

import MenSymbol from '../../Images/MenSymbol.png'; 


const RankingList = ({ rankingData, filter }) => {
  const filteredRanking = rankingData.filter(item =>
    item.name.toUpperCase().includes(filter.toUpperCase())
  );

  return (
    <div className="klassement-container">
      <ul id="klassement">
        {filteredRanking.map((item, index) => {
          const { place, name, pointsMen, pointsWomen, menTeam, womenTeam } = item;

          const resultContainer = <div className="resultcontainer" key={index}>
          <div className="team-name">{place} {name}</div>
          <div className="team-points">{pointsMen+pointsWomen}</div>
          </div>

          const teamContainer =  <div className="teamcontainer">
            <div className="geslachtcontainer">
              <div className="symbool">
              <img src={MenSymbol} alt="Men Symbol" />
              <div className='deeltotaal'> {pointsMen} Punten</div>
              </div>
              <div className='deelteamresult'>
              <div>
                  {menTeam.map((item, index) => (
                      <div key={index}>{item}</div>
                  ))}
                  </div>
                  </div>
            </div>
            <div className="geslachtcontainer">
              <div className="symbool">
              <img src={WomenSymbol} alt="Women Symbol" />
              <div className='deeltotaal'> {pointsWomen} Punten</div>
              </div>
              <div className='deelteamresult'>
              <div>
                  {womenTeam.map((item, index) => (
                      <div key={index}>{item}</div>
                  ))}
                  </div>
                  </div>
            </div>
        </div>

          return (
            <li key={index}>
              <>
                {resultContainer}
                {teamContainer}
              </>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RankingList;
