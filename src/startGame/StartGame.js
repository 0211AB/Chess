import React, { useContext, useRef, useState } from 'react'
import './StartGame.css'
import { v4 as uuidv4 } from 'uuid';
import { ColorContext } from '../context/colorContext'
import { useNavigate } from 'react-router-dom';

import rook from '../assets/rook.png'
import pawn from '../assets/pawn.png'

const socket = require('../apis/socket').socket

const StartGame = ({ setUserName }) => {
    const [didGetUserName, setDidGetUserName] = useState(false)
    const [inputText, setInputText] = useState("")
    const [gameId, setGameId] = useState("")
    const navigate = useNavigate()

    const colorCtx = useContext(ColorContext)

    const textRef = useRef(null)

    const submitHandler = (e) => {
        e.preventDefault();
        setInputText(textRef.current.value)
        // console.log(textRef.current.value)

        colorCtx.playerDidRedirect();
        setUserName(textRef.current.value);
        setDidGetUserName(true);


        const newGameRoomId = uuidv4();
        setGameId(newGameRoomId)
        socket.emit('createNewGame', newGameRoomId)
    }

    return (
        <>
        <div className='start-container'>
            <h1>Kings of the 64</h1>
            <br></br>
            {didGetUserName ?
                <button className="submit" onClick={() => { navigate(`/game/${gameId}`) }}> Start Game</button> :
                <>
                    <h3>Please Enter Your Name</h3>
                    <form className='form' onSubmit={submitHandler}>
                        <input className='input' ref={textRef} required></input>
                        <br></br>
                        <button type='submit' className='submit'> Submit </button>
                    </form></>
            }
        </div >
         <img src={rook} alt="Rook" className='img-1'></img>
         <img src={pawn} alt="Pawn" className='img-2'></img>
         </>
    )
}

export default StartGame