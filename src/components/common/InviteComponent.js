import React from 'react';
import '../../styles/invite_component.css';

const InviteComponent = ({ inviteUrl }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteUrl)
            .then(() => {
                alert('Invite URL copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <div className="invite-container">
            <h2 className="invite-title">Invite Friends</h2>
{/*             <p id="invite-url" className="invite-text">{inviteUrl}</p>
 */}            <button className="copy-button" onClick={copyToClipboard}>
                Copy Invite URL
            </button>
        </div>
    );
};

export default InviteComponent;
