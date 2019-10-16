/*
*  @描述：文件作用
*  @作者：付文松
*  @创建时间：2019/1/31
*/
import Vue from "vue";

Vue.directive("perm",{
  inserted(el,binding,vnode){
    let vm = vnode.componentInstance;
    if(!vm)return false;
    let storeGlobal = vm.$store.state.global;
    let sysBtnPermissions = storeGlobal.sysBtnPermissions;
    let hasPermission = sysBtnPermissions[binding.value];
    let modifiers = binding.modifiers;
    let isDisabled = modifiers.disabled;
    let isShow = modifiers.show;
    let isRemove = modifiers.remove;
    if(isShow){return false;}
    if(!hasPermission && isDisabled){
      el.setAttribute("disabled","disabled");
      el.setAttribute("title","您没有该功能权限");
      el.classList.add("is-disabled");
      return false;
    }
    if(!hasPermission || isRemove){
      el.remove();
    }
  }
})