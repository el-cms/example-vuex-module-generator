// We need Vue to ensure proper updates in mutations
import Vue from 'vue'
import utils from '../utils'
import api from '../fake-api'
import findAndDispatchEntities from '../data_types'

export default {
  mutations (singular) {
    const mutations = {}

    mutations[`set_${singular}`] = (state, entity) => { Vue.set(state, entity.id, entity) }
    mutations[`remove_${singular}`] = (state, id) => {Vue.delete(state, id)}

    return mutations
  },
  actions (endpoint, singular, plural, editable = true, destroyable = true) {
    const camelSingular = utils.camelize(singular)
    const camelPlural = utils.camelize(plural)
    const actions = {}

    actions[`dispatchAndCommit${camelSingular}`] = ({commit, dispatch}, entity) => {
      findAndDispatchEntities(entity, dispatch, singular)
        .then((cleanEntity) => {
          // Commit the cleaned entity: all the fields where removed by findAndDispatchEntities
          commit(`set_${singular}`, cleanEntity)
        })
        .catch((error) => {console.log('An error occurred while processing data')})
    }

    actions[`load${camelPlural}`] = ({dispatch}) => {
      api.get(endpoint)
        .then((data) => {
          for (let i = 0; i < data.length; i++) {
            dispatch(`dispatchAndCommit${camelSingular}`, data[i])
          }
        })
        .catch((error) => {console.log(`ERROR in load${camelPlural}:`, error)})
    }
    actions[`load${camelSingular}`] = ({dispatch}, id) => {
      api.get(`${endpoint}/${id}`)
        .then((data) => {dispatch(`dispatchAndCommit${camelSingular}`, data)})
        .catch((error) => {console.log(`ERROR in load${camelSingular}:`, error)})
    }
    if (editable) {
      actions[`create${camelSingular}`] = ({dispatch}, payload) => {
        api.post(endpoint, payload)
          .then((data) => {
            // Let's assume "data" is the new article, sent back by the API
            // We don't want to store the user input in our store :)
            dispatch(`dispatchAndCommit${camelSingular}`, data)
          })
          .catch((error) => {console.log(`ERROR in create${camelSingular}:`, error)})
      }
      actions[`update${camelSingular}`] = ({dispatch}, payload) => {
        api.patch(`${endpoint}/${payload.id}`, payload)
          .then((data) => {
            // Let's assume "data" is the updated article
            dispatch(`dispatchAndCommit${camelSingular}`, data)
          })
          .catch((error) => {console.log(`ERROR in update${camelSingular}:`, error)})
      }
    }
    if (destroyable) {
      actions[`destroy${camelSingular}`] = ({commit}, id) => {
        api.delete(`${endpoint}/${id}`)
          .then(() => { commit(`remove_${singular}`, id) })
          .catch((error) => {console.log('ERROR in DESTROY_ARTICLE:', error)})
      }
    }

    return actions
  },
  getters (singular, plural) {
    const lowCamelSingular = utils.camelize(singular, false)
    const lowCamelPlural = utils.camelize(plural, false)

    const getters = {}

    getters[lowCamelPlural] = state => state
    getters[lowCamelSingular] = state => id => state[id] || undefined
    getters[`${lowCamelSingular}Related`] = (state, rootState) => (type, id) => {
      return utils.filterObject(rootState[type], (entity) => entity[`${singular}_id`] === id) || undefined
    }

    return getters
  },
  generateModule (endpoint, singular, plural, editable = true, destroyable = true) {
    return {
      state: {},
      mutations: {
        ...this.mutations(singular),
      },
      actions: {
        ...this.actions(endpoint, singular, plural, editable, destroyable),
      },
      getters: {
        ...this.getters(singular, plural),
      },
    }
  },
}
