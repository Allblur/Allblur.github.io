/*
*  @描述：文件作用
*  @作者：付文松
*  @创建时间：2018/7/17
*/

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import globalStore from "./globalStore";
import tagsView from "./tagsView";
export default new Vuex.Store({
  modules:{
    global:globalStore,
    tagsView
  }
})