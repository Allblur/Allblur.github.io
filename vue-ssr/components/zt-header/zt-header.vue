/*
*  @描述：页面结构的头部组件，包括门店选择、logo、当前登录人等
*  @作者：付文松
*  @创建时间：2018-04-20
*/
<template>
  <div class="frame-header-box flex_sc">
    <!-- logo -->
    <div class="logo-box flex_lc">
      <img class="icon" :src="logo"/>
    </div>
    <div class="person-info flex_cc">
      <el-button @click="showFilterDialog" type="text" class="button__text-company">门店：<span>{{currentFours.foursName.length && dPlatform === 'group' || dPlatform === 'bi' ? currentFours.foursName[0] : currentFours.foursName}} <i v-if="dPlatform === 'group' || dPlatform === 'bi'">+{{currentFours.foursName.length}}</i></span><i class="el-icon-caret-bottom" v-if="currentFours.foursName"></i></el-button>
      <el-popover
              popper-class="person-info-popover"
              placement="bottom"
              width="140"
              trigger="hover">
        <ul class="person-info-select">
          <li @click="logOut"><i class="iconfont zticon-icon_exit"></i> 退出</li>
        </ul>
        <p slot="reference" class="button__text-company">{{dUserName}} {{dPosition}} <i class="el-icon-caret-bottom" v-if="dUserName || dPosition"></i></p>
      </el-popover>
      <div @click="goMessage" class="header__badge">
        <el-badge :value="messageNum" :max="99" class="item" :hidden="!messageNum">
          <i class="iconfont zticon-lingdang"></i>
        </el-badge>
      </div>
    </div>
    <el-dialog title="筛选数据源" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="showClose" :visible.sync="storeDialogVisible" width="900px">
      <!--<column-box title="品牌">-->
      <!--<template slot="body">-->
      <!--<div class="filterdata__box">-->
      <!--<div class="filterdata__header">-->
      <!--<el-checkbox @change="brandCheckAllChange" v-model="brandAll" :indeterminate="brandIsIndeterminate">全选</el-checkbox>-->
      <!--</div>-->
      <!--<div class="filterdata__body">-->
      <!--<el-checkbox-group @change="brandCheckedChange" v-model="foursInfo.brandFoursIds">-->
      <!--<el-checkbox v-for="brand in brandList" :label="brand.foursId" :key="brand.brandId">{{brand.brandName}}</el-checkbox>-->
      <!--</el-checkbox-group>-->
      <!--</div>-->
      <!--</div>-->
      <!--</template>-->
      <!--</column-box>-->
      <column-box last title="门店">
        <template slot="body">
          <div class="filterdata__searchbox">
            <el-form :inline="true" class="filterdata__searchbox-form">
              <el-form-item>
                <el-input v-model="searchParams.foursName"  style="width:300px;" placeholder="请输入门店名称"></el-input>
              </el-form-item>
              <!--<el-form-item><el-button @click="searchFours" type="primary">查询</el-button></el-form-item>-->
            </el-form>
          </div>
          <div class="filterdata__box">
            <div class="filterdata__header"></div>
            <div class="filterdata__body">
              <!--集团项目用 checkbox-->
              <el-checkbox-group v-if="dPlatform === 'group' || dPlatform === 'bi'" v-model="foursInfo.foursId">
                <el-checkbox class="store__checkbox" v-for="fours in showFoursList" :label="fours.foursId" :key="fours.foursId">{{fours.name}}</el-checkbox>
              </el-checkbox-group>
              <!--门店项目用 radio-->
              <el-radio-group v-if="dPlatform === 'store'" v-model="foursInfo.foursId" @change="foursChange">
                <el-radio v-for="(fours) in showFoursList" :label="fours.foursId" :key="fours.foursId">{{fours.name}}</el-radio>
              </el-radio-group>
            </div>
          </div>
        </template>
      </column-box>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selStoresubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 通知弹窗 -->
    <el-dialog class="header__dialog" :title="(messageList.length || 0) + ' 条未读通知'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="messageDialogVisible" width="400px">
      <ul class="header__dialog-ul">
        <li class="header__dialog-li flex_lc" v-for="item in messageList" :key="item.id" @click="goMessageDetail()">
          <span :class="['icon', messageIcon[item.noticeType].color]">
            <i :class="['iconfont', messageIcon[item.noticeType].icon]"></i>
          </span>
          <div class="text">
            <h3>{{item.title}}</h3>
            <span class="desc">{{item.associationModuleName}}</span>
          </div>
          <span class="time">{{(item.modifiedOn || item.createdOn) | filterDate}}</span>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goMessage" size="small">查看更多</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import ztLogo from "./assets/images/zt_logo.png";
  import ApiMixin from "./assets/js/api";
  import Cookie from "js-cookie";
  import columnBox from "zt-column-box";
  export default {
    mixins:[ApiMixin],
    components: {
      columnBox
    },
    props:{
      userName:String,
      position:String,
      platform:{
        type:String,
        default:"store"
      },
      mounted:{
        type:Boolean,
        default:false
      },
      //选择端口页面
      selportHome:{
        type:String,
        default:"/store/views/login/#/selport"
      },
      //登录页面
      loginHome:{
        type:String,
        default:"/store/views/login/#/login"
      }
    },
    data() {
      return {
        logo:ztLogo,
        dPlatform:this.platform,
        dUserName:this.userName,
        dPosition:this.position,
        dSelportHome:this.selportHome,
        dLoginHome:this.loginHome,
        storeDialogVisible:false,
        brandIsIndeterminate:false,
        //选中的门店信息
        foursInfo:{
          //用户品牌筛选
          brandFoursIds:[],
          brandName:"",
          //选中的门店
          foursId:this.platform === "store" ? "" : [],
          foursName:""
        }
        //品牌列表
        ,brandList:[]
        //品牌全选
        ,brandAll:false
        //门店列表
        ,foursList:[]
        //对外显示的门店列表
        ,showFoursList:[]
        //搜索出的门店列表
        ,searchFoursList:[]
        //搜索参数
        ,searchParams:{
          foursName:""
        }
        //选中的门店
        ,currentFours:{
          foursId:this.platform === "store" ? "" : [],
          foursName:this.platform === "store" ? "" : []
        }
        ,userInfo:{}
        ,showClose:false,

        // 通知栏相关
        messageDialogVisible: false,
        messageList: [],
        // 未读数量
        // messageNum: 0,
        messageIcon: {
          '0': {
            color: 'icon-red',
            icon: 'zticon-shuaxin'
          },
          '1': {
            color: 'icon-blue',
            icon: 'zticon-file'
          },
          '2': {
            color: 'icon-yellow',
            icon: 'zticon-lingdang'
          },
          '3': {
            color: 'icon-green',
            icon: 'zticon-cg_app'
          }
        }
      };
    },
    created(){
      //获取用户基本信息
      this.getSysUserByToken();
    },
    watch:{
      "searchParams.foursName"(n,o){
        this.showFoursList = this.searchFoursList.filter(item=>{
          return item.name.indexOf(n) > -1;
        });
      }
      ,"foursInfo.brandFoursIds"(n,o){
        this.showFoursList = this.searchFoursList.filter(item=>{
          return n.includes(item.foursId)
        });
      }
    },
    computed: {
      messageNum(){
        return this.$store.state.global.messageNum;
      },
    },
    methods:{
      //根据token获取员工信息
      getSysUserByToken(){
        let platform = this.dPlatform;
        let requestParams = this.requestGetSysUserByToken({
          isFours:(platform === "store") * 1
        });
        requestParams.then(res=>{
          let code = parseInt(res.code);

          if(!code){
            let _userInfo = JSON.parse(JSON.stringify(res.data));
            this.userInfo = _userInfo
            let userInfo = res.data;
            let userName = userInfo.userName;
            let position = userInfo.position;
            this.dUserName = userName;    //姓名
            this.dPosition = position;    //岗位
            let foursUserVoDto = userInfo.foursUserVoDto;   //门店品牌数据
            let sysFoursBrand = foursUserVoDto.sysFoursBrand || []; //品牌数据
            this.brandList = this.aryRemoveDupli(sysFoursBrand,"brandId"); //赋值品牌数据
            let sysFoursDtos = foursUserVoDto.sysFoursDtos || []; //门店数据
            let foursUseRecordDto = userInfo.foursUseRecordDto;		//用户选中的门店
            let currentFoursId = foursUseRecordDto.foursIds;		//用户选中的门店数组

            //如果进入门店项目后，没有所属门店，提示后重新选择端口
            if(platform === "store" && !sysFoursDtos.length){
              this.$alert("您没有所属门店，请联系管理员给你配置门店","提示",{
                confirmButtonText:"重新选择端口",
                type:"error",
                showClose:false,
                callback:action=>{
                  window.location.href = this.dSelportHome;
                }
              });
              return false;
            }
            let sysResources = userInfo.sysResources || [];  //项目权限

            let hasStoreResources = []; //门店权限数组
            let hasGroupResources = []; //集团权限数组
            let hasBIResources = []; //BI数据决策权限数组
            //将门店和集团的权限分别放到对应的数组中
            sysResources.forEach(item=>{
              let code = item.code;
              //如果是门店权限
              if(/^(02)/.test(code)){
                hasStoreResources.push(item);
                this.setStorage("setStoreResourcesAry",this.getModuleMenuAry(hasStoreResources[0].children));
                this.setStorage("setStoreResourcesObj",this.getModuleMenuObj(hasStoreResources[0].children));
              }
              //如果是集团权限
              if(/^(01)/.test(code)){
                hasGroupResources.push(item);
                this.setStorage("setGroupResourcesAry",this.getModuleMenuAry(hasGroupResources[0].children));
                this.setStorage("setGroupResourcesObj",this.getModuleMenuObj(hasGroupResources[0].children));
              }
              //如果是BI数据决策权限
              if(/^(06)/.test(code)){
                hasBIResources.push(item);
                this.setStorage("setBIResourcesAry",this.getModuleMenuAry(hasBIResources[0].children));
                this.setStorage("setBIResourcesObj",this.getModuleMenuObj(hasBIResources[0].children));
              }
            });

            let storeBtnPermissions = {};
            if(hasStoreResources && hasStoreResources[0] && hasStoreResources[0].children){
              storeBtnPermissions = this.getButtonPermissions(hasStoreResources[0].children);  //获取门店中所有按钮权限
            }

            let groupBtnPermissions = {};
            if(hasGroupResources && hasGroupResources[0] && hasGroupResources[0].children){
              groupBtnPermissions = this.getButtonPermissions(hasGroupResources[0].children);  //获取集团中所有按钮权限
            }
            let biBtnPermissions = {};
            if(hasBIResources && hasBIResources[0] && hasBIResources[0].children){
              biBtnPermissions = this.getButtonPermissions(hasBIResources[0].children);  //获取集团中所有按钮权限
            }

            let sysBtnPermissions = Object.assign({},storeBtnPermissions,groupBtnPermissions,biBtnPermissions);
            this.setStorage("setSysBtnPermissions",sysBtnPermissions);                         //系统中所有按钮权限存放到 Vuex

            this.foursList = sysFoursDtos;  //原始的门店数据
            this.showFoursList = JSON.parse(JSON.stringify(sysFoursDtos));   //显示的门店数据
            this.searchFoursList = JSON.parse(JSON.stringify(sysFoursDtos)); //搜索的门店数据
            //从本地获取门店信息
            let checkFoursId,checkFoursName,checkFoursInfo;
            //门店项目获取当前门店
            if(platform === "store"){
              //检测是否有门店权限
              if(!hasStoreResources.length){
                this.renewSelectPort("门店");
                return false;
              }
              checkFoursId = currentFoursId && currentFoursId[0] || "";
              checkFoursName = this.getFoursName(currentFoursId)[0] || "";
              checkFoursInfo = this.getFoursInfo(checkFoursId) || {};
              checkFoursId  = parseInt(checkFoursId);
              //如果没有门店信息
              if(!checkFoursId || !checkFoursName){
                let checkFours = this.foursList[0]; //获取第一条数据
                checkFoursId = checkFours.foursId;
                checkFoursName = checkFours.name;
                checkFoursInfo = checkFours;
                if(this.foursList.length > 1){  //如果门店数据大一条，弹出框选择
                  this.storeDialogVisible = true;
                  this.foursInfo.foursId = checkFoursId;
                  this.foursInfo.foursName = checkFoursName;
                  this.showClose = false;
                  return false;
                }
              }
            }
            //集团项目或者数据决策项目获取当前门店
            if(platform === "group" || platform === "bi"){
              //检测是否有集团权限
              if(platform === "group" && !hasGroupResources.length){
                this.renewSelectPort("集团");
                return false;
              }
              //检测是否有BI权限
              if(platform === "bi" && !hasBIResources.length){
                this.renewSelectPort("数据决策");
                return false;
              }
              checkFoursId = currentFoursId || "";
              checkFoursName = this.getFoursName(currentFoursId) || "";
              //如果本地存储没有数据
              if(!checkFoursId || !checkFoursName){
                //循环门店数据，取出门店id
                checkFoursId = sysFoursDtos.map(item=>{
                  return item.foursId;
                });
                //循环门店数据，取出门店name
                checkFoursName = sysFoursDtos.map(item=>{
                  return item.name;
                });
              }
            }
            //设置当前门店数据
            this.currentFours.foursId = checkFoursId;
            this.currentFours.foursName = checkFoursName;
            this.foursInfo.foursId = checkFoursId;
            this.foursInfo.foursName = checkFoursName;
            //如果有 store 就存进去
            if(this.$store){
              if(this.$store._mutations){
                //设置门店ID
                this.$store._mutations["global/setFoursId"] && this.$store.commit("global/setFoursId",checkFoursId);
                //设置门店名称
                this.$store._mutations["global/setFoursName"] && this.$store.commit("global/setFoursName",checkFoursName);
                //设置用户信息
                this.$store._mutations["global/setUserInfo"] && this.$store.commit("global/setUserInfo",_userInfo);
                //设置门店信息
                this.$store._mutations["global/setFoursInfo"] && this.$store.commit("global/setFoursInfo",checkFoursInfo);
              }
            }
            this.$emit("update:mounted",true);
            
            // 通知栏未读列表弹窗
            let loginStatus = localStorage.getItem("firstLogin");
            if(loginStatus) {
              this.getMessageList();
              localStorage.removeItem("firstLogin");
            } else {
              // this.getMessageList();
              this.getMessageNum();
            }
          }
        })
      }
      ,isArray(object){
        return Object.prototype.toString.call(object) === "[object Array]";
      }
      ,isObject(object){
        return Object.prototype.toString.call(object) === "[object Object]";
      }
      //品牌全选
      ,brandCheckAllChange(val){
        let allFoursIds = this.brandList.map(item=>{
          return item.foursId;
        });
        this.foursInfo.brandFoursIds = val ? allFoursIds : [];
        this.brandIsIndeterminate = false;
      }
      //选择某个品牌
      ,brandCheckedChange(value){
        let checkedCount = value.length;
        let brandList = this.brandList.length;
        this.brandAll = checkedCount === brandList;
        this.brandIsIndeterminate = checkedCount > 0 && checkedCount < brandList;
      }
      //去重
      ,aryRemoveDupli(array,key){
        array = array || [];
        let isArray = this.isArray(array);
        if(!isArray){return array;}
        let tmpAry = [];
        let result = [];
        array.forEach(item=>{
          let isObject = this.isObject(item);
          if(isObject){
            let isInclude = tmpAry.includes(item[key]);
            if(!isInclude){
              tmpAry.push(item[key]);
              result.push(item);
            }
          }
        })
        return result;
      }
      //选择门店
      ,selStoresubmit(){
        let platform = this.dPlatform;
        let foursId = this.foursInfo.foursId;
        let storeCodes = [];
        if(platform === "store"){
          storeCodes.push(foursId);
        }
        if(platform === "group" || platform === "bi"){
          storeCodes = foursId;
        }
        let loading = this.$loading();
        let requestPromise = this.requestSaveUserFoursRecords({
          storeCodes,
          userId:this.userInfo.userId,
          isFours:(platform === "store") * 1
        })
        requestPromise.then(res=>{
          let code = parseInt(res.code);
          if(!code){
            let href = window.location.href;
            window.location.href = href.replace(/\#\S*/,"");
          }
        })
      }
      //选中门店
      ,foursChange(foursId){
        let platform = this.dPlatform;
        let currentFourse = this.foursList.filter(item=>{
          return parseInt(item.foursId) === parseInt(foursId);
        })
        this.foursInfo.foursName = currentFourse[0].name;
      }
      //显示筛选弹窗，并选中数据
      ,showFilterDialog(){
        this.storeDialogVisible = true;
        this.showClose = true;
      }
      //提示重新选择端口
      ,renewSelectPort(platformtip){
        this.$alert("您没有"+platformtip+"运营管理权限，请重新选择端口","提示",{
          confirmButtonText:"重新选择端口",
          type:"error",
          showClose:false,
          callback:action=>{
            window.location.href = this.dSelportHome;
          }
        })
      }
      //退出登录
      ,logOut(){
        this.$confirm("确定退出登录吗？","提示",{
          confirmButtonText: '退出',
          cancelButtonText: '取消',
          closeOnClickModal:false,
          type:"warning"
        })
          .then(()=>{
            // 清除缓存数据
            Cookie.remove("token",{domain:".zhengtongauto.com"});
            localStorage.removeItem('groupFoursId');
            localStorage.removeItem('groupFoursName');
            localStorage.removeItem('storeFoursId');
            localStorage.removeItem('storeFoursName');
            window.location.href = this.dLoginHome
          })
          .catch(()=>{})
      }
      //递归获取每个模块中左侧栏目
      ,getModuleMenuAry(resources){
        if(!resources || !resources.length){
          return false;
        }
        let newResources = [];
        resources = JSON.parse(JSON.stringify(resources));
        newResources = (function recursiveData(resources,pcode){
          for(let i = resources.length - 1;i >= 0;i--){
            let currentModule = resources[i];
            let children = resources[i].children;
            let code = currentModule.code;
            let url = currentModule.url || "";
            url = url.trim();
            currentModule.url = url;
            if(children && children.length){
              if(!currentModule.isShow){
                resources.splice(i,1);
              } else {
                recursiveData(children,code);
              }
            }else{
              if(currentModule.resType === "B" || !currentModule.isShow){
                resources.splice(i,1);
              }
            }
          }
          return resources;
        })(resources);
        return newResources
      }
      //递归获取每个模块中左侧栏目
      ,getModuleMenuObj(resources){
        if(!resources || !resources.length){
          return false;
        }
        let newResourcesAry = this.getModuleMenuAry(resources);
        let newResourcesObj = {};
        newResourcesAry.forEach(item=>{
          newResourcesObj[item.code] = item.children;
        });
        return newResourcesObj;
      }
      //递归设置系统栏目中按钮
      ,getButtonPermissions(resources){
        resources = JSON.parse(JSON.stringify(resources));
        let newResources = [];
        let btnpermission = {};
        ;(function recursiveData(resources){
          for(let i = resources.length - 1;i >= 0;i--){
            let currentModule = resources[i];
            let children = resources[i].children;
            if(children && children.length){
              recursiveData(children);
            }else{
              if(currentModule.resType === "B"){
                btnpermission[currentModule.code] = currentModule.status;
              }
            }
          }
        })(resources);
        return btnpermission
      }
      //设置数据缓存
      ,setStorage(key,value){
        if(this.$store){
          if(this.$store._mutations){
            this.$store._mutations["global/"+key] && this.$store.commit("global/"+key,value);
          }
        }else{
          localStorage.setItem(key,value);
        }
      }
      //获取数据缓存
      ,getStorage(key){
        if(this.$store){
          return this.$store.state.global[key]
        }else{
          localStorage.getItem(key);
        }
      }
      //获取门店名称
      ,getFoursName(foursId) {
        let isary = this.isArray(foursId);
        let foursName = isary ? [] : "";
        for (let i = 0; i < this.foursList.length; i++) {
          let item = this.foursList[i];
          let isInclude = !isary ? parseInt(item.foursId) === parseInt(foursId) : foursId.includes(parseInt(item.foursId));
          if (isInclude) {
            !isary ? foursName = item.name : foursName.push(item.name)
            continue;
          }
        }
        return foursName;
      }
      //获取当前门店信息
      ,getFoursInfo(foursId){
        let isary = this.isArray(foursId);
        let foursInfo = isary ? [] : {};
        for(let i = 0;i<this.foursList.length;i++){
          let item = this.foursList[i];
          let isInclude = !isary ? parseInt(item.foursId) === parseInt(foursId) : foursId.includes(parseInt(item.foursId));
          if(isInclude){
            !isary ? foursInfo = item : foursInfo.push(item)
            continue;
          }
        }
        return foursInfo;
      },
      // 获取通知栏未读列表
      getMessageList() {
        let promiseRes = this.requestQueryFoursUserNoticeListByParam({
          // foursId: this.$store.state.global.foursId,
          userId: this.$store.state.global.userInfo.userId,
          // userId: 8693,
          readStatus: 0,
          pageNum: 1,
          pageSize: 3
        })
        promiseRes.then((res) => {
          if(res.code === 0 && res.data && res.data.total > 0) {
            this.messageList = res.data.list || [];
            // this.messageNum = res.data.total;
            this.$store._mutations["global/setMessageNum"] && this.$store.commit("global/setMessageNum",res.data.total);
            if(this.messageNum > 0) {
              this.messageDialogVisible = true;
            }
          }
        })
      },
      // 获取通知栏未读数量
      getMessageNum() {
        let userId = this.$store.state.global.userInfo.userId;
        // let userId = 8693;
        // let foursId = this.$store.state.global.foursId;
        let promiseRes = this.requestMsgSystemNoticeGetUnReadCount(userId);
        promiseRes.then((res) => {
          if(res.code === 0 && res.data) {
            // this.messageNum = res.data || 0;
            this.$store._mutations["global/setMessageNum"] && this.$store.commit("global/setMessageNum", res.data);
          }
        })
      },
      // 跳转到通知栏
      goMessage() {
        window.location.href = `//${domain}/store/views/message#/message/list`;
      },
      // 跳转到对应的详情页
      goMessageDetail(item) {
        window.location.href = `//${domain}/store/views/message#/message/detail${item.id}`;
      }
    },
    filters: {
      filterDate(val) {
        if(val) {
          return val.substring(0, 10);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .frame-header-box /deep/ {
    width: 100%;
    height: 50px;
    background-color:#1C2B36;
    position: relative;
    // border-bottom: 1px solid #e6e6e6;
    // logo
    .logo-box{
      padding-left: 5px;
      width: 200px;
      height: 100%;
      // background-color: #409eff;
      .icon{
        height: 30px;
      }
    }
    .person-info{
      padding-right: 10px;
      font-size: 12px;
      p{
        color: #fff;
        cursor: pointer;
      }
      .under-line{
        margin: 0px 10px;
        text-decoration: underline;
        cursor: pointer;
        span{
          color:#409EFF;
        }
      }
      .blue-color{
        color: #409eff;
      }
      .button__text-company {
        color: #fff;
        font-size: 12px;
        padding: 0 15px;
        height: 50px;
        line-height: 50px;
        border: none;
        transition: all 0.2s;
        &:hover {
          background-color:rgba(0,0,0,0.3);
        }
        &:active {

        }
      }
    }
    .el-dialog__header{
      padding-bottom: 0;
    }
    .el-dialog__body{
      padding: 0;
      .column__box{
        padding-left: 15px;
        padding-right: 15px;
      }
    }
    .filterdata__searchbox-form{
      width: 500px;
    }
    .filterdata__box{
      border: 1px solid #eaeefb;
      display: flex;
      border-radius: 4px;
      .filterdata__header{
        background: #F2F6FC;
        width: 120px;
        text-align: center;
        padding: 10px 0;
      }
      .filterdata__body{
        flex: 1;
        background: #fbfdff;
        padding: 10px;
        max-height: 500px;
        overflow-y: auto;
        .el-checkbox{
          margin-right: 30px;
          margin-top: 4px;
          margin-bottom: 4px;
          min-width: 325px;
        }
        .el-checkbox+.el-checkbox{
          margin-right: 30px;
          margin-left: 0;
        }
        .el-radio{
          margin-right: 30px;
          margin-top: 7px;
          margin-bottom: 7px;
          min-width: 325px;
        }
        .el-radio+.el-radio{
          margin-right: 30px;
          margin-left: 0;
        }
      }
    }
    .el-icon-caret-bottom {
      font-size: 8px;
      margin-left: 8px;
    }
  }

  .frame-header-box::after {
    content: '';
    width: 100%;
    height: 1px;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.1);
  }
  /deep/ .header__badge {
    padding:15px 20px;
    cursor: pointer;
    .item {
      padding-top: 2px;
      display: inline-block;
    }
    .el-badge__content {
      border:none;
    }
    .zticon-lingdang {
      font-size: 16px;
      color: #fff;
      // padding: 0 10px;
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }
  // 通知弹窗
  .header__dialog /deep/{
    .el-dialog__header {
      padding-bottom: 10px;
    }
    .el-dialog__title {
      font-weight: bold;
      color: #333333;
      font-size: 14px;
    }
    .el-dialog__footer {
      padding-bottom: 10px;
    }
    .header__dialog-li {
      padding: 20px;
      position: relative;
      cursor: pointer;
      &::after {
        content: '';
        left: 20px;
        right: 20px;
        position: absolute;
        height: 1px;
        background-color: #E7E9F0;
        bottom: 0;
      }
      &:hover,&:hover::after {
        background-color: #BAD7FB;
      }
      .icon {
        display: block;
        flex: 0 0 32px;
        width:32px;
        height:32px;
        border-radius:50%;
        color: #fff;
        text-align: center;
        line-height: 32px;
      }
      // 更新说明
      .icon-red {
        background:#FA5555;
      }
      // 操作手册
      .icon-blue {
        background:#409EFF;
      }
      // 系统通知
      .icon-yellow {
        background:#F39800;
      }
      // 其他通知
      .icon-green {
        background:#67C23A;
      }
      .text {
        flex: 1;
        margin-right: 5px;
        margin-left: 20px;
        overflow: hidden;
        h3 {
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          color: #000;
          margin-bottom: 10px;
        }
        .desc {
          color: rgba(0,0,0,0.8);
          font-size: 12px;
        }
      }
      .time {
       flex: 0 0 72px;
       color: rgba(0,0,0,0.5);
       display: block;
       width: 72px;
       align-self: flex-start;
       line-height: 20px;
      }
    }
  }
</style>
