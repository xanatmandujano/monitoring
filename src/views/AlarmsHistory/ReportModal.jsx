import React, { useState } from "react";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import ReportPdf from "./ReportPdf";
import { getAlarmsReport } from "../../services/alarmsService";
import { getPermissions } from "../../scripts/getPermissions";
//Formik
import { Formik, Form } from "formik";
//Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
//Components
import TextField from "../../components/TextField/TextField";
import Loader from "../../components/Loader/Loader";

const ReportModal = ({ ...props }) => {
  const [loader, setLoader] = useState(false);

  const currDate = () => {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    const day = date.getDate();
    const fullDate = `${year}-${month}-${day}`;
    console.log(fullDate);
    return fullDate;
  };

  const permissions = getPermissions();

  const reportValues = async (values) => {
    setLoader(true);
    try {
      getAlarmsReport(
        values.start,
        values.end,
        1,
        0,
        null,
        null,
        null,
        permissions
      )
        .then(async (res) => {
          const fileName = "report.pdf";
          const blob = await pdf(<ReportPdf report={res.result} />).toBlob();
          saveAs(blob, fileName);
        })
        .then(() => {
          setLoader(false);
        });
    } catch (error) {
      console.log(error);
      setLoader(false);
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
                type="date"
                value={p.values.start}
                //min={currDate()}
                onChange={p.handleChange}
                errors="Fecha requerida"
              />
              <TextField
                label="Hasta"
                name="end"
                type="date"
                value={p.values.end}
                onChange={p.handleChange}
                //max={currDate()}
                errors="Fecha requerida"
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outline-light"
                  onClick={props.onHide}
                  size="sm"
                  disabled={loader}
                >
                  Cancelar
                </Button>
                <Button
                  variant="main"
                  type="submit"
                  size="sm"
                  disabled={loader}
                >
                  {loader ? <Loader size="sm" /> : "Generar"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ReportModal;
