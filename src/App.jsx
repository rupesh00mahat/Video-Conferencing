import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import { SocketProvider } from "./Providers/Socket";
import Greeting from "./ui/Greeting";
import Room from "./ui/Room";
import PeerProvider from "./Providers/Peer";

function App() {
  return (
    <>
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route path="/" element={<Greeting />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </>
  );
}

export default App;
