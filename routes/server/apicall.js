const mysql = require("../../database/index");
const baseResponse = require("../../utils/baseResponse");
module.exports = {
  async main(req, res, next) {
    try {
      let result = await this.getAllType();
      return new baseResponse().success(result);
    } catch (error) {
      return  new baseResponse().fail(error,'操作成功');
    }
  },
  async getAllType() {
    return new Promise((resolve, reject) => {
      mysql.query(
        "select * from api_number_calls",
        function (err, rows, fields) {
          if (err) {
            const { sqlMessage } = err;
            reject(sqlMessage);
          }
          resolve(rows);
        }
      );
    });
  },
};
