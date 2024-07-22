import React from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import ReportPdf from "./ReportPdf";

const PreviewTest = () => {
  return (
    <PDFViewer>
      <ReportPdf />
    </PDFViewer>
  );
};

export default PreviewTest;
