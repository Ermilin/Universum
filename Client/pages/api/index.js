const sql = require("mssql");

const config = {
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
};

const query = "select * from [universe].[dbo].[hosts]";

export default async function handler(req, res) {
  return new Promise((resolve, reject) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-cache");

    sql.connect(config, function (err) {
      if (err) {
        res.json(err);
        res.status(405).end();
        return resolve();
      }

      const request = new sql.Request();

      request.query(query, function (err, recordset) {
        if (err) {
          res.json(err);
          res.status(405).end();
          return resolve();
        }
        res.send(JSON.stringify(recordset.recordsets[0], null, 1));
        resolve();
      });
    });
  });
}
