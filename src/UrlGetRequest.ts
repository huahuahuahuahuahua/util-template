/*
 * @Author: t_winkjqzhang
 * @Date: 2022-03-31 15:54:59
 * @LastEditTime: 2022-04-06 20:57:00
 * @Description: Do not edit
 */
//分离url参数，获取tagid

/**
 * @param {string} url //完整的url
 * @param {string} variable //param参数，键
 * @returns {string} //param参数，variable对应的值
 * @Date: 2022-04-02 15:03:38
 * @Description:url分离出参数
 */
export interface IUrlGetRequest{
    url:string;
    variable:string;
}
export function UrlGetRequest({url, variable}:IUrlGetRequest) :string{
  let query: string = url.split("?")[1];
  // let query: string = window.location.search.substring(1);
  // 兼容微信授权回来之后 url 错乱的问题
  if (query.indexOf("&openid=") < 0 && query.indexOf("openid=") > 0) {
    query = query.replace(/openid=/, function (m) {
      return "&" + m;
    });
  }
  
  const vars: string[] = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair: string[] = vars[i].split("=");
    if (pair[0] === variable) return pair[1];
  }
  return "false";
}
export default UrlGetRequest;
