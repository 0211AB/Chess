import React from 'react'
import { useParams } from 'react-router-dom'
import './JoinGame.css'

const socket = require('../apis/socket').socket


const JoinGame = ({ userName, isCreator }) => {

    const JoinGameRoom = (gameid, userName, isCreator) => {
        const idData = {
            gameId: gameid,
            userName: userName,
            isCreator: isCreator
        }

        console.log(idData)

        socket.emit("playerJoinGame", idData)
    }


    const { gameid } = useParams()
    JoinGameRoom(gameid, userName, isCreator)
    return (<div>
        <h1 style={{ textAlign: "center" }}>Welcome to Kings of the 64</h1>
        <ul className='socials'>
            <li><a rel="noreferrer" href="https://www.facebook.com/abhay.bajaj.319" target="_blank"><ion-icon name="logo-facebook"></ion-icon></a></li>
            <li><a rel="noreferrer" href="https://www.instagram.com/_abhaybajaj/" target="_blank"><ion-icon name="logo-instagram"></ion-icon></a></li>
            <li><a rel="noreferrer" href="https://www.linkedin.com/in/abhay-bajaj-736913207/" target="_blank"><ion-icon name="logo-linkedin"></ion-icon></a></li>
            <li><a rel="noreferrer" href="https://github.com/0211AB" target="_blank"><ion-icon name="logo-github"></ion-icon></a></li>
        </ul>
    </div>
    )
}

export default JoinGame