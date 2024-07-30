import React, { useState } from "react";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import ReportPdf from "./ReportPdf";
import { getAlarmsReport } from "../../services/alarmsService";
//Formik
import { Formik, Form } from "formik";
//Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
//Components
import TextField from "../../components/TextField/TextField";

const ReportModal = ({ ...props }) => {
  const currDate = () => {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    const day = date.getDate();
    const fullDate = `${year}/${month}/${day}`;
    return fullDate;
  };

  const reportValues = async (values) => {
    try {
      getAlarmsReport(values.start, values.end, 1, 0).then(async (res) => {
        const fileName = "report.pdf";
        const blob = await pdf(<ReportPdf report={res.result} />).toBlob();
        saveAs(blob, fileName);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-message"
      data-bs-theme="dark"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Generar reporte
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ start: "", end: "" }}
          onSubmit={async (values) => {
            reportValues(values);
          }}
        >
          {(p) => (
            <Form>
              <TextField
                label="Desde"
                name="start"
                max={"2024/07/29"}
                type="date"
                value={p.values.start}
                onChange={p.handleChange}
                errors="Fecha requerida"
              />
              <TextField
                label="Hasta"
                name="end"
                max={"2024/07/29"}
                type="date"
                value={p.values.end}
                onChange={p.handleChange}
                errors="Fecha requerida"
              />
              <Button variant="outline-light" onClick={props.onHide} size="sm">
                Cancelar
              </Button>
              <Button variant="main" type="submit" size="sm">
                Generar
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ReportModal;
