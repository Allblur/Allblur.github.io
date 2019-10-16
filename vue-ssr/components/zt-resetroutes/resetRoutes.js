/*
*  @描述：重置路由
*  @作者：付文松
*  @创建时间：2018/8/1
*/

module.exports = function(routes){
  return {
    data:{
      subMenu:[],
      permissionRoutes:{},
      headerMounted:false
    },
    computed:{
      homeRedirect(){
        let subMenu = this.subMenu || [];
        let firstMenu = subMenu[0];
        let url = '';
        let children = [];
        if(firstMenu){
          children = firstMenu.children;
          url = children && children.length ? children[0].url : firstMenu.url
        }
        if(!url){
          this.$message.error("您暂无改栏目权限，请联系管理员");
        }
        return url;
      }
    },
    watch:{
      headerMounted(n,o){
        if(n){
          let resources = project + "ResourcesObj";
          let resourcesObj = this.$store.state.global[resources];
          this.$nextTick(()=> {
            let currentProjectCode = this.$store.state.global.currentProjectCode;
            this.subMenu = resourcesObj[currentProjectCode];
            this.permissionRoutes = this.getAllPermissionRoutes(this.subMenu);
            let newRoute = this.resetRoutes(routes,this.permissionRoutes);
            this.$router.addRoutes(newRoute);
          });
        }
      }
    },
    methods:{
      getAllPermissionRoutes(menu){
        let permissionRoutes = {};
        menu = menu || [];
        (function recursivePermissionRoutes(menu){
          for(let i = 0;i<menu.length;i++){
            let children = menu[i].children;
            let url = menu[i].url;
            if(children && children.length){
              recursivePermissionRoutes(children);
            }else{
              permissionRoutes[url] = true;
            }
          }
        })(menu);
        return permissionRoutes;
      },
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
        // 404页面
        routes.push({
          path: '*',
          component(resolve){
            require(["zt-notfound"],resolve);
          },
        })
        return routes;
      }
    }
  };
}