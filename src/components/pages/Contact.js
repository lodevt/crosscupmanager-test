import React, { useEffect } from 'react';
import Headbar from '../common/Headbar';
import emailIcon from '../../Images/Email.png';
import finish from '../../Images/Finish.png';


import '../../styles/styles.css'

const Contact = () => {
  useEffect(() => {
    showRacers(animals); // Call the function on component mount
  }, []);

  const showRacers = (animals) => {
    let Number1 = Math.floor(Math.random() * animals.length);
    let Number2 = Math.floor(Math.random() * animals.length);
    let Number3 = Math.floor(Math.random() * animals.length);

    let chosen1 = animals[Number1];
    let name1 = chosen1[0];
    let speed1 = chosen1[1] * 1000 + "ms";

    let chosen2 = animals[Number2];
    let name2 = chosen2[0];
    let speed2 = chosen2[1] * 1000 + "ms";

    let chosen3 = animals[Number3];
    let name3 = chosen3[0];
    let speed3 = chosen3[1] * 1000 + "ms";

    // Manipulate DOM using React refs
    let animal1 = document.getElementById("animal1");
    let animal2 = document.getElementById("animal2");
    let animal3 = document.getElementById("animal3");

    // Create spans for each animal
    let animalInput1 = document.createElement("span");
    let animalInput2 = document.createElement("span");
    let animalInput3 = document.createElement("span");
    animalInput1.appendChild(document.createTextNode(name1));
    animalInput2.appendChild(document.createTextNode(name2));
    animalInput3.appendChild(document.createTextNode(name3));

    // Apply transitions
    animal1.style.transition = speed1;
    animal2.style.transition = speed2;
    animal3.style.transition = speed3;

    // Append elements to DOM
    animal1.appendChild(animalInput1);
    animal2.appendChild(animalInput2);
    animal3.appendChild(animalInput3);
  };

  const animals = [
    ["🐌", 12], ["🦆", 5], ["🐇", 3], ["🐠", 4], ["🐢", 11], ["🦙", 8], ["🐘", 7], ["🐆", 2], ["🐫", 9], ["🐑", 6],
    ["🐒", 5.6], ["🦌", 4.2], ["🐎", 3.5], ["🐐", 5.2], ["🐖", 7.4], ["🐅", 2.8], ["🐓", 4.7], ["🐝", 3.8], ["🐬", 4.5],
    ["🐄", 5.5], ["🐁", 6.5], ["🐕", 4.8], ["🐳", 8.8], ["🐪", 8.2], ["🐧", 5.8], ["🐞", 10]
  ];

  return (
    <div>
        <title>CrosscupManager Contact</title>
      <Headbar highlightedLink="Contact" />
      <div className="paginaTitel">Vragen? Contacteer ons!</div>
      <div className="social-container">
        <a href="mailto:crosscupmanager@gmail.com" target="_blank" rel="noopener noreferrer">
          <div className="social-icon">
          <img src={emailIcon} alt="Email Icon" />
          </div>
        </a>
      </div>
      <div className="subtitel" style={{ textDecoration: 'none', textAlign: 'center', marginBottom: '5%' }}>
        Email: crosscupmanager@gmail.com
      </div>
      <div className="paginatitel" style={{ textDecoration: 'none', textAlign: 'center', marginTop: '0%' }}>
        Aanvraag extra atleten:{' '}
        <br></br>
        <a
          style={{ color: 'var(--accentcolor)' }}
          href="https://forms.gle/jpxTAiaCqrbNb1fX7"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Form
        </a> (of via de chat)
      </div>
      <div className="atletiekpiste">
        <div className="finish">
        <img src={finish} alt="Finish Line" />
        </div>
        <div className="headunderliner" style={{ height: '5px', background: 'white' }}></div>
        <div className="headunderliner" style={{ height: '50px', background: 'rgb(109, 0, 0)' }}>
          <label>1|</label>
          <div>Race!</div>
        </div>
        <div className="headunderliner" style={{ height: '5px', background: 'white' }}></div>
        <div className="headunderliner" style={{ height: '50px', background: 'rgb(109, 0, 0)' }}>
          <label>2|</label>
          <div className="credit" id="animal1"></div>
        </div>
        <div className="headunderliner" style={{ height: '5px', background: 'white' }}></div>
        <div className="headunderliner" style={{ height: '50px', background: 'rgb(109, 0, 0)' }}>
          <label>3|</label>
          <div className="credit" id="animal2"></div>
        </div>
        <div className="headunderliner" style={{ height: '5px', background: 'white' }}></div>
        <div className="headunderliner" style={{ height: '50px', background: 'rgb(109, 0, 0)' }}>
          <label>4|</label>
          <div className="credit" id="animal3"></div>
        </div>
        <div className="headunderliner" style={{ height: '5px', background: 'white' }}></div>
      </div>
      {/* Load external script if needed */}
      {/* <script type="module" src="./Javascript/firebaseInit.js"></script> */}
    </div>
  );

};

export default Contact;
