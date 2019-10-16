/*
*  @描述：文件作用
*  @作者：付文松
*  @创建时间：2018/7/17
*/

export default {
  namespaced:true,
  state:{
    foursId:0,
    foursName:"",
    userInfo:null,
    groupResourcesAry:null,
    groupResourcesObj:null,
    storeResourcesAry:null,
    storeResourcesObj:null,
    biResourcesAry:null,
    biResourcesObj:null,
    sysBtnPermissions:null,
    currentProjectCode:"",
    currentProjectName:"",
    foursInfo:null,
    messageNum: null
  },
  mutations:{
    //门店ID
    setFoursId(state,fourid){
      state.foursId = fourid;
    },
    //门店名称
    setFoursName(state,foursName){
      state.foursName = foursName;
    },
    //用户信息
    setUserInfo(state,userInfo){
      state.userInfo = userInfo;
    },
    //集团权限，返回数组
    setGroupResourcesAry(state,groupResources){
      state.groupResourcesAry = groupResources;
    },
    //集团权限，返回对象
    setGroupResourcesObj(state,groupResources){
      state.groupResourcesObj = groupResources;
    },
    //门店权限，返回数组
    setStoreResourcesAry(state,storeResources){
      state.storeResourcesAry = storeResources;
    },
    //门店权限，返回对象
    setStoreResourcesObj(state,storeResources){
      state.storeResourcesObj = storeResources;
    },
    //BI数据决策权限，返回数组
    setBIResourcesAry(state,BIResources){
      state.biResourcesAry = BIResources;
    },
    //BI数据决策权限，返回对象
    setBIResourcesObj(state,BIResources){
      state.biResourcesObj = BIResources;
    },
    //当前项目code
    setCurrentProjectCode(state,code){
      state.currentProjectCode = code;
    },
    //系统中所有按钮权限
    setSysBtnPermissions(state,permissions){
      state.sysBtnPermissions = permissions;
    },
    //当前项目名称
    setCurrentProjectName(state,name){
      state.currentProjectName = name;
    },
    //当前项目名称
    setFoursInfo(state,info){
      state.foursInfo = info;
    },
    // 未读数量
    setMessageNum(state, num) {
      state.messageNum = num || null;

    }
  }
}