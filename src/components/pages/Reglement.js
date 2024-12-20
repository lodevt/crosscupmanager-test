import React, { useEffect, useState } from 'react';
import Headbar from '../common/Headbar'; // Ensure this is the correct path to your Headbar component
import '../../styles/styles.css';
import PuntenTelling from '../common/PuntenTelling';
import { Link } from 'react-router-dom';


const Reglement = () => {
    return (
        <div>
            <Headbar highlightedLink="Reglement" />

            <div className="paginaTitel">Reglement</div>

            <div className="subtitel">Regels</div>
            <div className="textbox">
                1. Je selecteert <b>8</b> mannelijk en <b>8</b> vrouwelijke atleten, voor beide ploegen heb je een budget van <b>50M</b>.
            </div>
            <div className="textbox">
            2. Er zijn 5 wedstrijden waarin je atleten punten kunnen verdienen. Deze zijn terug te vinden op de <Link to="/Kalender" style={{ color: 'var(--accentcolor)' }}>Kalender</Link>.
        </div>
            <div className="textbox">
                3. Op basis van de uitslag van een wedstrijd verdienen atleten punten volgens de puntenverdeling hieronder. Er zijn punten te verdienen in zowel de lange cross als de korte cross.
            </div>
            <div className="textbox">
            4. Elke wedstrijd selecteert men via <Link to="/Opstelling" style={{ color: 'var(--accentcolor)' }}>Opstelling</Link> <b>6</b> mannelijke en <b>6</b> vrouwelijke atleten. Enkel deze atleten kunnen punten verdienen.
        </div>
            <div className="textbox">
                5. Alleen atleten aangesloten bij een <b>Belgische club</b> tellen mee in de uitslag.
            </div>
            <div style={{ paddingLeft: '5em', margin:"1em",fontStyle:"italic", fontSize:"0.8em" }} className="textbox">
                Als je atleet 4de is, maar de eerste atleet met een Belgische club krijgt deze nog steeds 50 punten.
            </div>
            <div className="textbox">
                6. Bij de Crosscup van Berlare (relays) geldt de teamuitslag voor de atleet en worden de punten <b>gehalveerd</b> (en afgerond naar boven). 
            </div>
            <div style={{ paddingLeft: '5em',margin:"1em",fontStyle:"italic", fontSize:"0.8em" }} className="textbox">
                Een atleet van het winnende team krijgt 25 punten.
            </div>
            <div style={{ paddingLeft: '5em', margin:"1em",fontStyle:"italic", fontSize:"0.8em" }} className="textbox">
                Atleten uit het 2de team krijgen 23 punten. Enzovoort...
            </div>
            <div className="textbox">
                7. Er zijn verschillende <b>bonussen</b> te verdienen.     
            </div>
            <div style={{ paddingLeft: '15px' }} className="textbox">
                - Beloftenbonus: de beste belofte in de lange cross (geboren in 2002 of later) krijgt 10 punten.
            </div>
            <div style={{ paddingLeft: '15px' }} className="textbox">
                - Strijdersbonus: Elke atleet die de wedstrijd uitloopt krijgt 1 punt. 
            </div>
            <div className="textbox">
                8. Je bent verplicht je te <b>amuseren</b> met de Crosscupmanager, en dit is ook je enige motivatie. Veel plezier!
            </div>

            <PuntenTelling></PuntenTelling>
        </div>
    );
};

export default Reglement;
