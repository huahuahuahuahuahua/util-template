/*
 * @Descripttion: 
 * @version: 
 * @Author: huawink
 * @Date: 2022-04-05 23:59:48
 * @LastEditTime: 2022-04-06 01:01:46
 */
/**
 * @name: 
 * @msg: 
 * @param {object} obj 对象
 * @return {boolean} 
 * @Descripttion: 判断是否为对象
 */
export function isObject(obj:object) :boolean{
    const type = typeof obj;
    return obj != null && (type == 'object' || type == 'function');
}
export default isObject