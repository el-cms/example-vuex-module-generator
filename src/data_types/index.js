import utils from '../utils'
import dataTypes from './data_types'

// Creates an object like
// {
//   singulars: {
//     'users': 'user'
//   },
//   plurals: {
//     'user': 'users'
//   },
// }
const collectSingularsAndPlurals = function (dataTypes) {
  const singulars = {}
  const plurals = {}

  for (let key in dataTypes) {
    let type= dataTypes[key]
    if (utils.isObject(type)) {
      singulars[type.plural] = type.singular
      plurals[type.singular] = type.plural
    }
  }
  return {singulars, plurals}
}

const pluralsAndSingulars = collectSingularsAndPlurals(dataTypes)

// Returns a singular name or the string without the last character
const singular = function (plural) {
  if (pluralsAndSingulars.singulars[plural]) { return pluralsAndSingulars.singulars[plural] }
  console.error(`Singular not found for ${plural}, falling back.`)
  return plural.slice(0, plural.length - 1)
}

// Returns a plural name or the string with an ending 's"
const plural = function (singular) {
  if (pluralsAndSingulars.plurals[singular]) { return pluralsAndSingulars.plurals[singular] }
  console.error(`Plural not found for ${singular}, falling back`)
  return `${singular}s`
}

const dispatchOneRelations = function (entity, dispatch, entityType) {
  const relations = dataTypes[entityType].relations
  let fieldName = ''
  let typeName = ''
  let foreignKey = ''

  for (const relation of relations.one) {
    // Is the relation defined as string or object ?
    if (utils.isObject(relation)) {
      fieldName = relation.field
      typeName = relation.type
      foreignKey = `${relation.field}_id`
    } else {
      fieldName = relation
      typeName = relation
      foreignKey = `${relation}_id`
    }

    // Check if the relation is present in the entity
    if (
      utils.objectHasKey(entity, fieldName) &&
      // Prevent dispatching entities with no Ids
      // (i.e.: an entity like { name: 'my tag' } with nothing else
      utils.objectHasKey(entity[fieldName], 'id') &&
      entity[fieldName].id
    ) {
      // Check if the foreign_key exists and set it if necessary
      if (!utils.objectHasKey(entity, foreignKey)) {
        entity[foreignKey] = entity[fieldName].id
      } else {
        console.log(`fk ${foreignKey} exists`)
      }
      dispatch(`dispatchAndCommit${utils.camelize(typeName)}`, entity[fieldName])
    }

    // Anyway, we delete the key in the parent
    delete entity[fieldName]
  }

  return entity
}

const dispatchManyRelations = function (entity, dispatch, entityType) {
  const relations = dataTypes[entityType].relations
  let fieldName = ''
  let typeName = ''

  for (const relation of relations.many) {
    // Case where the relation is an object
    if (utils.isObject(relation)) {
      fieldName = relation.field
      typeName = relation.model
    } else {
      fieldName = relation
      typeName = relation
    }
    if (utils.objectHasKey(entity, fieldName)) {
      const singularRelationName = singular(typeName)
      for (const subEntity in entity[fieldName]) {
        if (entity[fieldName].hasOwnProperty(subEntity)) {
          // Prevent dispatching entities with no Ids
          if (entity[fieldName][subEntity].id) {
            dispatch(`dispatchAndCommit${utils.camelize(singularRelationName)}`, entity[fieldName][subEntity])
          }
        }
      }
      delete entity[fieldName]
    }
  }

  return entity
}

const dispatchHABTMRelations = function (entity, dispatch, entityType) {
  const relations = dataTypes[entityType].relations
  let typeName = ''

  for (const relation of relations.habtm) {
    if (utils.objectHasKey(entity, relation.name)) {
      const fieldName = relation.name
      const fkList = []
      const singularRelationName = singular(relation.name)
      for (const subEntity in entity[fieldName]) {
        // Here we have a sub-object
        if (entity[fieldName].hasOwnProperty(subEntity)) {
          // Prevent dispatching entities with no Ids
          if (entity[fieldName][subEntity].id) {
            fkList.push(entity[fieldName][subEntity].id)
            dispatch(`dispatchAndCommit${utils.camelize(singularRelationName)}`, entity[fieldName][subEntity])
          } else if (entity[fieldName][subEntity].fk_id) {
            fkList.push(entity[fieldName][subEntity].fk_id)
          } else {
            console.warning('I can\'t process this entity', modelName, entity[fieldName][subEntity])
          }
        }
      }
      entity[fieldName] = fkList
    }
  }
  if (relations.habtm.length > 0) {
    delete entity._matchingData
  }

  return entity
}

// Take an entity and dispatches the related data in corresponding modules
export default function (entity, dispatch, entityType) {
  return new Promise((resolve, reject) => {
    let newEntity
    newEntity = dispatchOneRelations(entity, dispatch, entityType)
    newEntity = dispatchManyRelations(newEntity, dispatch, entityType)
    newEntity = dispatchHABTMRelations(newEntity, dispatch, entityType)

    resolve(newEntity)
  })
}
