# 正通 多窗口 组件

## 描述
记录历史页

## 属性

1. 更新zt-tags-view组件`cnpm i zt-tags-view@latest --save`
2. 把/views/index.html里面的iconfont css 更新到目前最新的(//at.alicdn.com/t/font_565095_nij7t6cyeq9.css)或更新的
3. 在/src/App.vue文件引入` <tags-view></tags-view>`,如有需要用到缓存页面的情况下，把`<router-view></router-view>`更换为
```
 <keep-alive>
	<router-view :key="key" v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view :key="key" v-if="!$route.meta.keepAlive"></router-view>
```
.
添加'computed'
```

    computed:{
      cachedViews(){
        console.log(this.$store.state.tagsView)
        return this.$store.state.tagsView.cachedViews;
      },
      key() {
        return this.$route.fullPath
      }
    }
```
4. 在/src/routes/index.js里面的对象的`meta`属性添加`title`和 `keepAlive`
如：
```
    meta:{
      p:"inbound",
      title:"整车到库管理",  // 当前页面的菜单名
      keepAlive:false  // 页面需要开启缓存时设置为true
    },
   // 或
    meta:{
      p:"inbound",
      title:"整车到库管理-详情",  // 当前页面的菜单名
      keepAlive:false  // 页面需要开启缓存时设置为true
    },

   // 或
    meta:{
      p:"inbound",
      title:"整车到库管理-新增",  // 当前页面的菜单名
      keepAlive:false  // 页面需要开启缓存时设置为true
    },
```