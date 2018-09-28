const addUser = (name, billing_address, delivery_address, tasks) => {
  data.users.push({
    id: data.users.length + 1,
    name,
    billing_address,
    delivery_address,
    tasks,
    // Omit the posts, you get the principle :)
  })
}

const addAddress = (number, street) => {
  data.addresses.push({
    id: data.addresses.length + 1,
    number,
    street,
  })
}

const addArticle = (title, user, tags) => {
  data.articles.push({
    id: data.articles.length + 1,
    title,
    user,
    tags,
  })
}

const addTag = (name) => {
  data.tags.push({
    id: data.tags.length + 1,
    name,
    // Omit the posts, you get the principle :)
  })
}

const addTask = (title, user_id) => {
  data.tasks.push({
    id: data.tasks.length + 1,
    title,
    user_id,
    done: false,
  })
}

const data = {
  users: [],
  addresses: [],
  articles: [],
  tags: [],
  tasks: [],
}

addAddress('1', 'Elm street')
addAddress('12', 'Crystal lake av.')
addAddress('45', 'Chicago street')

addTag('recipes')
addTag('my dreams')
addTag('howto')

addTask('Terrorize young people', 1)
addTask('Visit Crystal Lake', 1)

addTask('Kill everybody', 2)
addTask('Sleep', 2)

addUser('Freddy', data.addresses[0], data.addresses[0])
addUser('Jason', data.addresses[1], data.addresses[2])

addArticle('I have a dream', data.users[0], [data.tags[0]])
addArticle('Cooking with friends', data.users[0], [data.tags[1]])
addArticle('Shahahahuhaha, or discrete whispering', data.users[1], [data.tags[2]])

const types = Object.keys(data)
const error404 = {statusCode: 404, message: 'Not found'}

export default {
  get (url, payload) {
    return new Promise((resolve, reject) => {
      if (types.indexOf(url) > -1) {
        resolve(data[url])
      }
      reject(error404)
    })
  },
  // No needs for this.
  post: (url, payload) => new Promise((resolve, reject) => {resolve({})}),
  patch: (url, payload) => new Promise((resolve, reject) => {resolve({})}),
  delete: (url, payload) => new Promise((resolve, reject) => {resolve({})}),
}
