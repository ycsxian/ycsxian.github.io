// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    time: 0,
    start: startTime,
    end: 0,
    moduleList: [],
    componentList: []
  },
  getters: {},
  mutations: {
    setModuleList(state, arr) {
      state.moduleList = arr
    },
    setComponentList(state, arr) {
      state.componentList = arr
    },
    outputTime(state, name) {
      state.end = new Date().getTime()
      state.time = state.end - state.start
      console.log(name, state.time)
      console.log('是否完成', ifAllLoaded(state.componentList, state.moduleList))
    },
    createMetric(state, type) {
      if (typeof window['__bfi'] == 'undefined') window['__bfi'] = [];

      state.end = new Date().getTime()
      state.time = state.end - state.start
      console.log(type, state.time)

      let metric = {
        name: "101530",       //=申请的Metric.Key
        tag: {type: type},
        sample: 100,
        value: state.time
      }
      __bfi.push(['_trackMetric', metric])
    }
  },
  actions: {
    //添加模块列表
    setModuleListAct({commit}, arr) {
      commit('setModuleList', arr)
    },
    //测试模块加载时间
    outputTimeAct({commit, state}, type) {
      state.componentList.push(type);
      commit('outputTime', type)
      if (ifAllLoaded(state.componentList, state.moduleList))
        commit('outputTime', 'allModulesLoaded');
    },
    //模块加载时间 埋点 入口
    createMetricAct({commit, state}, type) {
      state.componentList.push(type);
      commit('createMetric', type)
      if (ifAllLoaded(state.componentList, state.moduleList))
        commit('createMetric', 'allModulesLoaded');
    },
  },

})

function ifAllLoaded(a, b) {
  if (b.length == 0)
    return false

  for (let i in b) {
    if (a.indexOf(b[i]) == -1)
      return false
  }
  return true;
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  // router,
  template: '<App/>',
  components: {App}
})
