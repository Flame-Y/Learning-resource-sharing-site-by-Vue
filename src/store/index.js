//引入Vue核心库
import Vue from "vue";
//引入Vuex
import Vuex from "vuex";
//应用Vuex插件
Vue.use(Vuex);

const actions = {
  //响应组件中加的动作
};

const mutations = {
  updateToken(state, value) {
    state.token = value;
  },
  removeToken(state) {
    state.token = "";
  },
  getNewUsername(state, value) {
    state.newUsername = value;
  },
  getNewPassword(state, value) {
    state.newPassword = value;
  },
  getRouter(state, value) {
    state.thisRouter = value;
  }
};

//初始化数据
const state = {
  token: "",
  loginUsername: "",
  newPassword: "",
  thisRouter: ""
};
const getters = {
  bigSum(state) {
    return state.sum * 10;
  }
};

//创建并暴露store
export default new Vuex.Store({
  actions,
  mutations,
  state,
  getters
});
