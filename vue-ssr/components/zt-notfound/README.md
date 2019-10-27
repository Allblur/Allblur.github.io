# 正通404错误页面

## 使用

安装：  
```
cnpm install zt-notfound@latest --save
```

在目录`\src\mixins\resetRoutes\resetRoutes.js`里函数名为`resetRoutes`的最后添加:
```
// 404页面
routes.push({
  path: '*',
  component(resolve){
    require(["zt-notfound"],resolve);
  },
})
```

函数内部：
```
resetRoutes(nroutes,resource){
  function getRoutes(routes){
    for(let i = routes.length - 1;i>=0;i--){
      let currentRoutes = routes[i];
      if(!currentRoutes.meta){
        delete currentRoutes.redirect;
        break;
      }
      let currentMeta = currentRoutes.meta.p;
      let hasResource = resource[currentMeta];
      let children = currentRoutes.children;
      if(!hasResource){
        if(children && children.length){
          getRoutes(children);
        }else{
          if(!hasResource){
            routes.splice(i,1);
          }
        }
      }
    }
  }
  getRoutes(nroutes);
  routes[0].redirect = {
    name:this.homeRedirect
  };

  // 404页面--------------------
  routes.push({
    path: '*',
    component(resolve){
      require(["zt-notfound"],resolve);
    },
  })
  // 404页面结束--------------------
  
  return routes;
}
```



