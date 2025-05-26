import React, { useRef, useEffect } from "react";
//Vidstack
import {
  TimeSlider,
  useSliderState,
  TimeSliderInstance,
  useSliderStore,
} from "@vidstack/react";

const SliderTime = () => {
  const sliderRef = useRef(null);
  const { dragging, fillPercent, max } = useSliderStore(sliderRef);

  return (
    <TimeSlider.Root
      className="media-slider"
      ref={sliderRef}
      pauseWhileDragging={true}
      step={0.01}

      //keyStep={0.01}
    >
      <TimeSlider.Track className="media-slider-track">
        <TimeSlider.TrackFill className="media-slider-track-fill media-slider-track" />
      </TimeSlider.Track>
      <TimeSlider.Thumb className="media-slider-thumb" />

      {/* <TimeSlider.Preview>
        <TimeSlider.Value />
      </TimeSlider.Preview> */}
    </TimeSlider.Root>
  );
};

export default SliderTime;
