const sql = require("mssql");
require('dotenv').config()

const config = {
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
};

async function nestedTree() {
    let tree = []

    await sql.connect(config).then(() => {
        return sql.query`SELECT * FROM hosts`
    }).then(result => {
        let data = result.recordsets[0]

        //Enheter
        let Enheter = [...new Set(data.map(x => x.dept))]
        Enheter.map(enh => tree.push({ name: enh, groups: [] }))

        const groups = new Map();
        const systems = new Map();
        const entities = new Map();
        tree.map((enhet, i) => {
            data.forEach(item => {
                const { ID, dept, group, sub_group, host, label, OS, IP, status, service } = item
                //Group
                if (enhet.name == dept) {
                    if (!groups.has(group)) {
                        groups.set(group, true);
                        tree[i].groups.push({
                            name: group,
                            systems: []
                        });
                    }
                }
                //System
                enhet.groups.map((group, index) => {
                    if (group.name == item.group) {
                        if (!systems.has(sub_group)) {
                            systems.set(sub_group, true);
                            tree[i].groups[index].systems.push({ name: sub_group, entities: [] })
                        }
                    }
                    //Entity
                    group.systems.map((system, ii) => {
                        if (system.name == sub_group) {
                            if (!entities.has(host)) {
                                entities.set(host, true)
                                tree[i].groups[index].systems[ii].entities.push({
                                    id: ID,
                                    name: host,
                                    label: label,
                                    operatingSystem: OS,
                                    IP: IP,
                                    status: { code: status, comment: service }
                                })
                            }
                        }
                    })
                })
            })
        })
    })
    return tree

}

exports.nestedTree = nestedTree