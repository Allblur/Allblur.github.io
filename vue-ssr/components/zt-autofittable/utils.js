/**
 * 获取字符串在页面的宽度
 * @{String} 目标源
 * @returns fn
 */
function isString(str){
  return Object.prototype.toString.call(str) === "[object String]";
}

function getStrLen(str){
  var len = 0;
  for (var i=0; i<str.length; i++) {
    var c = str.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
      len++;
    }
    else {
      len+=2;
    }
  }
  return len;
}

export const getTextRect = () => {
  const elId = '__get-text-rect'
  let elNode = document.getElementById(elId)
  if (!elNode) {
    elNode = document.createElement('div')
    elNode.id = elId
    elNode.style.cssText = 'visiblity:hidden; opacity: 0; position: fixed; top: -9999px; left: -9999px'
    document.body.appendChild(elNode)
  }

  return (text, cssText = 'font-size: 12px; padding: 0 10px;') => {
    if (typeof text !== 'string') return {}
    let textElement = '<span style="box-sizing: border-box;'+ cssText +'">'+ text +'</span>'
    elNode.innerHTML = textElement
    const elRect = elNode.getBoundingClientRect()
    return elRect
  }
}

export const flattenData = function (data) {
  if (!Array.isArray(data)) return {}
  return data.reduce((acc, cur) => {
    for (let item in cur) {
      if (!acc[item]) acc[item] = []
      acc[item].push(cur[item])
    }
    return acc
  }, {})
}

// Get  string length of each item in array
export const maxNumberInArray = function (data, formatter, row = [], col) {
  let result = {
    value: '',
    length: 0,
    index: -1
  }

  Array.isArray(data) && data.forEach((value, index) => {
    let _vnode = formatter && formatter(row, col, value || '',index);
    let text;
    if(isString(_vnode)){
      text = _vnode;
    }else if(_vnode && _vnode.componentOptions && _vnode.componentOptions.children && _vnode.componentOptions.children[0]){
      text = _vnode.componentOptions.children[0].text;
    }else if(_vnode && _vnode.data && _vnode.data.attrs && _vnode.data.attrs.text){
      text = _vnode.data.attrs.text
    }else if(_vnode && _vnode.children && _vnode.children.length && _vnode.children[0]){
      text = _vnode.children[0].text;
    }
    let strVal = String(formatter ? text : value || '')
    let strLen = getStrLen(strVal);
    if (strLen > result.length) {
      result = { value: strVal, length: strLen, index }
    }
  })

  return result
}

// https://github.com/ElemeFE/element/blob/dev/packages/table/src/table-footer.js#L8
export const getColumnSummary = (instance) => {
  let sums = [];
  if (instance.summaryMethod) {
    sums = instance.summaryMethod({ columns: instance.columns, data: instance.store.states.data });
  } else {
    instance.columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = instance.sumText;
        return;
      }
      const values = instance.store.states.data.map(item => Number(item[column.property]));
      const precisions = [];
      let notNumber = true;
      values.forEach(value => {
        if (!isNaN(value)) {
          notNumber = false;
          let decimal = ('' + value).split('.')[1];
          precisions.push(decimal ? decimal.length : 0);
        }
      });
      const precision = Math.max.apply(null, precisions);
      if (!notNumber) {
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return parseFloat((prev + curr).toFixed(Math.min(precision, 20)));
          } else {
            return prev;
          }
        }, 0);
      } else {
        sums[index] = '';
      }
    });
  }
  return sums
}

export default {
  getTextRect,
  flattenData,
  maxNumberInArray,
  getColumnSummary
}