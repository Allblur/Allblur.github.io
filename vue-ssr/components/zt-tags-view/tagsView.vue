/*
*  @描述：标签
*  @作者：付文松
*  @创建时间：2019/3/4
*/
<template>
  <div class="tags-view-container">
    <el-tabs v-model="activePath" type="card" @tab-remove="closeSelectedTag" @tab-click="showCurrentTag">
      <el-tab-pane
              ref="tag"
              v-for="tag in visitedViews"
              :key="tag.path"
              :label="tag.title"
              :name="tag.path"
              :to="tag"
              :closable="visitedViews.length!==1"
      >
      </el-tab-pane>
    </el-tabs>
    <span class="tags-menu" @click="switchMenu"><i class="iconfont zticon-gengduo"></i></span>
    <ul v-show="visible" class="contextmenu">
      <li @click="closeOthersTags">关闭其他</li>
    </ul>
    <!-- <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li v-if="!(selectedTag.meta&&selectedTag.meta.affix)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul> -->
  </div>
</template>

<style lang="scss" scoped>
  .tags-view-container /deep/ {
    // border-bottom: 1px solid #EAEEFB;
    padding: 0 30px 0 0;
    background-color: #DCDFE6;
    position: relative;
    border-radius: 4px 4px 0 0;
    .tags__link{
      font-size: 12px;
      display: inline-block;
      color: #999;
      padding: 7px 12px;
      border: 1px solid transparent;
      position: relative;
      top: 1px;
      cursor: pointer;
      &.tags__link--active{
        border-color: #EAEEFB;
        border-bottom-color:#fff;
        border-radius:4px 4px 0 0;
        color: #409EFF;
      }
    }
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 100;
      position: absolute;
      list-style-type: none;
      // padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      border:1px solid rgba(228, 231, 237, 1);
      box-shadow:0px 2px 4px 0px rgba(0, 0, 0, 0.1);
      right: 4px;
      min-width: 100px;
      text-align: center;
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          // background: #eee;
          color: #F56C6C;
        }
      }
    }
    .el-tabs__header{
      margin-bottom: 0;
    }
    .el-tabs__item {
      height: 30px;
      line-height: 30px;
      color: #666;
      padding: 0 9px;
      font-size: 12px;
      border: none;
      &:hover {
        background-color: rgba(255, 255, 255, 0.4);
        border-radius: 4px 4px 0 0;
      }
      &::before {
        content: '';
        width: 1px;
        height: 16px;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -8px;
        background-color: rgba(0,0,0,0.07);
        font-size: 12px;
      }
    }
    .el-tabs__nav {
      .el-tabs__item:first-child{
        &::before {
          display: none;
        }
      }
    }
    .el-tabs--card>.el-tabs__header .el-tabs__item.is-active.is-closable{
      padding: 0 9px;
    }
    .el-tabs--card>.el-tabs__header .el-tabs__nav, .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
      border: none;
    }
    .el-tabs__item.is-active{
      background-color: #FFFFFF;
      border-radius: 4px 4px 0 0;
      color: #409EFF;
      &::before {
        display: none;
      }
    }
    .el-tabs--card>.el-tabs__header .el-tabs__item .el-icon-close{
      color: #909399;
    }
    .el-tabs--card>.el-tabs__header .el-tabs__item.is-active.is-closable .el-icon-close {
      color: #409EFF;
    }
    .el-tabs__nav-next, .el-tabs__nav-prev{
      color: #666;
      background-color: #DCDFE6;
      line-height: 30px;
      height: 30px;
      width: 20px;
      text-align: center;
      z-index: 2;
      &::before {
        content: '';
        width: 6px;
        height: 30px;
        position: absolute;
        top: 0;
        opacity:0.1;
      }
    }
    .el-tabs__nav-prev {
      border-radius: 4px 0 0 0;
    }
    .el-tabs__nav-prev::before {
      left: 100%;
      background:linear-gradient(-90deg,rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);
    }
    .el-tabs__nav-next::before {
      right: 100%;
      background:linear-gradient(-90deg,rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
    }
    .tags-menu {
      width: 30px;
      height: 30px;
      line-height: 30px;
      background-color:#DCDFE6;
      color: #666;
      position: absolute;
      right: 0;
      top: 0;
      text-align: center;
      cursor: pointer;
      border-radius:0 4px 0 0;

      &::before {
        content: '';
        width: 1px;
        height: 16px;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -8px;
        background-color: rgba(0,0,0,0.07);
        font-size: 12px;
      }
      &:hover {
        background: #CED3DD;
        color: #409EFF;
      }
    }
  }
</style>

<script>
  import path from 'path'
  import { setTimeout } from 'timers';
  export default {
    name: "",
    data(){
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {},
        affixTags: [],
        activePath: ''
      }
    },
    watch: {
      $route() {
        this.addTags();
        this.moveToCurrentTag()
      },
      visible(value) {
        if (value) {
          // 防止点击立马就被隐藏了
          setTimeout(() => {
            document.body.addEventListener('click', this.closeMenu)
          }, 10)

        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    computed:{
      visitedViews(){
        return this.$store.state.tagsView.visitedViews
      },
      routers() {
        return this.$store.state.global.router
      }
    },
    mounted(){
      this.initTags();
      this.addTags();
    },
    methods:{
      //判断是否是当前的路由
      isActive(route){
        return route.path === this.$route.path;
      },
      //过滤路由
      filterAffixTags(routes,basePath = "/"){
        let tags = [];
        if(!routes || !routes.length) return [];
        routes.forEach(route=>{
          if(route.meta && route.meta.affix){
            const tagPath = path.resolve(basePath,route.path);
            tags.push({
              fullPath: tagPath,
              path:tagPath,
              name:route.name,
              meta: route.meta
            })
          }
          if(route.children){
            const tempTags = this.filterAffixTags(route.children,route.path);
            if(tempTags.length >= 1){
              tags = [...tags,...tempTags];
            }
          }
        });
        return tags;
      },
      //初始化标签
      initTags(){
        const affixTags = this.affixTags = this.filterAffixTags(this.routers);
        for(const tag of affixTags){
          if(tag.name){
            this.$store.dispatch("addVisitedView",tag);
          }
        }
      },
      //添加标签
      addTags(){
        this.activePath = this.$route.path;
        let route = this.$route;
        const {name, params} = this.$route;
        if(name){
          this.$store.dispatch('addView',this.$route);
          // 把路由name为一样的关闭掉
          let sameNames = this.visitedViews.filter(item => item.name === name) || [];
          sameNames.forEach((view, index) => {
            if(index !== sameNames.length-1) {
              console.log(view)
              this.closeSelectedTag(view);
            }
          })
        }
        return false;
      },
      //关闭选中的标签
      closeSelectedTag(view){
        if(typeof view === 'string') {
          view = this.visitedViews.find(item => item.path === view) || {};
        }
        this.$store.dispatch("delView",view).then(({visitedViews})=>{
          if(this.isActive(view)){
            this.toLastView(visitedViews);
          }
        })
      },
      closeOthersTags() {
        this.$router.push(this.selectedTag);
        this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
          this.moveToCurrentTag()
        })
      },
      closeAllTags(view) {
        this.visible = false;
        if(this.visitedViews.length === 1) return;
        this.$store.dispatch('delAllViews').then(({ visitedViews }) => {
          if (this.affixTags.some(tag => tag.path === view.path)) {
            return
          }
          this.toLastView(visitedViews)
        })
      },
      moveToCurrentTag() {
        this.$nextTick(() => {
          const tags = this.visitedViews;
          for (const tag of tags) {
            if (tag.path === this.$route.path) {
              if (tag.fullPath !== this.$route.fullPath) {
                this.$store.dispatch('updateVisitedView', this.$route)
              }
              break
            }
          }
        })
      },
      refreshSelectedTag(view) {
        this.$store.dispatch('delCachedView', view).then(() => {
          const { fullPath } = view
          this.$nextTick(() => {
            this.$router.replace({
              path: '/redirect' + fullPath
            })
          })
        })
      },
      //跳到最后一个标签
      toLastView(visitedViews){
        const latestView = visitedViews.slice(-1)[0];
        if(latestView){
          this.$router.push(latestView);
        }else{
          this.$router.push("/");
          this.addTags();
        }
      },
      openMenu(tag, e) {
        const menuMinWidth = 105;
        const offsetLeft = e.target.getBoundingClientRect().left; // container margin left
        const offsetWidth = e.target.offsetWidth; // container width
        const maxLeft = offsetWidth - menuMinWidth; // left boundary
        const left = e.clientX + 15; // 15: margin right
        this.left = left
        this.top = e.clientY
        this.visible = true
        this.selectedTag = tag
      },
      closeMenu() {
        this.visible = false
      },
      // 打开当前菜单
      showCurrentTag() {
        let tag = this.visitedViews.find(item => item.path === this.activePath) || {};
        this.$router.push({
          path:tag.path,
          query:tag.query,
          fullPath:tag.fullPath
        })
      },
      // 切换关闭菜单显示
      switchMenu() {
        let tag = this.visitedViews.find(item => item.path === this.activePath);
        this.selectedTag = tag;
        this.visible = !this.visible;
      }
    }
  }
</script>

