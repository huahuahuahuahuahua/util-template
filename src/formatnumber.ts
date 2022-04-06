/*
 * @Author: t_winkjqzhang
 * @Date: 2022-04-02 16:18:36
 * @LastEditTime: 2022-04-06 01:04:03
 * @Description:
 */
/**
 * @name: 
 * @msg: 
 * @param {number} num 
 * @return {object} number:转换后的值，value：倍数
 * @Descripttion: 转换number为指定数值
 */
export function formatNumber(num: number): object {
  num = Number(num);
  if (num === 0) {
    return {
      number:num.toString(),
      value:"",
    };
  } else if (num > 1 && num < 1000) {
    return{
      number:num.toString(),
      value:"",
    };
  } else if (num > 1000 && num < 10000) {
    //千
    return  {
      number:(num/1000).toFixed(2).toString(),
      value:"千",
    };
  } else if (num > 10000 && num < 1000000) {
    //万
    return  {
      number:(num/10000).toFixed(2).toString(),
      value:"万",
    };
  } else if (num > 1000000 && num < 10000000) {
    //百万
    return {
      number:(num/1000000).toFixed(2).toString(),
      value:"百万",
    };
  } else if (num > 10000000 && num < 100000000) {
    //千万
    return {
      number:(num/10000000).toFixed(2).toString(),
      value:"千万",
    };
  } else if (num > 100000000 && num < 10000000000) {
    //亿
    return {
      number:(num/100000000).toFixed(2).toString(),
      value:"亿",
    };
  }
  //    else if (num > 10000000000 && num < 100000000000) {
  //     //百亿
  //     return (num / 10000000000).toFixed(2);
  //   } else if (num > 100000000000 && num < 1000000000000) {
  //     //千亿
  //     return (num / 100000000000).toFixed(2);
  //   } else if (num > 1000000000000 && num < 10000000000000) {
  //     //万亿
  //     return (num / 1000000000000).toFixed(2);
  //   }
  else {
    return {
      msg:"error 请输入1-10000000000 的数字"
    };
  }
}
export default {
  formatNumber
};
