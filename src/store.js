import Vue from 'vue'
import Vuex from 'vuex'
import moduleGenerator from './modulator'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    users: moduleGenerator('users', 'user', 'users', true, false),
    posts: moduleGenerator('posts', 'post', 'posts'),
    postTypes: moduleGenerator('post_types', 'post_type', 'post_types'),
  }
})
