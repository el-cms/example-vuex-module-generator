// We need Vue to ensure proper updates in mutations
import Vue from 'vue'

const camelize = function (snakeText, capitalizeFirstLetter = true) {
  let regexp = /(_\w)/g
  if (capitalizeFirstLetter) {
    regexp = /(^\w|_\w)/g
  }
  const out = snakeText.replace(regexp, (match) => {
    if (match.length > 1) {
      return match[1].toUpperCase()
    } else {
      return match.toUpperCase()
    }
  })
  return out
}

const mutations = function (singular) {
  const mutations = {}

  mutations[`set_${singular}`] = (state, entity) => { Vue.set(state, entity.id, entity) }
  mutations[`remove_${singular}`] = (state, id) => {Vue.delete(state, id)}

  return mutations
}

const actions = function (endpoint, singular, plural, editable = true, destroyable = true) {
  const camelSingular = camelize(singular)
  const camelPlural = camelize(plural)
  const actions = {}

  actions[`load${camelPlural}`] = ({commit}) => {
    api.get(endpoint)
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          commit(`set_${singular}`, data[i])
        }
      })
      .catch((error) => {console.log(`ERROR in load${camelPlural}:`, error)})
  }
  actions[`load${camelSingular}`] = ({commit}, id) => {
    api.get(`${endpoint}/${id}`)
      .then((data) => {commit(`set_${singular}`, data)})
      .catch((error) => {console.log(`ERROR in load${camelSingular}:`, error)})
  }
  if (editable) {
    actions[`create${camelSingular}`] = ({commit}, payload) => {
      api.post(endpoint, payload)
        .then((data) => {
          // Let's assume "data" is the new article, sent back by the API
          // We don't want to store the user input in our store :)
          commit(`set_${singular}`, data)
        })
        .catch((error) => {console.log(`ERROR in create${camelSingular}:`, error)})
    }
    actions[`update${camelSingular}`] = ({commit}, payload) => {
      api.patch(`${endpoint}/${payload.id}`, payload)
        .then((data) => {
          // Let's assume "data" is the updated article
          commit(`set_${singular}`, data)
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
}

const getters = function (singular, plural) {
  const lowCamelSingular = camelize(singular, false)
  const lowCamelPlural = camelize(plural, false)

  const getters = {}

  getters[lowCamelPlural] = state => state
  getters[lowCamelSingular] = state => id => state[id] || undefined

  return getters
}

export default function (endpoint, singular, plural, editable = true, destroyable = true) {
  const module = {
    state: {}, mutations: {
      ...mutations(singular),
    }, actions: {
      ...actions(endpoint, singular, plural, editable, destroyable),
    }, getters: {
      ...getters(singular, plural),
    },
  }

  return module
}
