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

export default function (endpoint, singular, plural, editable = true, destroyable = true) {
  const lowCamelSingular = camelize(singular, false)
  const lowCamelPlural = camelize(plural, false)
  const camelSingular = camelize(singular)
  const camelPlural = camelize(plural)

  // Empty module
  const module = {state: {}, mutations: {}, actions: {}, getters: {}}

  // Mutators:
  module.mutations[`set_${singular}`] = (state, entity) => { Vue.set(state, entity.id, entity) }
  module.mutations[`remove_${singular}`] = (state, id) => {Vue.delete(state, id)}

  // Actions:
  module.actions[`load${camelPlural}`] = ({commit}) => {
    api.get(endpoint)
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          commit(`set_${singular}`, data[i])
        }
      })
      .catch((error) => {console.log(`ERROR in load${camelPlural}:`, error)})
  }
  module.actions[`load${camelSingular}`] = ({commit}, id) => {
    api.get(`${endpoint}/${id}`)
      .then((data) => {commit(`set_${singular}`, data)})
      .catch((error) => {console.log(`ERROR in load${camelSingular}:`, error)})
  }
  if (editable) {
    module.actions[`create${camelSingular}`] = ({commit}, payload) => {
      api.post(endpoint, payload)
        .then((data) => {
          // Let's assume "data" is the new article, sent back by the API
          // We don't want to store the user input in our store :)
          commit(`set_${singular}`, data)
        })
        .catch((error) => {console.log(`ERROR in create${camelSingular}:`, error)})
    }
    module.actions[`update${camelSingular}`] = ({commit}, payload) => {
      api.patch(`${endpoint}/${payload.id}`, payload)
        .then((data) => {
          // Let's assume "data" is the updated article
          commit(`set_${singular}`, data)
        })
        .catch((error) => {console.log(`ERROR in update${camelSingular}:`, error)})
    }
  }
  if (destroyable) {
    module.actions[`destroy${camelSingular}`] = ({commit}, id) => {
      api.delete(`${endpoint}/${id}`)
        .then(() => { commit(`remove_${singular}`, id) })
        .catch((error) => {console.log('ERROR in DESTROY_ARTICLE:', error)})
    }
  }

  // Getters
  module.getters[lowCamelPlural] = state => state
  module.getters[lowCamelSingular] = state => id => state[id] || undefined

  return module
}
