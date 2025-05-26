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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const { data, isFetching } = useGetBranchesStatusQuery(
    { columnName: filter, searchText: search },
    {
      //pollingInterval: 600000,
      //refetchOnMountOrArgChange: true,
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

  const handleConnectionColor = (value) => {
    if (value) {
      return { color: "#198754" };
    } else if (value === null) {
      return {
        color: "grey",
      };
    } else {
      return { color: "#ff8e8e" };
    }
  };

  return (
    <Container className="devices-status-container">
      <ControlBar
        submit={async (values) => {
          setSearch(values.search);
          setFilter(values.filter);
        }}
      />
      <Table variant="dark" responsive bordered>
        <thead>
          <tr>
            <th colSpan={2}>Estado</th>
            <th colSpan={2}>Estatus</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.result.stateBranches &&
            data.result.stateBranches.map((item, index) => (
              <>
                <tr
                  key={index}
                  onClick={() => handleCollapseInfo(item.stateCode)}
                  className="branches-states"
                >
                  <td colSpan={2}>{item.stateName}</td>
                  <td
                    style={{
                      color: item.allOnline ? "green" : "orange",
                      textAlign: "center",
                    }}
                    colSpan={2}
                  >
                    {item.allOnline ? (
                      "En línea"
                    ) : (
                      <span>
                        Elementos fuera de línea - <TiWarning />
                      </span>
                    )}
                  </td>
                </tr>

                <tr
                  style={{ visibility: "collapse" }}
                  id={item.stateCode}
                  className="second-headers"
                  key={item.stateCode}
                >
                  <td>Sucursal</td>
                  <td>IP</td>
                  {/* <td>Estatus</td> */}
                  <td>Estatus listener</td>
                  <td>Estatus downloader</td>
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
                      <td>{j.ipAddress}</td>
                      {/* <td style={handleConnectionColor(j.isOnline)}>
                        {j.isOnline === null
                          ? "--"
                          : j.isOnline
                          ? "En línea"
                          : "Desconectado"}
                      </td> */}

                      <td style={handleConnectionColor(j.isListenerOnline)}>
                        {j.listenerInformation}
                      </td>
                      <td style={handleConnectionColor(j.isDownloaderOnline)}>
                        {j.downloaderInformation}
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
