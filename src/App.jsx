import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import { SocketProvider } from "./Providers/Socket";
import Greeting from "./ui/Greeting";

function App() {
  return (
    <>
     <SocketProvider>
     <Routes>
       
       <Route path="/" element={<Greeting/>} />
       
     </Routes>
     </SocketProvider>
    </>
  );
}

export default App;
