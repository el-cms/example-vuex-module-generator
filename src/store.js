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
    comments: {
      state: {},
      mutations: {
        ...Modulator.mutations('comment'),
        my_custom_mutation: (state, data) => {/* do something */},
      },
      actions: {
        ...Modulator.actions('comments', 'comment', 'comments'),
        createComment: ({commit}, payload) => {/* override an action from the Modulator */},
      },
      getters: {
        ...Modulator.getters('comment', 'comments'),
      },
    },
  },
})
