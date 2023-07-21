const mongoose = require("mongoose");

let getDatabase = function(){
    let DB_URL = process.env.DB_URL
    // console.log(process.env);
    // console.log(process.env.DB_URL);
        let options = {
            family: 4
        };
        mongoose.connect(DB_URL, options);

        let db = mongoose.connection;
        db.once('open', () =>{
            console.log('DB connection successful');
        });
        db.on('error', (err)=>{
            console.log('DB connection failed');
            console.log(err);
        });
        return db;
    }
        module.exports = getDatabase;