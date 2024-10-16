import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Table } from "react-bootstrap";
//React-router-dom
import { Link } from "react-router-dom";

const AlarmHistoryData = ({ ...props }) => {
  const dateTime = (creationDate) => {
    const alarmDateTime = new Date(creationDate);
    const alarmDate = alarmDateTime.toLocaleDateString("en-GB", {
      //weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const alarmTime = alarmDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const concat = `${alarmDate}, ${alarmTime}`;

    return concat;
  };

  const handleColor = (item) => {
    item.isEvent ? { color: "red" } : { color: "white" };
  };

  const alarmType = (alarmTypeId, alarmId) => {
    if (alarmTypeId === 1) {
      return `seproban/${alarmId}`;
    } else if (alarmTypeId === 2 || 5 || 6) {
      return `${alarmId}`;
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
            <th>Código</th>
            <th>Placa</th>
            <th>Sucursal</th>
            <th>Fecha</th>
            <th>Sensor</th>
            <th>Estatus</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.alarms &&
            props.alarms.map((item) => (
              <tr key={item.alarmId}>
                <td
                  style={
                    item.isEvent ? { color: "white" } : { color: "#fb5757" }
                  }
                >
                  {item.alarmCode}
                </td>
                <td>{item.additionalInformation}</td>
                <td>{item.branchCodeName}</td>
                <td>{dateTime(item.creationDate)}</td>
                <td>{item.deviceName}</td>
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
