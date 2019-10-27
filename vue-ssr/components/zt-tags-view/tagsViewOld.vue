/*
*  @描述：标签
*  @作者：付文松
*  @创建时间：2019/3/4
*/
<template>
  <div class="tags-view-container">
    <router-link
            v-for="tag in visitedViews"
            class="tags__link"
            ref="tag"
            :class="isActive(tag) ? 'tags__link--active' : ''"
            :to="{path:tag.path,query:tag.query,fullPath:tag.fullPath}"
            tag="span"
            :key="tag.path"
            @click.middle.native="closeSelectedTag(tag)"
            @contextmenu.prevent.native="openMenu(tag,$event)"
    >
      {{tag.title}}
      <span v-if="!tag.meta.affix" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
    </router-link>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li v-if="!(selectedTag.meta&&selectedTag.meta.affix)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  .tags-view-container /deep/ {
    border-bottom: 1px solid #EAEEFB;
    padding: 10px 10px 0;
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
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>

<script>
  import path from 'path'
  export default {
    name: "",
    data(){
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {},
        affixTags: []
      }
    },
    watch: {
      $route() {
        this.addTags();
        this.moveToCurrentTag()
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
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
        let route = this.$route;
        const {name} = this.$route;
        if(name){
          this.$store.dispatch('addView',this.$route);
        }
        return false;
      },
      //关闭选中的标签
      closeSelectedTag(view){
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
        this.$store.dispatch('delAllViews').then(({ visitedViews }) => {
          if (this.affixTags.some(tag => tag.path === view.path)) {
            return
          }
          this.toLastView(visitedViews)
        })
      },
      moveToCurrentTag() {
        this.$nextTick(() => {
          const tags = this.$refs.tag;
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              // this.$refs.scrollPane.moveToTarget(tag)
              // when query is different then update
              if (tag.to.fullPath !== this.$route.fullPath) {
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
      }
    }
  }
</script>

