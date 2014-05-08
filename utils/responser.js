/**
 * 统一返回json的格式
 * @author: biangang
 * @date: 2014/5/8
 * @param: {isSuccess|boolean}
 * @param: {data|string or object}
 * @example: isSuccess == true => {success: true, content: content}
 *           isSuccess == false => {success: false, message: "errorMsg", content: ""}
 */
'use strict';
module.exports = function(isSuccess, data){
    var ret = {};
    if (isSuccess) {
        ret.content = data;
    } else {
        ret.content = "";
        ret.msg = data;
    }
    ret.success = isSuccess;
    return ret;
};