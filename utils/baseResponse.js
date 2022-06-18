/**
 * 统一返回结果处理
 */

const codeStatusEmun = {
  200: Symbol("成功"),
  500: Symbol("操作失败"),
  404: Symbol("接口未找到"),
  400: Symbol("参数错误"),
};

/**
 * 公用的返回结果体
 */
 class BaseResponse {
  static code;
  static msg;
  static data;
  /**
   *
   * @param {*} code  200:成功
   * @param {*} msg     返回消息
   * @param {*} data    返回数据
   */
  constructor(code, msg, data) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
  success(msg, data) {
  return  new BaseResponse(200, msg ? msg : codeStatusEmun[200], data ? data : {});
  }
  fail(msg, data = null) {
   return new BaseResponse(400, msg ? msg : codeStatusEmun[400], data ? data : null);
  }
}

module.exports = BaseResponse