import axios from "axios";
import React, { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { CSVLink } from "react-csv";

function App() {
  const [selected, setSelected] = useState(false);
  const [csvdata, setData] = useState([]);
  const [beginDatetime, setBeginDatetime] = useState();
  const [endDatetime, setEndDatetime] = useState();
  const onClick = async () => {
    let trbegin = new Date(beginDatetime);
    let trend = new Date(endDatetime);
    trbegin.setHours(trbegin.getHours() - 7);
    trend.setHours(trend.getHours() - 7);
    console.log(trbegin.toISOString());
    console.log(trend.toISOString());
    await axios
      .get(
        `http://localhost:4000/${trbegin.toISOString()}/${trend.toISOString()}`
      )
      .then(async (response) => {
        const res = response.data.recordset;
        // console.log(response);
        const csv = await transform(res);
        setData(csv);
        setSelected(true);
        // console.log(csv);
      });
  };
  const transform = async (req) => {
    const columns = [
      "DataTime",
      "CH1PV",
      "CH2PV",
      "CH5PV",
      "CH7PV",
      "CH1SV",
      "CH2SV",
      "CH5SV",
      "CH7SV",
      "CH1Output",
      "CH2Output",
      "CH5Output",
      "CH7Output",
      "absolute time",
    ];
    let rows = [];
    const date1 = new Date(beginDatetime);
    date1.setHours(date1.getHours() - 7);
    for (let i = 0; i < req.length; i++) {
      const row = req[i];
      // rows.push([row.DataTime, row.CH1PV, row.CH1PV, row.CH1Output]);
      const date2 = new Date(row.DataTime);
      const absolute = (date2.getTime() - date1.getTime()) / 1000;
      rows.push([
        row.DataTime,
        row.CH1PV,
        row.CH2PV,
        row.CH5PV,
        row.CH7PV,
        row.CH1SV,
        row.CH2SV,
        row.CH5SV,
        row.CH7SV,
        row.CH1Output,
        row.CH2Output,
        row.CH5Output,
        row.CH7Output,
        absolute,
      ]);
    }
    return [columns, ...rows];
  };
  const unSelect = () => {
    setSelected(false);
  };
  if (!selected) {
    return (
      <div>
        <DateTimePicker onChange={setBeginDatetime} value={beginDatetime} />
        <DateTimePicker onChange={setEndDatetime} value={endDatetime} />
        <button onClick={onClick}>Select</button>
      </div>
    );
  } else {
    return (
      <div>
        <DateTimePicker onChange={setBeginDatetime} value={beginDatetime} />
        <DateTimePicker onChange={setEndDatetime} value={endDatetime} />
        <CSVLink onClick={unSelect} data={csvdata}>
          Download
        </CSVLink>
      </div>
    );
  }
}
export default App;
