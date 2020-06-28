import React, { useState, useEffect } from "react";
import { ControlBar } from './ControlBar';

export interface AppState {
  backgroundColor: string;
  pickColor: boolean;
  lockMonitor: boolean;
}

export const App = () => { 
  const [appState, setAppState] = useState({
    backgroundColor: '#FFFFFF',
    pickColor: false,
    lockMonitor: false
  });
  const [isFullScreen, setIsFullScreen] =  useState(!!document.fullscreenElement);
  const channel: BroadcastChannel = new BroadcastChannel('lightscreen');
  
  useEffect(() => {
    channel.postMessage({ instruction: "getState" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => { 
      if (e.data.instruction === "getState") {
        channel.postMessage({ instruction: "setState", state: appState });
      } else if (e.data.instruction === "setState") {
        document.querySelector("body")!.style.backgroundColor = e.data.state.backgroundColor;
        setAppState(prevState => { return { ...prevState, ...e.data.state} });
        channel.removeEventListener('message', handleMessage);
      }
    }

    channel.addEventListener('message', handleMessage);
    return () => {
      channel.removeEventListener('message', handleMessage);
    }
  }, [appState, channel]);

  return <ControlBar
    appState={appState}
    setAppState={setAppState}
    isFullScreen={isFullScreen}
    setIsFullScreen={setIsFullScreen}
    channel={channel}
  />
};