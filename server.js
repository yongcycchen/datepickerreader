import express from "express";
import sql from "mssql";
import pkg from "body-parser";
const app = express();
const { json } = pkg;
const start = async () => {
  const sqlConfig = {
    user: "FSATOperator",
    password: "Ctc2013",
    database: "DataCollection",
    server: "SCC1SQL01s150",
    trustServerCertificate: true,
  };
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig);
    console.log("sql connected!!");
  } catch (err) {
    // ... error checks
  }
};

app.set("trust proxy", true);
app.use(json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// app.get("/:test", async (req, res) => {
//   console.log(req.params.test);
// });
app.get("/:begin/:end", async (req, res) => {
  const databegin = req.params.begin;
  const dataend = req.params.end;
  console.log(databegin);
  console.log(dataend);
  const result = await sql.query`SELECT [DataTime]
    ,[CH1PV]
    ,[CH2PV]
    ,[CH5PV]
    ,[CH7PV]
    ,[CH1SV]
    ,[CH2SV]
    ,[CH5SV]
    ,[CH7SV]
    ,[CH1Output]
    ,[CH2Output]
    ,[CH5Output]
    ,[CH7Output]
  FROM [DataCollection].[dbo].[B7_MA901_time_log]
  WHERE ${databegin} <= B7_MA901_time_log.DataTime and
  B7_MA901_time_log.DataTime <= ${dataend} 
  ORDER BY B7_MA901_time_log.DataTime ASC`;
  res.send(JSON.stringify(result));
});

app.listen(4000);
start();
