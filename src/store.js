import Vue from 'vue'
import Vuex from 'vuex'
import Modulator from './modulator'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    users: Modulator.generateModule('users', 'user', 'users', true, false),
    posts: Modulator.generateModule('posts', 'post', 'posts'),
    postTypes: Modulator.generateModule('post_types', 'post_type', 'post_types'),
  }
})
