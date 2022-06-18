const devConfig = require("./database.dev");
const mysql = require("mysql");

class MySql {
  loaded = false;
  connection = null;
  constructor() {
    if (!this.loaded) {
      this.connection = mysql.createConnection({
        ...devConfig,
      });
    }else{
        return this.connection
    }
    this.loaded = true;
  }
}
let useSql = new MySql();
module.exports = useSql.connection;
