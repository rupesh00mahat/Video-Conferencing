import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../Providers/Socket";
import { usePeer } from "../Providers/Peer";
import ReactPlayer from "react-player";

function Room() {
  const { socket } = useSocket();
  const { peer, createNewOffer, createNewAnswer, remoteStream, sendStream } =
    usePeer();
  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState("");

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      const offer = await createNewOffer();
      console.log('created offer', offer);
      socket.emit("call-user", { emailId, offer });
      setRemoteEmailId(emailId);
      console.log('New user has joined', emailId);
    },
    [createNewOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log('Incoming call', data);
      const ans = await createNewAnswer(offer);
      console.log('answer', ans); 
      socket.emit("call-accepted", { emailId: from, ans });
      setRemoteEmailId(from);

    },
    [createNewAnswer, socket]
  );

  useEffect(() => {
    socket.on("joined-room", async (data) => {
      console.log('joined room', data);
    });
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-user", (data) => {
      console.log('call -user ', data);
    });
    console.log('call-accepted', (data)=>{
      console.log('call-accepted',data);
    })
  }, [socket]);

  const setLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
  };

  useEffect(() => {
    setLocalStream();
  }, []);

  const handleNegotiation = useCallback(async () => {
    console.log('negotiation needed', peer, remoteEmailId);
    // const offer = peer.localDescription;
    // socket.emit("call-user", { remoteEmailId, offer });
  }, [peer.localDescription, socket]);

  useEffect(() => {
    console.log('peer', peer);
    peer.addEventListener("negotiationneeded", handleNegotiation);
    return ()=>{
      peer.removeEventListener("negotiationneeded", handleNegotiation)
    }
  }, [peer]);

  return (
    <>
      <div>Welcome to the room</div>
      <h2>You are connected to {remoteEmailId}</h2>
      <button
        onClick={() => {
          sendStream(myStream);
        }}
      >
        Send My Stream
      </button>
      <ReactPlayer url={myStream} playing muted />
      <ReactPlayer url={remoteStream} playing muted/>
    </>
  );
}

export default Room;
