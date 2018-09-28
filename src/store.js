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
    addresses: Modulator.generateModule('addresses', 'address', 'addresses'),
    articles: Modulator.generateModule('articles', 'article', 'articles'),
    tags: Modulator.generateModule('tags', 'tag', 'tags'),
    tasks: Modulator.generateModule('tasks', 'task', 'tasks'),
  },
})
