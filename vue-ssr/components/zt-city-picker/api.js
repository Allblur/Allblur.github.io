/*
*  @描述：接口文件
*  @作者：邱康松
*  @创建时间：2019/1/4
*/

import Http from "zt-http";

Http.axios.defaults.baseURL = "/api";

export default {
  methods:{
    //根据code获取区域列表
    getArea(options,config){
      return Http.post( "sys/comarea/get",options,config);
    }
  }
}