const mysql = require('mysql');
const {config} = require('../config/creds');
const {queries} = require('./queries');




const connection = mysql.createConnection(config);



function getQuery(query, callback){
    connection.query(query, function(err, res){
        if (err){throw err};
        
        return callback(res);
    });
   
};



function quit(){
    connection.end();
    process.exit;
};


module.exports = {
    getQuery,
    quit
    
}