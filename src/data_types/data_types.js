export default {
  user: {
    singular: 'user',
    plural: 'users',
    relations: {
      many: ['posts', 'tasks'],
      one: [
        {field: 'billing_address', type: 'address'},
        {field: 'delivery_address', type: 'address'},
      ],
      habtm: [],
    },
  },
  address: {
    singular: 'address',
    plural: 'addresses',
    relations: {
      many: [],
      one: ['user'],
      habtm: [],
    },
  },
  article: {
    singular: 'post',
    plural: 'posts',
    relations: {
      many: [],
      one: ['user'],
      habtm: [
        {name: 'tags', field: 'post_id', assoc: 'tag_id'},
      ],
    },
  },
  tag: {
    singular: 'tag',
    plural: 'tags',
    relations: {
      many: [],
      one: [],
      habtm: [
        {name: 'posts', field: 'tag_id', assoc: 'post_id'},
      ],
    },
  },
  task: {
    singular: 'task',
    plural: 'tasks',
    relations: {
      many: [],
      one: ['user'],
      habtm: [],
    },
  },
}
