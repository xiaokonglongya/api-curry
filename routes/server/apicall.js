const mysql = require("../../database/index");
const baseResponse = require("../../utils/baseResponse");
module.exports = {
  async main(req, res, next) {
    try {
      let result = await this.getAllType();
      return new baseResponse().success(result);
    } catch (error) {
      return new baseResponse().fail(error);
    }
  },
  async add() {},
  async getOnceByCode(req) {
    let code = req.params?.code;
    if (!code) {
      return new baseResponse().fail("缺少code参数");
    }
    try {
      let result = await this.getTypeByCode(code);
      return new baseResponse().success(result);
    } catch (error) {
      return new baseResponse().fail(error);
    }
  },
  /**
   * sql 进行添加操作
   */
  async addtype(req) {
    let code = req?.body?.code;
    let isHave = await this.getOnceByCode({ params: { code } });
    if (isHave && isHave.data !== null) {
      return new baseResponse().fail(`${code}已存在`);
    }
    return new Promise((resolve, reject) => {
      const desc = req?.body?.desc || "描述文字";
      // 开始进行添加
      let addSql = `insert into api_number_calls (api_code,api_desc) values ('${code}','${desc}')`;
      mysql.query(addSql, (err, rows, fields) => {
        if (err) {
          reject(new baseResponse().fail(err.sqlMessage || "插入错误"));
        }
        resolve(new baseResponse().success("操作成功"));
      });
    });
  },
  /**
   * 根据code查询单个类型
   * @param {*} code 类型code
   */
  async getTypeByCode(code) {
    return new Promise((resolve, reject) => {
      mysql.query(
        `select * from api_number_calls where api_code = "${code}"`,
        function (err, rows, fields) {
          if (err) {
            const { sqlMessage } = err;
            reject(sqlMessage);
          }
          let result;
          if (rows && rows.length >= 1) {
            result = rows[0];
          } else {
            reject(`未找到code是${code}的类型`);
          }
          resolve(result);
        }
      );
    });
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
