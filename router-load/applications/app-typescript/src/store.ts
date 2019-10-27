/* store module */
console.log("process.env.VUE_APP_NAME==>>", process.env.VUE_APP_NAME)
export default {
  namespaced: true, // namespaced must be true in module app.
  state: {
    name: process.env.VUE_APP_NAME,
  },
  mutations: {},
  actions: {},
};
