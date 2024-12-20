import React from 'react';
import Headbar from '../common/Headbar'; 
import '../../styles/styles.css'; 
import { Link } from 'react-router-dom';


function Home() {


  return (
    <div>
      <Headbar highlightedLink="index" />
      {/* HomeBanner */}
      <div className="homebanner">
        <div className="home-message" style={{ color: 'white', paddingTop: '13%' }}>
          <div className="subtitel-home" style={{ color: 'white', textAlign: 'left' }}>
            CROSSCUPMANAGER
          </div>
          <div className="textbox" style={{ color: 'white', marginLeft: '0px', fontSize: '2vh', marginTop: '0' }}>
            Selecteer jouw veldloopteam voor komende winter! Je krijgt een budget van 50M om te investeren in 8 atleten. 
            Jouw atleten verzamelen punten in verschillende Crosscup-wedstrijden en het BK veldlopen.
          </div>
          <Link to="/Team" className="maak-team" style={{ textDecoration: 'none' }}>
          Selecteer jouw team
        </Link>

        </div>
      </div>

      <div className="headunderliner"></div>   

      {/* Extra Homebanner */}
      <div className="stapplan" style={{ width: '100%' }}> 
        <div className="stapkaart">
          <div className="subtitel-home">Reglement</div>
          <div className="stap1 stapkaartfoto"></div>
          <div className="textbox" style={{ fontSize: '2em', marginTop: '0' }}>
            Een goede manager kent de regels van het spel. Bekijk deze zeker eens bij het 
            <Link to="/Reglement" style={{ color: 'var(--accentcolor)' }}> Reglement </Link>. 
            De puntenverdeling is cruciaal voor je selectie-tactiek!
        </div>
        </div>

        <div className="stapkaart">
          <div className="subtitel-home">Onderzoek</div>
          <div className="stap2 stapkaartfoto"></div>
          <div className="textbox" style={{ fontSize: '2em', marginTop: '0' }}>
            Speur op Strava naar de revelatie van het veldloop-seizoen! Wanneer pieken de toppers? Als Atletiek-Freak onderscheid je jezelf hier.
          </div>
        </div>

        <div className="stapkaart">
          <div className="subtitel-home">Selectie</div>
          <div className="stap3 stapkaartfoto"></div>
          <div className="textbox" style={{ fontSize: '2em', marginTop: '0' }}>
            Spendeer je budget slim en zoek balans tussen ervaren toppers en jong talent! Een buikgevoel zegt meer dan honderd berekeningen.
          </div>
        </div>
      </div>

      {/* Voeg je Firebase script toe (indien nodig via React) */}
      <script type="module" src="../../Javascript/firebaseInit.js"></script>
    </div>
  );
}

export default Home;