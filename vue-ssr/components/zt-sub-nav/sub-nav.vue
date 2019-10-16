
/*
*  @描述：左边导航树状、一级结构
*  @作者：白朗
*  @创建时间：2018-04-20
*/
<template>
  <div class="frame-sub-nav" :class="subNavOpen ? 'sub-nav-open': 'sub-nav-close'" >
    <div class="sub-nav-con" :class="subNavOpen ? 'sub-navcon-open': 'sub-navcon-close'" >
      <h2 class="frame-sub-nav-title">{{currentProjectName}}</h2>
      <!-- 树状导航 -->
      <el-menu :default-active="$route.meta.p" class="el-menu-vertical-demo" @open="handleOpen"  @close="handleClose" :background-color="backgroundColor" :text-color="textColor" :active-text-color="activeTextColor" @select="selectMenu" :default-openeds="opends" :unique-opened="true">
        <template v-for="(menu,$index) in dSubmenu">
          <el-menu-item :key="menu.id" v-if="(!menu.children || !menu.children.length) && menu.isShow" :route="{name:(menu.url || '').trim()}" :index="(menu.url || '').trim() || ''">{{menu.name}}</el-menu-item>
          <el-submenu :key="menu.id" :index="$index.toString()" v-if="menu.children && menu.children.length && menu.isShow">
            <template slot="title"><span>{{menu.name}}</span></template>
            <template v-for="mc in menu.children">
              <el-menu-item :key="mc.id" v-if="mc.isShow" :route="{name:(mc.url || '').trim()}" :index="(mc.url || '').trim() || ''">{{mc.name}}</el-menu-item>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </div>
    <!-- 左边导航收缩 -->
    <div v-if="dHasNavToggle" class="open-close-btn" @click="subNavToggle">
      <i :class="subNavOpen ? 'el-icon-caret-left' : 'el-icon-caret-right'"></i>
      <img :src="subNavBg"/>
    </div>
  </div>
</template>

<script>
  const subNavBg = require("./assets/images/subnav-bg.png");
  export default {
    props:{
      submenu:{
        type:Array,
        default:function(){
          return [];
        }
      },
      platform:{
        type:String,
        default:"store"
      },
      hasresources:{
        type:Boolean,
        default:true
      },
      hasNavToggle:{
        type:Boolean,
        default:true
      },
      backgroundColor:{
        type:String,
        default:"#ffffff"
      },
      textColor:{
        type:String,
        default:"#333333"
      },
      activeTextColor:{
        type:String,
        default:"#409EFF"
      },
      hoverObj:{
        type:Object,
        default: null
      },
      // 是否用路由跳转
      isRouter: {
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        subNavOpen:true,
        dSubmenu:this.submenu,
        subNavBg,
        dPlatform:this.platform,
        dHasresources:this.hasresources,
        dHasNavToggle:this.hasNavToggle,
        currentProjectName: '',
        opends: []
      };
    },
    computed: {
      currentProjectCode() {
        if(this.isRouter) {
          return this.$store.state.global.currentProjectCode;
        }
      }
    },
    watch: {
      currentProjectCode(n, o) {
        if(this.isRouter && this.dHasresources){
          this.setSubmenu(this.dPlatform + "ResourcesObj");
        }
      },
      '$route' (n, o) {
        if(this.isRouter && n) {
          let pathArr = n.path.split('/');
          if(pathArr.length < 2) return;
          let resources = this.dPlatform+"ResourcesAry" || "storeResourcesAry";
          this.searchCurrentModel(resources);
          // let path = '/'+ pathArr[1]
          // let resources = this.platform+"ResourcesAry" || "storeResourcesAry";
          // let resourcesAry = this.$store.state.global[resources];
          // console.log(resourcesAry)
          // if(resourcesAry){
          //   resourcesAry.forEach(item => {
          //     if(path === item.redirectUrl && item.code !== this.$store.state.global.currentProjectCode){
          //       this.$store.commit("global/setCurrentProjectCode",item.code);
          //       this.$store.commit("global/setCurrentProjectName",item.name);
          //     }
          //   })
          // }
        }
      },
    },
    created(){
      if(this.dHasresources){
        this.setSubmenu(this.dPlatform + "ResourcesObj");
      }
    },
      
    methods:{
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {

      },
      subNavToggle(){
        this.subNavOpen = !this.subNavOpen;
        this.$emit('subNavOpenFun',this.subNavOpen);
      },
      setSubmenu(resources){
        let resourcesObj = this.$store.state.global[resources];
        let currentProjectCode = this.hoverObj ? this.hoverObj.code : this.$store.state.global.currentProjectCode;
        this.currentProjectName = this.$store.state.global.currentProjectName;
        this.dSubmenu = resourcesObj[currentProjectCode];
        if(this.hoverObj) {
          // 悬浮菜单
          this.currentProjectName = this.hoverObj.name;
        }
        this.opends = []
        this.dSubmenu.forEach((element, index) => {
          if(element.children && element.children.length && element.isShow) {
            let indexS = index.toString();
            !this.opends.length && this.opends.push(indexS);
          }
        });
      },
      // 选中菜单
      selectMenu(index, indexPath) {
        // 单模块
        if(!this.hoverObj || this.isRouter) {
          this.$router.push({name: index})
          if(this.hoverObj) {
            this.$store.commit("global/setCurrentProjectCode",this.hoverObj.code);
            this.$store.commit("global/setCurrentProjectName",this.hoverObj.name);
          }
          return;
        }
        // 悬浮出现的侧边栏
        let path = '', 
            resultObj = {};
        if(indexPath.length > 1) {
          let pathIdx = +indexPath[0];
          resultObj = this.dSubmenu[pathIdx].children.find(item => item.url === index) || {};
        } else {
          resultObj = this.dSubmenu.find(item => item.url === index) || {}; 
        }
        // 多模块
        path = resultObj.redirectUrl || '/';
        window.location.href = `${this.hoverObj.url}/#${path}`
      },
      // 查找当前属于哪个模块的
      searchCurrentModel(resources) {
        let resourcesAry = this.$store.state.global[resources];
        let t = this;
        let pathArr = this.$route.path.split('/');
        if(pathArr.length < 2) {return;}
        let currentUrl = '/'+ pathArr[1];
        resourcesAry.forEach((item, i) => {
          let resourcesChild = item.children || [];
          (function searchResources(resourcesList){
            for(let i = 0;i<resourcesList.length;i++){
              let resourcesItem = resourcesList[i];
              let redirectUrl = (resourcesItem.redirectUrl || '').split('/');
              let curRedirectUrl;
              if(redirectUrl.length >= 2) {curRedirectUrl = '/'+ redirectUrl[1]};
              if(curRedirectUrl === currentUrl){
                // t.dCurrentNav = item.redirectUrl;
                t.$store.commit("global/setCurrentProjectCode",item.code);
                t.$store.commit("global/setCurrentProjectName",item.name);
              }else if(resourcesItem.children){
                searchResources(resourcesItem.children)
              }
            }
          })(resourcesChild);
        })
      }
    },
    components:{

    }
  }
</script>

<style lang="scss" scoped>
  .frame-sub-nav{
    // padding-top: 20px;
    width: 160px;
    height:100%;
    background-color: #fff;
    color: #333333;
    position: relative;
    .sub-nav-con{
      width: 160px;
      font-size: 12px;
      .el-menu-vertical-demo{
        width: 100%;
        border: none;
      }
    }
    // 左边导航收缩
    .sub-nav-con.sub-navcon-close{
      opacity: 0;
      margin-left: -160px;
      transition:all 0.3s;
    }
    .sub-nav-con.sub-navcon-open{
      opacity: 1;
      margin-left: 0px;
      transition:all 0.5s;
      overflow-y: auto;
      overflow-x: hidden;
      height: 100%;
      /* 针对缺省样式 (必须的) */
      &::-webkit-scrollbar {
        width: 5px;
        height:0px;
      }
      /* 滚动条的滑轨背景颜色 */
      &::-webkit-scrollbar-track {
        background-color: #444448;
        border-radius:5px;
      }
      /* 滑块颜色 */
      &::-webkit-scrollbar-thumb {
        background-color: #696979;
        border-radius:10px;
      }
      /*内层轨道的颜色*/
      &::-webkit-scrollbar-track-piece{
        background-color:#444448;
        border-radius:5px;
      }
      /* 滑轨两头的监听按钮颜色 */
      &::-webkit-scrollbar-button {
        background-color:#444448;
        width:0;
        height:0;
      }
      /* 横向滚动条和纵向滚动条相交处尖角的颜色 */
      &::-webkit-scrollbar-corner {
        background-color: black;
      }
    }
    .open-close-btn{
      position: absolute;
      top: 50%;
      right: -10px;
      height: 90px;
      margin-top: -45px;
      cursor: pointer;
      img{
        height: 100%;
      }
      i{
        position: absolute;
        top: 50%;
        margin-top: -7px;
        left: -2px;
        color: #909399;
      }
    }
    .open-close-btn:hover{
      i{
        color: #89a2b4;
      }
    }
    .el-menu::after, .el-menu::before {
      display: none;
    }
    .frame-sub-nav-title {
      padding: 0 10px;
      font-weight: bold;
      margin: 5px 0 0;
      line-height: 40px;
      font-size: 12px;
    }
  }
  .frame-sub-nav.sub-nav-close{
    width: 0px;
    transition:all 0.3s;
  }
  .frame-sub-nav.sub-nav-open{
    width: 160px;
    transition:all 0.3s;
  }
  .el-menu-item {
    min-width: 160px;
    height: 40px;
    line-height: 40px;
    // border-left: 2px solid #1c2b36;
    font-size: 12px;
    padding: 0 10px !important;
    &:hover {
      background-color: #fff !important;
      color: #409EFF !important;
    }
  }
  .el-menu-item.is-active {
    // color: #409EFF;
    // border-left: 2px solid #409eff;
    background-color:#ECF8FF !important;
    .el-submenu__title {
      padding: 0 10px !important;
    }
  }
  .el-submenu /deep/{
    .el-submenu__title {
      padding: 0 10px !important;
      border-right: none;
      font-size: 12px;
      &:hover {
        background-color: #fff !important;
        color: #409EFF !important;

      }
    }
    .el-menu-item {
      padding-left: 20px !important;
    }
    .el-submenu__icon-arrow {
      right: 10px;
    }
    // .el-icon-arrow-down:before {
    //   content: "\e60b";
    // }

  }

</style>
