import React, { useRef, useEffect } from "react";
//Vidstack
import {
  MediaPlayer,
  MediaProvider,
  Controls,
  useMediaStore,
  useMediaRemote,
} from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
//Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
//Icons
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import { MdFullscreen } from "react-icons/md";
import {
  BsFullscreenExit,
  BsFullscreen,
  BsXLg,
  BsPipFill,
  BsPip,
} from "react-icons/bs";
//Components
import BufferingVideo from "./BufferingVideo";
import SliderTime from "./SliderTime";
import Video from "/assets/video/SampleVideo_1280x720_30mb.mp4";
import Video2 from "/assets/video/2.mp4";

const VideoPlayer = ({ ...props }) => {
  const player = useRef(null);
  const remote = useMediaRemote();

  /*Fullscreen */
  const { fullscreen, pictureInPicture, playing, paused } =
    useMediaStore(player);

  const handlePlay = (e) => {
    e.preventDefault();

    if (paused) {
      return remote.play(e);
    } else if (playing) {
      return remote.pause(e);
    }
  };

  return (
    <>
      <Container className={`video-player-container`} id={props.id}>
        <MediaPlayer
          //autoPlay
          crossOrigin
          //fullscreenOrientation="none
          muted={true}
          playbackRate={0.0625}
          ref={player}
          src={{
            src: Video,
            type: "video/mp4",
          }}
        >
          <MediaProvider />

          <Controls.Root className="vds-controls" hideDelay={120000}>
            <div className="vds-controls-spacer" />

            <Controls.Group className="vds-controls-group">
              <div className="bottom-controls">
                <Button
                  variant="tertiary-color"
                  size="sm"
                  onClick={(e) => handlePlay(e)}
                >
                  {!playing ? <FaPlay /> : <FaPause />}
                </Button>

                <SliderTime />

                <div className="bottom-rigth-controls">
                  <Button variant="tertiary-color" size="sm">
                    {fullscreen ? (
                      <BsFullscreenExit className="fs-exit-icon vds-icon" />
                    ) : (
                      <BsFullscreen className="fs-enter-icon vds-icon" />
                    )}
                  </Button>
                </div>
              </div>
            </Controls.Group>
          </Controls.Root>
          <BufferingVideo />
        </MediaPlayer>
      </Container>
    </>
  );
};

export default VideoPlayer;
