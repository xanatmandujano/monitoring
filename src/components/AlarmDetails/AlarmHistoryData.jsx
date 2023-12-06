import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Table } from "react-bootstrap";
//React-router-dom
import { Link } from "react-router-dom";

const AlarmHistoryData = ({ ...props }) => {
  const dateTime = (creationDate) => {
    const alarmDateTime = new Date(creationDate);
    const alarmTime = alarmDateTime.toLocaleDateString("es-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return alarmTime;
  };

  const alarmType = (alarmTypeId, alarmId) => {
    if (alarmTypeId === 1) {
      return `seproban/${alarmId}`;
    } else if (alarmTypeId === 2) {
      return alarmId;
    } else if (alarmTypeId === 3) {
      return `blackList/${alarmId}`;
    } else if (alarmTypeId === 4) {
      return `whiteList/${alarmId}`;
    }
  };

  return (
    <Container className="alarm-history-card">
      <Table variant="dark" striped hover bordered>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Clave de sucursal</th>
            <th>Fecha de creación</th>
            <th>Estatus</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.alarms &&
            props.alarms.map((item) => (
              <tr key={item.alarmId}>
                <td>{item.alarmDescription}</td>
                <td>{item.branchCode}</td>
                <td>{dateTime(item.creationDate)}</td>
                <td>{item.status}</td>
                <td>
                  <Link to={alarmType(item.alarmTypeId, item.alarmId)}>
                    <Button variant="main" size="sm">
                      Ver
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AlarmHistoryData;
