import React from "react";
import { Grid, Button, ButtonGroup, Tooltip } from '@material-ui/core';
import { AppState } from './App';
// @ts-ignore
import { SketchPicker } from 'react-color';
import { Fullscreen, DesktopWindows, ColorLens } from '@material-ui/icons';
import NoSleep from 'nosleep.js';

interface Props {
    appState: AppState,
    setAppState: any,
    isFullScreen: boolean,
    setIsFullScreen: any,
    channel: BroadcastChannel,
}

const noSleep = new NoSleep();

export const ControlBar = (props: Props) => { 
  const { setAppState, appState, setIsFullScreen, isFullScreen, channel } = props;

  const changeState = (newState: Partial<AppState>) => {
    const totalState = { ...appState, ...newState };
    setAppState((prevState: AppState) => { return { ...prevState, ...totalState} });
    channel.postMessage({ instruction: "setState", state: totalState});
  };
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen(); 
    }
    setIsFullScreen(!document.fullscreenElement);
  }
  const toggleLockMonitor = (lockMonitor: boolean) => {
    if (lockMonitor) {
      noSleep.disable();
    } else {
      noSleep.enable();
    }
    changeState({ lockMonitor });
  }
  
  return <Grid
    container
    direction="row"
    alignItems="flex-start"
  >
    <ButtonGroup orientation="vertical" aria-label="outlined button group">
      <Tooltip title="Pick Color">
        <Button
          variant="outlined"
          onClick={() => changeState({ pickColor: !appState.pickColor })}
          color={appState.pickColor?"primary":"default"}
        >
          <ColorLens />
        </Button>
      </Tooltip>
      <Tooltip title="Lock Monitor">
        <Button
          variant="outlined"
          onClick={() => toggleLockMonitor(!appState.lockMonitor)}
          color={appState.lockMonitor?"primary":"default"}
        >
          <DesktopWindows />
        </Button>
      </Tooltip>
      <Tooltip title="Fullscreen">
        <Button
          variant="outlined"
          onClick={toggleFullScreen}
          color={isFullScreen?"primary":"default"}
        >
          <Fullscreen />
        </Button>
      </Tooltip>
    </ButtonGroup>
    {appState.pickColor && <SketchPicker
      name='colorPicker'
      key='colorPicker'
      color={appState.backgroundColor}
      onChangeComplete={(color: any) => changeState({ backgroundColor: color.hex })}
    />}
  </Grid>
};