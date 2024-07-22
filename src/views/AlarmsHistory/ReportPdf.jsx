import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";

const styles = StyleSheet.create({
  page: { flexDirection: "column", padding: 25 },

  table: {
    fontSize: 10,
    width: 550,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "stretch",
    flexWrap: "nowrap",
    alignItems: "stretch",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "stretch",
    flexWrap: "nowrap",
    alignItems: "stretch",
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 35,
  },
  cell: {
    //borderColor: "#cc0000",
    borderStyle: "none",
    borderWidth: 2,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    alignSelf: "stretch",
    textAlign: "center",
  },
  header: {
    backgroundColor: "#eee",
  },
  headerText: {
    fontSize: 11,
    fontWeight: 1200,
    color: "#1a245c",
    margin: 8,
  },
  tableText: {
    margin: 10,
    fontSize: 10,
    color: "black",
    textAlign: "center",
  },
});

const ReportPdf = () => {
  return (
    <Document title="Reporte de alarmas">
      <Page size={"A4"} style={styles.page} wrap orientation="landscape">
        <Text>Reporte de alarmas</Text>
        <Table>
          <TH>
            <TD>Header 1</TD>
            <TD>Header 2</TD>
            <TD>Header 1</TD>
            <TD>Header 2</TD>
          </TH>
          <TR>
            <TD>Data 1</TD>
            <TD>Data 2</TD>
            <TD>Data 1</TD>
            <TD>Data 2</TD>
          </TR>
        </Table>
      </Page>
    </Document>
  );
};

export default ReportPdf;
