import React, { useEffect, useState } from 'react';
import { app, auth } from '../../Javascript/firebaseInit.js';
import {
    getFirestore,
    onSnapshot,
    collection,
    addDoc,
    doc, 
    getDoc
} from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';
import {config} from '../../Javascript/config.js';

import '../../styles/chat.css';     
const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const db = getFirestore(app);

    const [teamName, setTeamName] = useState('guest');

    useEffect(() => {
        const db = getFirestore(app);

        if (auth.currentUser) {
            // User is logged in
            const userEmail = auth.currentUser.email;
            const customDocRef = doc(db, config.UserCollection, userEmail);

            getDoc(customDocRef)
                .then(async (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data();
                        const { team_name } = userData;
                        
                        setTeamName(team_name); // Set the team name state variable
                    }
                })
                .catch((error) => {
                    console.error("Error getting document:", error);
                });
        }
        else  {setTeamName('guest');}
    }, [auth.currentUser]);


    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'Chat'),
            (snapshot) => {
                const messagesData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        text: data.text,
                        senderId: data.senderId,
                        // Convert Firestore Timestamp to Date
                        timestamp: data.timestamp?.toDate(), // Ensure it's a Date object
                    };
                }).sort((a, b) => a.timestamp - b.timestamp);
    
                if (messagesData.length) setMessages(messagesData);
            }
        );
    
        return () => unsubscribe();
    }, []);

    const sendMessage = async () => {
        if (newMessage.trim() === '') return;
        //if (!auth.currentUser) return;
        await addDoc(collection(db, 'Chat'), {
            text: newMessage,
            senderId: teamName, // Use 'guest' if no user is logged in
            timestamp: new Date(), // Use the current date as a timestamp
        });
        setNewMessage('');
    };

    return (
        <div className="chat-overlay">
            <div className="chat-messages">
                {messages.map(message => (
                    <div key={message.id} className="chat-message">
                        <strong>{message.senderId}:</strong> {message.text}
                        <div className="chat-timestamp">
                            {message.timestamp ? message.timestamp.toLocaleString() : ''} {/* Format timestamp */}
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type a message" 
                />
                <button className="chat-send-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
