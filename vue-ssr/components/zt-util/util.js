
  
import { round, add, subtract, multiply, divide } from 'mathjs'

const numberFormat = (num, decimals, unit, dec_point, thousands_sep, roundtag) => {
  /*
  * 格式化金额
  * 参数说明：
  * number：要格式化的数字
  * decimals：保留几位小数, 默认2位
  * unit: 单位, 默认没有单位
  * dec_point：小数点符号
  * thousands_sep：千分位符号
  * roundtag:舍入参数，默认"round" 四舍五入, "floor"向下取, "ceil" 向上取
  * */
  unit = unit || '';
  let number = num;
  if(isNaN(num) || !num) {
    number = 0;
  }
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  roundtag = roundtag || 'round';
  decimals = decimals==null ? 2 : decimals;


  let n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    // sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    sep = thousands_sep || ',',
    // dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    dec = dec_point ||  '.',
    s = '',
    re = /(-?\d+)(\d{3})/,
    toFixedFix = function (n, prec) {
      if(roundtag === 'round') {
        // console.log('round.............')
        return round(n, prec).toString();
      }
      return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
    };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2');
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }

  return s.join(dec) + unit;
}

export default {
  numberFormat, // 格式化小数
  add, // 加法运算
  subtract, // 减法运算
  multiply, // 乘法运算
  divide // 除法运算
}
