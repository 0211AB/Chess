import React from 'react'
import './GameLink.css'

const GameLink = ({ domainName, gameid, data }) => {
    return (
        <div className='link-container'>
            <h2>
                Hey <strong>{data.myUserName}</strong>, copy and paste the URL
                below to send to your friend:
            </h2>
            <div className='link'>
                {domainName + "/game/" + gameid}{"    "}
                <br></br>
                <br></br>
                <button className='submit' onClick={() => {
                    navigator.clipboard.writeText(`${domainName}/game/${gameid}`);
                }}> Copy Text</button>
            </div>
            <br></br>

            <h2>
                Waiting for other opponent to join the game...{" "}
            </h2>
        </div>
    )
}

export default GameLink