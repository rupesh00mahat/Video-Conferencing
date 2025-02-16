import { Box, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSocket } from "../Providers/Socket";
import { useNavigate } from "react-router-dom";

function Greeting() {
  const { socket } = useSocket();

  const [userName, setUserName] = useState();

  console.log("socket", socket);
  const navigate = useNavigate();
  const handleRoomJoined = ({ roomId }) => {
    console.log("Room Joined", roomId);
    navigate(`/room/${roomId}`);
  };

  useEffect(() => {
    socket.on("joined-room", handleRoomJoined);
  }, [socket]);

  return (
    <>
      <Box>
        <TextField
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            socket?.emit("join-room", { roomId: 1, emailId: userName });
            console.log("socket", socket);
          }}
        >
          Enter the room
        </Button>
      </Box>
    </>
  );
}

export default Greeting;
