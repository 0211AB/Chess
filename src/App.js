import React from 'react'
import { Route, Routes } from "react-router-dom";

import { ColorContext } from './context/colorContext'
import StartGame from './startGame/StartGame';
import JoinRoom from './startGame/JoinRoom'
import JoinGame from './startGame/JoinGame'
import ChessGame from './chess/ui/chessGame';

const App = () => {

    const [didRedirect, setDidRedirect] = React.useState(false)

    const playerDidRedirect = React.useCallback(() => {
        setDidRedirect(true)
    }, [])

    const playerDidNotRedirect = React.useCallback(() => {
        setDidRedirect(false)
    }, [])

    const [userName, setUserName] = React.useState('')

    return (
        <ColorContext.Provider value={{ didRedirect: didRedirect, playerDidRedirect: playerDidRedirect, playerDidNotRedirect: playerDidNotRedirect }}>
            <Routes>
                <Route path="/" element={<StartGame setUserName={setUserName} />}></Route>
                <Route path="/game/:gameid" element={
                    didRedirect ? (
                        <React.Fragment>
                            <JoinGame userName={userName} isCreator={true} />
                            <ChessGame myUserName={userName} />
                        </React.Fragment>
                    ) : (
                        <JoinRoom />
                    )
                }></Route>
            </Routes>
        </ColorContext.Provider>
    )
}

export default App