var express = require('express');
var app = express();
var sql = require("mssql");

// config for your database
var config = {
    user: 'djrevelo@sql-databases-bp',
    password: 'BPichincha2020',
    server: 'sql-databases-bp.database.windows.net',
    database: 'RPA_VPN'
};

// connect to your database
async function InsertarBD (nombre, equipo, ip){
console.log( nombre + equipo + ip)
    sql.connect(config, function (err) {

        if (err) console.log(err);
    
        // create Request object
        var request = new sql.Request();
    
        // query to the database and get the records
        request.query(`INSERT INTO UserVPN (nameuser, namepc, ipuser) VALUES ('${nombre}', '${equipo}', '${ip}' )`,function (err, recordset) {
            if (err) console.log(err)
    
            // send records as a response
          //  res.send(recordset);
    
        });
    });
    
    
}

module.exports.InsertarBD = InsertarBD;