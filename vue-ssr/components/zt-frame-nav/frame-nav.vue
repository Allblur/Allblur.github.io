/*
*  @描述：头部导航
*  @作者：白朗
*  @创建时间：2018-04-25
*/
<template>
  <div class="frame-title-box">
    <div class="frame-title-content" :class="{'frame-title-box-hover': currentNavHover}">
      <!-- 导航根据数据遍历 -->
      <div class="frame-title-item" 
          v-for="item in dNavData" 
          :class="{'nav-active':currentNav == item.url, 'nav-active-hover':currentNavHover == item.url}" 
          :key="item.id"
          @mouseenter="toggleModule(item, 'show')"
          @mouseleave="toggleModule(item, 'hide')">
        <div @click.stop="goModule(item)" class="frame-title-item--box">
          <a><i :class="['iconfont', item.itemIcon]"></i></a>
          <span class="text">{{item.name}}</span>
          <i class="icon el-icon-arrow-right"></i>
        </div>
        <subNav :isRouter="isRouter" :platform="platform" v-if="currentNavHover == item.url" :hoverObj="item"></subNav>
      </div>
    </div>
  </div>
</template>

<script>
  // import subNav from 'zt-sub-nav';
  import subNav from '../zt-sub-nav';
  export default {
    props: {
      navData: {
        tpye: Array,
        default () {
          return []
        }
      },
      currentNav: {
        type: String,
        default: ''
      },
      platform:{
        type:String,
        default:"store"
      },
      // 是否用路由跳转
      isRouter: {
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        dNavData:this.navData,
        dPlatform:this.platform,
        dCurrentNav:this.currentNav,
        currentNavHover: '',
      };
    },
    components:{
      subNav,
    },
    created(){
      let resources = this.dPlatform+"ResourcesAry" || "storeResourcesAry";
      if(this.isRouter) {
        this.searchCurrentModel(resources)
      }
      this.setNavData(resources);
      
    },
    methods:{
      setNavData(resources){
        resources = resources || "storeResourcesAry";
        let resourcesAry = this.$store.state.global[resources];
        if(resourcesAry){
          let navData = resourcesAry.map(item=>{
            let url = item.url || "";
            url = url.trim();
            let hasSlash = url.substring(url.length - 1);
            if(hasSlash === "/"){
              url = url.substring(0,url.length - 1);
            }
            if(this.dCurrentNav === url || (this.isRouter && this.dCurrentNav === item.redirectUrl)){
              this.$store.commit("global/setCurrentProjectCode",item.code);
              this.$store.commit("global/setCurrentProjectName",item.name);
            }
            return {
              url:url,
              name:item.name,
              itemIcon: item.itemIcon,
              code: item.code,
              redirectUrl: item.redirectUrl
            }
          });
          // 隐藏通知栏模块入口
          let hideCode = ['0215'];
          this.dNavData = navData.filter(n => !hideCode.includes(n.code));
        }
      },
      // 跳转模块
      goModule(item) {
        if(this.isRouter) {
          this.$router.push(item.redirectUrl);
          this.$store.commit("global/setCurrentProjectCode",item.code);
          this.$store.commit("global/setCurrentProjectName",item.name);
          return;
        }
        window.location.href = `${(item.url || '')}/#/`
      },
      // 鼠标移上/离开
      toggleModule(item, wayName) {
        if(wayName === 'show') {
          this.currentNavHover = item.url;
        } else {
          this.currentNavHover = '';
        }
        
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
                t.dCurrentNav = item.redirectUrl;
              }else if(resourcesItem.children){
                searchResources(resourcesItem.children)
              }
            }
          })(resourcesChild);
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .frame-title-box{
    width: 40px;
    height: 100%;
    background: #1C2B36;
    // padding-left:30px;
    position: relative;
    z-index: 2001; // 为了比loading的层级高
    .frame-title-item{
      height: 40px;
      line-height: 40px;
      // margin-right: 29px;
      // padding: 0px 2px;
      // border-bottom:3px solid #ffffff;
      color: #89A2B4;
      transition: all 0.2s;
      -webkit-transition: all 0.3s;
      // position: relative;
      white-space: nowrap;
      .frame-title-item--box {
        cursor: pointer;
      }
      a{
        display: inline-block;
        height: 100%;
        font-size: 16px;
        width: 40px;
        text-align: center;
        vertical-align: middle;
        text-decoration: none;
      }
      .text {
        font-size: 12px;
        display: none;
      }
      .icon {
        display: none;
      }
    }
    .frame-title-item.nav-active{
      color: #fff;
      background-color: #409EFF;
      // border-bottom:3px solid #409eff;
    }
    .frame-title-item:hover{
      color: #fff;
      background-color: rgba(0,0,0,0.3);
    }
  }
  .frame-title-content {
    width: 40px;
    transition: all 0.3s;
    position: relative;
    height: 100%;
    background: #1C2B36;
  }
  .frame-title-box-hover /deep/{
    width: 200px;
    .frame-sub-nav {
      position: absolute;
      top: 0;
      left: 100%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      .el-menu-item:hover {
        background-color:#ECF8FF !important;
      }
    
    }
    .open-close-btn {
      display: none;
    }
    .frame-title-item {
      .text {
        display: inline-block;
        vertical-align: middle;
      }
      .icon {
        display: inline-block;
        position: absolute;
        right: 10px;
        font-size: 4px;
        line-height: 40px;
      }
    }
    .frame-title-item.nav-active-hover {
      color: #fff;
      background-color: rgba(0,0,0,0.3);

    }
    .el-submenu{
      .el-submenu__title:hover {
        background-color: #ECF8FF !important;
      }

    }
  }
</style>
