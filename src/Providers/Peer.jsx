import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const PeerContext = createContext();

export const usePeer = () => {
  return useContext(PeerContext);
};

function PeerProvider({ children }) {
  const [remoteStream, setRemoteStream] = useState(null);
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

  const createNewOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    console.log('peer', peer);
    return offer;
  };

  const createNewAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const sendStream = async (stream) => {
    const tracks = stream.getTracks();
    for (const track of tracks) {
      peer.addTrack(track, stream);
    }
  };

  const handleTrack = useCallback(async (ev) => {
    const streams = ev.streams;
    setRemoteStream(streams[0]);
    console.log('streams',streams);
  }, []);

  useEffect(() => {
    peer.addEventListener("track", handleTrack);
    return () => {
      peer.removeEventListener("track", handleTrack);
    };
  }, [peer]);

  return (
    <PeerContext.Provider
      value={{ peer, createNewOffer, createNewAnswer, sendStream, remoteStream }}
    >
      {children}
    </PeerContext.Provider>
  );
}

export default PeerProvider;
