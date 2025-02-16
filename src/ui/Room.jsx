import React, { useCallback, useEffect } from "react";
import { useSocket } from "../Providers/Socket";
import { usePeer } from "../Providers/Peer";

function Room() {
  const { socket } = useSocket();
  const { peer, createOffer } = usePeer();

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("NewUser joined", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
    },
    [createOffer, socket]
  );

const handleIncomingCall = useCallback(
    (data) =>{  
        const {from, offer} = data;
        console.log('incoming call from', from, offer);
    }
    ,[])

  useEffect(() => {
    socket.on("joined-room", async (data) => {
      console.log("on joined room", data);

      socket.emit("call-user", {});
    });
    socket.on("user-joined", handleNewUserJoined);
    socket.on('incoming-call', handleIncomingCall)
    socket.on("call-user", (data) => {
      console.log("on call user", data);
    });
  }, [socket]);
  return <div>Welcome to the room</div>;
}

export default Room;
