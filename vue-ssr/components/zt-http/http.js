import axios from 'axios';
import Cookie from 'js-cookie'

axios.defaults.baseURL ='http://empdev.jingruiauto.com/v1/';
axios.defaults.loginHome = "/store/views/login/#/login";
axios.defaults.platform = "pc";
axios.defaults.timeout = 3000;

let apiPrefix = {
  customerApi:'/cus'						          // 潜客
  ,vehicleApi:'/veh'						          // 车型库
  ,systemApi:'/sys'						            // 系统
  ,fitClass:'/veh/fitClass'				        // 配件分类
  ,fitBrand:'/veh/fitBrand'				        // 配件品牌分类接口
  ,fitExtProperty:'/veh/fitExtProperty'	  // 配件(零件)规格接口
  ,comarea:'/sys/comarea'					        // 省市区域查询接口
  ,upload:'/upl'							            // 上传接口网关
  ,equ:'/equ'							                // 设备
  ,act:'/act'							                // 财务管理
  ,security:'/security'							      // 安全
};

//http request 拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);


//http response 拦截器
axios.interceptors.response.use(
  response => {
    let _vm = window.vm || {};
    let res = response.data;
    let code = parseInt(res.code);
    let msg = res.message || '请求失败!';
    if(code){
      if(_vm.$message){
        _vm.$message.error(msg);
      }
      if(axios.defaults.platform === "pc" && (code === 11003 || code === 11004)){
        Cookie.remove("token",{domain:".zhengtongauto.com"});
        let href = window.location.href;
        window.location.href = axios.defaults.loginHome +"?from="+encodeURIComponent(href);
      }
      if(axios.defaults.platform === "mobile" && code === 11009){
        window.alert(msg)
      }
    }
    return response;
  },
  (error) => {
    let _vm = window.vm || {};
    if(error.response){
      let status = error.response.status;
      let resData = error.response.data;
      let code = resData.code;
      let msg = resData.message;
      if(_vm.$message){
        _vm.$message.error(msg);
      }
      if(status === 401){
        if(axios.defaults.platform === "pc" && (code === 11003 || code === 11004)){
          Cookie.remove("token",{domain:".zhengtongauto.com"});
          let href = window.location.href;
          window.location.href = axios.defaults.loginHome +"?from="+encodeURIComponent(href);
        }
        if(code === 11009){
          window.alert(msg)
        }
      }
      return Promise.reject(error);
    }
    if(_vm.$message) _vm.$message.error("服务器请求错误")
    return Promise.reject(error)
  }
);


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

function get(url,params={},config){
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params:params
    },config)
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

function post(url,data = {},config){
  return new Promise((resolve,reject) => {
    axios.post(url,data,config)
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url,data)
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,data)
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
  })
}
/**
 * 封装delete请求
 * @param  url
 * @param  params
 * @returns {Promise}
 */
function Delete(url,params={}){
  return new Promise((resolve,reject) => {
    axios.delete(url,{
      params:params
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default {
  axios,
  get,
  post,
  put,
  Delete,
  apiPrefix
}