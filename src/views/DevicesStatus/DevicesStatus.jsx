import React, { useState } from "react";
//Redux
import { useGetBranchesStatusQuery } from "../../store/api/branchesStatusApi";
import { useSelector } from "react-redux";
//Bootstrap
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import { TiWarning } from "react-icons/ti";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
//Components
import ControlBar from "../ControlBar/ControlBar";

const DevicesStatus = () => {
  const [searchBranch, setSearchBranch] = useState("");

  const { data, isFetching } = useGetBranchesStatusQuery(
    { branchName: searchBranch },
    {
      pollingInterval: 600000,
      refetchOnMountOrArgChange: true,
    }
  );

  const handleCollapseInfo = (id) => {
    let list = document.querySelectorAll(`#${id}`);

    Array.from(list).map((el) => {
      if (el.getAttribute("style") === "visibility: collapse;") {
        el.setAttribute("style", "visibility: visible;");
      } else if (el.getAttribute("style") === "visibility: visible;") {
        el.setAttribute("style", "visibility: collapse;");
      }
    });
  };

  return (
    <Container className="devices-status-container">
      <ControlBar
        submit={async (values) => {
          setSearchBranch(values.search);
        }}
        clear={() => setSearchBranch("")}
      />
      <Table variant="dark" responsive bordered>
        <thead>
          <tr>
            <th colSpan={3}>Estado</th>
            <th colSpan={1}>Estatus</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.result.stateBranches.map((item, index) => (
              <>
                <tr
                  key={index}
                  onClick={() => handleCollapseInfo(item.stateCode)}
                  className="branches-states"
                >
                  <td colSpan={3}>{item.stateName}</td>
                  <td
                    style={{
                      color: item.allOnline ? "green" : "orange",
                      textAlign: "center",
                    }}
                    colSpan={1}
                  >
                    {item.allOnline ? "En línea" : <TiWarning />}
                  </td>
                </tr>

                <tr
                  style={{ visibility: "collapse" }}
                  id={item.stateCode}
                  className="second-headers"
                >
                  <td>Sucursal</td>
                  <td>Estatus</td>
                  <td>Dirección IP</td>
                  <td>Información adicional</td>
                </tr>

                {item.branches &&
                  item.branches.map((j, indx) => (
                    <tr
                      key={indx}
                      id={item.stateCode}
                      style={{ visibility: "collapse" }}
                      className="branches"
                    >
                      <td>{j.branchCodeName}</td>
                      <td style={{ color: j.isOnline ? "#198754" : "#ff8e8e" }}>
                        {j.isOnline ? "En línea" : "Desconectado"}
                      </td>
                      <td>{j.ipAddress}</td>
                      <td style={{ color: j.isOnline ? "white" : "#ff8e8e" }}>
                        {j.additionalInformation}
                      </td>
                    </tr>
                  ))}
              </>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default DevicesStatus;
