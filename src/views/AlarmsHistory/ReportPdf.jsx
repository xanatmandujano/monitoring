import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import banbajio from "/config.json";

const styles = StyleSheet.create({
  page: { flexDirection: "column", padding: 25 },
  view: {
    display: "flex",
    //flexDirection: "row",
    //alignContent: "space-around",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: "15px",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 50,
  },
  tdHeader: {
    fontSize: "10px",
    padding: "2.5px",
    backgroundColor: "#758694",
    color: "white",
  },
  td: {
    fontSize: "10px",
    padding: "2.5px",
  },
});

const ReportPdf = ({ report }) => {
  const handleDate = (date) => {
    const alarmDateTime = new Date(date);
    const alarmDate = alarmDateTime.toLocaleDateString("en-GB", {
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
  return (
    <Document title="Reporte de alarmas">
      <Page size={"A4"} style={styles.page} wrap orientation="landscape">
        <View style={styles.view}>
          <Image style={styles.image} src={banbajio.assets.banbajio} />
          <Text style={styles.title}>Reporte de alarmas</Text>
        </View>
        <Table>
          <TH>
            <TD style={styles.tdHeader}>Código de alarma</TD>
            <TD style={styles.tdHeader}>Sucursal</TD>
            <TD style={styles.tdHeader}>Fecha</TD>
            <TD style={styles.tdHeader}>Sensor</TD>
            <TD style={styles.tdHeader}>Estatus</TD>
            <TD style={styles.tdHeader}>Usuario</TD>
          </TH>

          {report &&
            report.map((item) => (
              <TR key={item.alarmId}>
                <TD style={styles.td}>{item.alarmCode}</TD>
                <TD style={styles.td}>{item.branchCodeName}</TD>
                <TD style={styles.td}>{handleDate(item.creationDate)}</TD>
                <TD style={styles.td}>{item.deviceName}</TD>
                <TD style={styles.td}>{item.status}</TD>
                <TD style={styles.td}>{item.userName}</TD>
              </TR>
            ))}
        </Table>
      </Page>
    </Document>
  );
};

export default ReportPdf;
