import React from "react";
import manual from "/config.json";

const PdfViewer = () => {
  const mode = import.meta.env.MODE;

  return (
    <div>
      <iframe
        src={mode === "ox" ? manual.assets.manualOx : manual.assets.manualBB}
        width={"100%"}
        height={500}
      />
    </div>
  );
};

export default PdfViewer;
