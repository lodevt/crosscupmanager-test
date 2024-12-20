import React from 'react';
import Headbar from '../common/Headbar'; 
import '../../styles/styles.css'; 
import Berlare from '../../Images/Berlare.jpg';
import Roeselare from '../../Images/Roeselare.jpg';
import Hulshout from '../../Images/Hulshout.jpg';
import Hannuit from '../../Images/Hannuit.jpg';
import Diest from '../../Images/Diest.jpg';

const Kalender = () => {
  return (
    <div>
      <Headbar highlightedLink="Kalender" />
      <div className="paginaTitel">Kalender</div>
      <div className="raster">
        <div className="wedstrijdbox">
          <div className="wedstrijdfoto" style={{ backgroundImage: `url(${Berlare})` }}>
            <div className="vorigeresults">
              <div className="subtitel2">Vorige editie:</div>
              <div className="container">
                <div className="kolom">
                  <div>Mannen:</div>
                  <div>1. RockNRun</div><div>2. DCLA</div><div>3. LYRA</div><div>4. hERVE</div><div>5. EA</div>
                  <div>6. RCG</div><div>7. ROBA</div><div>8. ACHL</div><div>9. ACME</div><div>10. USBW</div>
                </div>
                <div className="kolom">
                  <div>Vrouwen:</div>
                  <div>1. ChAnMa</div><div>2. ACW</div><div>3. ACME</div><div>4. JuLaJu</div><div>4. ACHL</div><div>5. ALVA</div>
                  <div>7. LOOISE</div><div>8. AVR</div><div>9. RESC</div><div>10. EA</div>
                </div>
              </div>
            </div>
            <div className="wedstrijdnaam">Crosscup Berlare</div>
            <div className="wedstrijddatum">20/10/2024</div>
          </div>
          <a href="https://crosscup.be/nl/berlare/" target="_blank" rel="noopener noreferrer">Meer info</a>
          <a href="https://www.runningresults.be/resultaten/2023ccberlareresultnl" target="_blank" rel="noopener noreferrer">Resultaten 2023</a>
        </div>

        <div className="wedstrijdbox">
          <div className="wedstrijdfoto" style={{ backgroundImage: `url(${Roeselare})` }}>
            <div className="vorigeresults">
              <div className="subtitel2">Vorige editie:</div>
              <div className="container">
                <div className="kolom">
                  <div>Mannen:</div>
                  <div>1. Kimeli</div><div>2. Heymans</div><div>3. Hendrix</div><div>4. Grimard</div><div>5. Vanderpoorten</div>
                  <div>6. Hannes</div><div>7. Boulvin</div><div>8. Van De Kerkhove</div><div>9. Deflandere</div><div>10. Somers</div>
                </div>
                <div className="kolom">
                  <div>Vrouwen:</div>
                  <div>1. Van Lent</div><div>2. Thomas</div><div>3. Van Accom</div><div>4. Warpy</div><div>5. Voet</div>
                  <div>6. Bihain</div><div>7. Truyers</div><div>8. Vandenbussche</div><div>9. Godden</div><div>10. Bilo M.</div>
                </div>
              </div>
            </div>
            <div className="wedstrijdnaam">Crosscup Roeselare</div>
            <div className="wedstrijddatum">27/10/2024</div>
          </div>
          <a href="https://crosscup.be/nl/roeselare/" target="_blank" rel="noopener noreferrer">Meer info</a>
          <a href="https://www.runningresults.be/resultaten/2023ccroeselareresultnl" target="_blank" rel="noopener noreferrer">Resultaten 2023</a>
        </div>

        <div className="wedstrijdbox">
          <div className="wedstrijdfoto" style={{ backgroundImage: `url(${Hulshout})` }}>
            <div className="vorigeresults">
              <div className="subtitel2">Vorige editie:</div>
              <div className="container">
                <div className="kolom">
                <div>Mannen:</div>
                  <div>1. Grimard</div><div>2. Kimeli</div><div>3. Saké</div><div>4. Vanderpoorten</div><div>5. Camphes</div>
                  <div>6. Van De Velde</div><div>7. Crickillon</div><div>8. Konteh</div><div>9. Hamid Fagi</div><div>10. Reul</div>
                </div>
                
                <div className="kolom">
                  <div>Vrouwen:</div>
                  <div>1. Herbiet</div><div>2. Thomas</div><div>3. Rooms</div><div>4. Van Lent</div><div>5. Van Accom</div>
                  <div>6. Warpy</div><div>7. Truyers</div><div>8. Bihain</div><div>9. Voet</div><div>10. Bilo M.</div>
                </div>
              </div>
            </div>
            <div className="wedstrijdnaam">Crosscup Hulshout</div>
            <div className="wedstrijddatum">17/11/2024</div>
          </div>
          <a href="https://crosshulshout.be/nl" target="_blank" rel="noopener noreferrer">Meer info</a>
          <a href="https://www.runningresults.be/resultaten/2023bkveldlopenuitslagnl" target="_blank" rel="noopener noreferrer">Resultaten 2023</a>
        </div>

        <div className="wedstrijdbox">
          <div className="wedstrijdfoto" style={{ backgroundImage: `url(${Hannuit})` }}>
            <div className="vorigeresults">
              <div className="subtitel2">Vorige editie:</div>
              <div className="container">
                <div className="kolom">
                  <div>Mannen:</div>
                  <div>1. Grimard</div><div>2. Kimeli</div><div>3. Saké</div><div>4. Vanderpoorten</div><div>5. Camphes</div>
                  <div>6. Van De Velde</div><div>7. Crickillon</div><div>8. Konteh</div><div>9. Hamid Fagi</div><div>10. Reul</div>
                </div>
                <div className="kolom">
                  <div>Vrouwen:</div>
                  <div>1. Van Lent</div><div>2. Warpy</div><div>3. Bihain</div><div>4. Van Accom</div><div>5. Truyers</div>
                  <div>6. Cleppe</div><div>7. Taschimowitz</div><div>8. De Schaepmeester</div><div>9. Voet</div><div>10. Van Proeyen</div>
                </div>
              </div>
            </div>
            <div className="wedstrijdnaam">Crosscup Hannuit</div>
            <div className="wedstrijddatum">26/01/2025</div>
          </div>
          <a href="https://crosscup.be/nl/hannuit/" target="_blank" rel="noopener noreferrer">Meer info</a>
          <a href="https://www.runningresults.be/resultaten/2024cchannutresultsnl" target="_blank" rel="noopener noreferrer">Resultaten 2024</a>
        </div>

        <div className="wedstrijdbox">
          <div className="wedstrijdfoto" style={{ backgroundImage: `url(${Diest})` }}>
            <div className="vorigeresults">
              <div className="subtitel2">Vorige editie:</div>
              <div className="container">
                <div className="kolom">
                  <div>Mannen:</div>
                  <div>1. Saké</div><div>2. Vanderpoorten</div><div>3. Grimard</div><div>4. Camphens</div><div>5. Crickillon</div>
                  <div>6. Casteele</div><div>7. Goudeseune</div><div>8. Debacker</div><div>9. Vandecasteele</div><div>10. Konteh</div>
                </div>
                <div className="kolom">
                  <div>Vrouwen:</div>
                  <div>1. Van Lent</div><div>2. Bihain</div><div>3. Thomas</div><div>4. Warpy</div><div>5. Van Accom</div>
                  <div>6. Voet</div><div>7. Van Lent</div><div>8. Warpy</div><div>9. Dalemans</div><div>10. Taschimowitz</div>
                </div>
              </div>
            </div>
            <div className="wedstrijdnaam">Crosscup Diest</div>
            <div className="wedstrijddatum">16/02/2025</div>
          </div>
          <a href="https://crosscup.be/nl/diest/" target="_blank" rel="noopener noreferrer">Meer info</a>
          <a href="https://www.runningresults.be/resultaten/2024ccdiestresultsnl" target="_blank" rel="noopener noreferrer">Resultaten 2024</a>
        </div>
      </div>

    </div>
    
  );
};

export default Kalender;
