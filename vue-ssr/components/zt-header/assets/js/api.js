/*
*  @描述：头部API
*  @作者：付文松
*  @创建时间：2018/7/15
*/

import Http from "zt-http";

Http.axios.defaults.baseURL = "/api";

export default {
  methods:{
    //用户id查询用户拥有的角色(去重)
    requestGetUsersFoursByUserId(options,config){
      return Http.post(Http.apiPrefix.systemApi + "/SysFours/getUsersFoursByUserId",options,config);
    }
    //根据用户Id查询资源列表
    ,requestGetSysResourceByUserId(options,config){
      return Http.get(Http.apiPrefix.systemApi + "/security/resource/getSysResourceByUserId" + options,null,config);
    }
    //根据token获取员工信息
    ,requestGetSysUserByToken(options,config){
      return Http.get(Http.apiPrefix.systemApi + "/security/user/getUserByToken/",options,config);
    }
    //保存用户选择的门店记录
    ,requestSaveUserFoursRecords(options,config){
      return Http.post(Http.apiPrefix.systemApi + "/SysFours/saveUserFoursRecords/",options,config);
    }
    // 门店端查询系统通知列表
    ,requestQueryFoursUserNoticeListByParam(options,config){
      return Http.post("/msg/msgSystemNotice/queryFoursUserNoticeListByParam",options,config);
    }
    // 获取用户未读数量的系统通知
    ,requestMsgSystemNoticeGetUnReadCount(userId, options, config){
      return Http.get(`/msg/msgSystemNotice/getUnReadCount/${userId}`, options, config);
    }
  }
}