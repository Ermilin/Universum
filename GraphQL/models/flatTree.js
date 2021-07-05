const sql = require("mssql");

const config = {
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
};

export async function getSystems() {
    await sql.connect(config).then(() => {
        return sql.query`SELECT * FROM hosts`
    }).then(result => {
        return result.recordsets[0]
    })
}