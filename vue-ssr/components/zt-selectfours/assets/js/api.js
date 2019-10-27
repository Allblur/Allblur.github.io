/*
*  @描述：头部API
*  @作者：付文松
*  @创建时间：2018/7/15
*/

import Http from "zt-http";

Http.axios.defaults.baseURL = "/api";

export default {
  methods:{
    // 条件查询门店，组织机构等信息
    requestSysFoursGetOrgFoursSelective(options,config){
      return Http.post(Http.apiPrefix.systemApi + "/SysFours/getOrgFoursSelective",options,config);
    },
    // 查询所有品牌部
    requestOrganizationGetBrandGroup(options,config){
      return Http.get(Http.apiPrefix.systemApi + "/organization/getBrandGroup",options,config);
    },
    // 根据品牌部查品牌
    requestFoursBandQueryBrandsByCode(code, options,config){
      return Http.get(Http.apiPrefix.systemApi + "/foursBand/queryBrandsByCode/"+code,options,config);
    }
  }
}