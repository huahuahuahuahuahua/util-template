//debounce.js

const FUNC_ERROR_TEXT = "Expected a function";

const nativeMax = Math.max, //原生最大值方法
  nativeMin = Math.min; //原生最小值方法
interface IOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}
/**
 * 函数去抖，也就是说当调用动作n毫秒后，才会执行该动作，若在这n毫秒内又调用此动作则将重新计算执行时间。
 *
 * @param {Function} func 需要去抖的函数.
 * @param {number} [wait=0] 延迟执行的时间.
 * @param {Object} [options={}] 选项对象.
 * @param {boolean} [options.leading=false] 指定是否在超时前调用.
 * @param {number} [options.maxWait] func延迟调用的最大时间.
 * @param {boolean} [options.trailing=true] 指定是否在超时后调用.
 * @returns {Function} 返回去抖之后的函数.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */


export type TAnyFunction = (...args: any[]) => void
import isObject from './isObject'
export function debounce(
  func: TAnyFunction,
  wait = 1000,
  options: IOptions = { }
): TAnyFunction {
  let lastArgs, //上次调用参数
    lastThis, //上次调用this
    maxWait, //最大等待时间
    result, //返回结果
    timerId, //timerId
    lastCallTime, //上次调用debounced时间,即触发时间，不一定会调用func
    lastInvokeTime = 0, //上次调用func时间，即成功执行时间
    leading = false, //超时之前
    maxing = false, //是否传入最大超时时间
    trailing = true; //超时之后

  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = Number(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax(Number(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    //调用func，参数为当前时间
    const args = lastArgs, //调用参数
      thisArg = lastThis; //调用的this

    lastArgs = lastThis = undefined; //清除lastArgs和lastThis
    lastInvokeTime = time; //上次调用时间为当前时间
    result = func.apply(thisArg, args); //调用func，并将结果返回
    return result;
  }

  function leadingEdge(time) {
    //超时之前调用
    lastInvokeTime = time; //设置上次调用时间为当前时间
    timerId = setTimeout(timerExpired, wait); //开始timer
    return leading ? invokeFunc(time) : result; //如果leading为true，调用func,否则返回result
  }

  function remainingWait(time): number{
    //设置还需要等待的时间
    const timeSinceLastCall = time - lastCallTime, //距离上次触发的时间
      timeSinceLastInvoke = time - lastInvokeTime, //距离上次调用func的时间
      result = wait - timeSinceLastCall; //还需要等待的时间

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    //是否应该被调用
    const timeSinceLastCall = time - lastCallTime, //距离上次触发时间的时间
      timeSinceLastInvoke = time - lastInvokeTime; //距离上次调用func的时间

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    //刷新timer
    const time = new Date();
    if (shouldInvoke(time)) {
      //如果可以调用，调用trailingEdge
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time)); //不调用则重置timerId
  }

  function trailingEdge(time) {
    //超时之后调用
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      //如果设置trailing为true,并且有lastArgs，调用func
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined; //清除lastArgs和lastThis
    return result; //否则返回result
  }

  function cancel() {
    //取消执行
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    //直接执行
    return timerId === undefined ? result : trailingEdge(new Date());
  }

  function debounced(this: any) {
    const time = new Date(),
      isInvoking = shouldInvoke(time); //判断是否可以调用

    lastArgs = arguments; //得到参数
    lastThis = this; //得到this对象
    lastCallTime = time; //触发时间

    if (isInvoking) {
      if (timerId === undefined) {
        //首次触发，调用leadingEdge
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // 处理多次频繁的调用
        timerId = setTimeout(timerExpired, wait); //设置定时器
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      //如果没有timer,设置定时器
      timerId = setTimeout(timerExpired, wait);
    }
    return result; //返回result
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
export default {
  debounce,
};
