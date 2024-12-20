import React, { useEffect, useState } from 'react';
import { getFirestore, doc, collection, getDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { auth, app, config } from '../../Javascript/config.js'; 
import '../../styles/puntentelling.css';

const PuntenTelling = () => {
  const [puntendataLangeCross, setPuntendataLangeCross] = useState([
    [1, "ste"], [2, "de"], [3, "de"], [4, "de"],
    [5, "de"], [6, "de"], [7, "de"], [8, "de"],
    [9, "de"], [10, "de"], [11, "de"], [12, "de"],
    [13, "de"], [14, "de"], [15, "de"], [16, "de"],
    [17, "de"], [18, "de"], [19, "de"], [20, "ste"],
    [21, "ste"], [22, "ste"], [23, "ste"], [24, "ste"],
    [25, "ste"],
  ]);
  const [puntendataKorteCross, setPuntendataKorteCross] = useState([
    [1, "ste"], [2, "de"], [3, "de"], [4, "de"],
    [5, "de"], [6, "de"], [7, "de"], [8, "de"],
    [9, "de"], [10, "de"], [11, "de"], [12, "de"],
    [13, "de"], [14, "de"], [15, "de"], [16, "de"],
    [17, "de"], [18, "de"], [19, "de"], [20, "ste"],
    [21, "ste"], [22, "ste"], [23, "ste"], [24, "ste"],
    [25, "ste"],
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      const collectionRef = collection(db, config.AthletesCollection);
      const docId = "season2425";
      const docRef = doc(collectionRef, docId);

      try {
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const pointsArrayLongCross = docSnapshot.data().points_long_cross || [];
          const pointsArrayShortCross = docSnapshot.data().points_short_cross || [];

          const updatedLangeCross = puntendataLangeCross.map((data, index) => {
            return [...data, pointsArrayLongCross[index]];
          });
          
          const updatedKorteCross = puntendataKorteCross.map((data, index) => {
            return [...data, pointsArrayShortCross[index]];
          });

          setPuntendataLangeCross(updatedLangeCross);
          setPuntendataKorteCross(updatedKorteCross);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

 


  return (
    <div className="puntentelling-container">

      <div className="puntentelling">
      <h2 className="subtitel">Puntentelling Lange Cross</h2>

        {puntendataLangeCross.map(([place, ordinal, points]) => (
          points !== undefined && (
            <div className="puntvoorplaats" key={place}>
              <div className="plaats">
                <div className="cijfer">{place}</div>
                <div className="nth">{ordinal}</div>
              </div>
              <div className="punten">{points}</div>
            </div>
          )
        ))}
      </div>

      <div className="puntentelling">
      <h2 className="subtitel">Puntentelling Korte Cross</h2>

        {puntendataKorteCross.map(([place, ordinal, points]) => (
          points !== undefined && (
            <div className="puntvoorplaats" key={place}>
              <div className="plaats">
                <div className="cijfer">{place}</div>
                <div className="nth">{ordinal}</div>
              </div>
              <div className="punten">{points}</div>
            </div>
          )
        ))}
      </div>
    </div>

  );
};

export default PuntenTelling;
