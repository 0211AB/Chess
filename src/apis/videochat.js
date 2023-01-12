import React, { useEffect, useState, useRef } from 'react';
import Peer from "simple-peer";
import styled from "styled-components";
const socket = require('../apis/socket').socket


const Container = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction: column;
  padding:20px;
`;

const Row = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  flex-wrap:wrap;
`;

const Video = styled.video`
  background:#b38b6d;
  border: 5px solid brown;
  border-radius:10px;
  margin:5px;
  box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
  height:22rem;
  width:35rem;
`;

function VideoChatApp(props) {
  /**
   * initial state: both player is neutral and have the option to call each other
   * 
   * player 1 calls player 2: Player 1 should display: 'Calling {player 2 username},' and the 
   *                          'CallPeer' button should disappear for Player 1.
   *                          Player 2 should display '{player 1 username} is calling you' and
   *                          the 'CallPeer' button for Player 2 should also disappear. 
   * 
   * Case 1: player 2 accepts call - the video chat begins and there is no button to end it.
   * 
   * Case 2: player 2 ignores player 1 call - nothing happens. Wait until the connection times out. 
   * 
   */

  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [isCalling, setIsCalling] = useState(false)
  const userVideo = useRef();
  const partnerVideo = useRef();

  useEffect(() => {

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);

      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })


    socket.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
  }, []);

  function callPeer(id) {
    setIsCalling(true)
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      socket.emit("callUser", { userToCall: id, signalData: data, from: props.mySocketId })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  function acceptCall() {
    setCallAccepted(true);
    setIsCalling(false)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Video playsInline muted ref={userVideo} autoPlay />
        <h1>{props.myUserName}</h1>
      </div>
    );
  }

  let mainView;

  if (callAccepted) {
    mainView = (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Video playsInline ref={partnerVideo} autoPlay />
        <h1>{props.opponentUserName}</h1>
      </div>
    );
  } else if (receivingCall) {
    mainView = (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <h1> <q style={{ textTransform: "capitalize" }}>{props.opponentUserName}</q> is calling you</h1>
        <button className="submit" onClick={acceptCall}>Accept</button>
      </div>
    )
  } else if (isCalling) {
    mainView = (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <h1>Currently calling <q style={{ textTransform: "capitalize" }}>{props.opponentUserName}</q> ...</h1>
      </div>
    )
  } else {
    mainView = (
      <button className="submit" onClick={() => {
        callPeer(props.opponentSocketId)
      }}>Chat with your friend while you play!</button>
    )
  }



  return (<Container>
    <Row>
      {mainView}
      {UserVideo}
    </Row>
  </Container>);
}

export default VideoChatApp;