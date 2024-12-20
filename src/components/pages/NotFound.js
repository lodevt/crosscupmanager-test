// src/pages/NotFoundPage.js
import React from 'react';
import '../../styles/styles.css'; 
import Headbar from '../common/Headbar.js';

const NotFoundPage = () => {
  return (
    <div>
      <head>
        <title>404 - Pagina Niet Gevonden</title>
      </head>
      <Headbar highlightedLink="index" />
      <h1>404 - Pagina Niet Gevonden</h1>
      <p>De gevraagde pagina kon niet worden gevonden. Controleer de URL of ga terug naar de <a href="index.html">startpagina</a>.</p>
    </div>
  );
};

export default NotFoundPage;
