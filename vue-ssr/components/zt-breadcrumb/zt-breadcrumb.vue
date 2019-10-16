/*
*  @描述：文件作用
*  @作者：付文松
*  @创建时间：2019/3/6
*/
<template>
  <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
      <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{item.meta.abbtitle || item.meta.title}}</span>
      <a v-else @click.prevent="handleLink(item)">{{ item.meta.abbtitle || item.meta.title}}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 12px;
    margin-left: 8px;
    padding:20px 0 0;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
    .el-breadcrumb__inner{
      a{
        color: #409EFF;
        font-weight:normal;
      }
    }
  }
</style>

<script>
  import pathToRegexp from 'path-to-regexp'
  export default {
    data() {
      return {
        levelList: null
      }
    },
    watch: {
      $route() {
        this.getBreadcrumb()
      }
    },
    created() {
      this.getBreadcrumb()
    },
    methods: {
      getBreadcrumb() {
        let matched = this.$route.matched.filter(item => item.name);
        const first = matched[0]
        if (first && first.name.trim().toLocaleLowerCase() !== 'Dashboard'.toLocaleLowerCase()) {
          matched = [{ path: '/', meta: { title: this.$store.state.global.currentProjectName }}].concat(matched)
        }
        this.levelList = matched.filter(item => item.meta && (item.meta.abbtitle || item.meta.title) && item.meta.breadcrumb !== false)
      },
      pathCompile(path) {
        // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
        const { params } = this.$route
        var toPath = pathToRegexp.compile(path)
        return toPath(params)
      },
      handleLink(item) {
        const { redirect, path } = item
        if (redirect) {
          this.$router.push(redirect)
          return
        }
        this.$router.push(this.pathCompile(path))
      }
    }
  }
</script>

