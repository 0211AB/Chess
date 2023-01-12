import React, { useEffect, useState, useContext } from 'react'
import useSound from 'use-sound'
import chessMove from '../assets/moveSoundEffect.mp3'
import { useParams } from 'react-router-dom'
import { ColorContext } from '../../context/colorContext'
import VideoChatApp from '../../apis/videochat'
import GameLink from './GameLink';
import ChessBoard from './ChessBoard';
const socket = require('../../apis/socket').socket

const ChessGameWrapper = (props) => {
    /**
     * player 1
     *      - socketId 1
     *      - socketId 2 ???
     * player 2
     *      - socketId 2
     *      - socketId 1
     */

    console.log(props)

    // get the gameId from the URL here and pass it to the chessGame component as a prop. 
    const domainName = 'http://localhost:3000'
    const color = useContext(ColorContext)
    const { gameid } = useParams()
    const [play] = useSound(chessMove);
    const [opponentSocketId, setOpponentSocketId] = useState('')
    const [opponentDidJoinTheGame, didJoinGame] = useState(false)
    const [opponentUserName, setUserName] = useState('')
    const [gameSessionDoesNotExist, doesntExist] = useState(false)

    useEffect(() => {
        socket.on("playerJoinedRoom", statusUpdate => {
            console.log(statusUpdate)
            console.log("A new player has joined the room! Username: " + statusUpdate.userName + ", Game id: " + statusUpdate.gameId + " Socket id: " + statusUpdate.mySocketId)
            if (socket.id !== statusUpdate.mySocketId) {
                setOpponentSocketId(statusUpdate.mySocketId)
            }
        })

        socket.on("status", statusUpdate => {
            console.log(statusUpdate)
            alert(statusUpdate)
            if (statusUpdate === 'This game session does not exist.' || statusUpdate === 'There are already 2 people playing in this room.') {
                doesntExist(true)
            }
        })


        socket.on('start game', (opponentUserName) => {
            console.log("START!")
            if (opponentUserName !== props.myUserName) {
                setUserName(opponentUserName)
                didJoinGame(true)
            } else {
                // in chessGame, pass opponentUserName as a prop and label it as the enemy. 
                // in chessGame, use reactContext to get your own userName
                // socket.emit('myUserName')
                socket.emit('request username', gameid)
            }
        })


        socket.on('give userName', (socketId) => {
            if (socket.id !== socketId) {
                console.log("give userName stage: " + props.myUserName)
                socket.emit('recieved userName', { userName: props.myUserName, gameId: gameid })
            }
        })

        socket.on('get Opponent UserName', (data) => {
            if (socket.id !== data.socketId) {
                setUserName(data.userName)
                console.log('data.socketId:', data.socketId)
                setOpponentSocketId(data.socketId)
                didJoinGame(true)
            }
        })
    }, [])


    return (
        <React.Fragment>
            {opponentDidJoinTheGame ? (
                <div className='main-game'>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h4 style={{ width: "100%", textAlign: "center" }}> OPPONENT : {opponentUserName} </h4>
                        <ChessBoard playAudio={play}
                            gameId={gameid}
                            color={color.didRedirect} />
                        <h4 style={{ width: "100%", textAlign: "center" }}> YOU : {props.myUserName} </h4>
                    </div>
                    <VideoChatApp
                        mySocketId={socket.id}
                        opponentSocketId={opponentSocketId}
                        myUserName={props.myUserName}
                        opponentUserName={opponentUserName}
                    />
                </div>
            ) : gameSessionDoesNotExist ? (
                <div>
                    <h1 style={{ textAlign: "center", marginTop: "200px" }}> :( </h1>
                </div>
            ) : (
                <GameLink domainName={domainName} gameid={gameid} data={props} />
            )}
        </React.Fragment>
    );
};

export default ChessGameWrapper