<template>
    <div id="app">
        <div class="row">
            <pre>Users: {{users}}</pre>
            <pre>Addresses: {{addresses}}</pre>
            <pre>Tasks: {{tasks}}</pre>
            <pre>Articles: {{articles}}</pre>
            <pre>Tags: {{tags}}</pre>
        </div>

        <hr>
        <div>
            <strong>Users and posts, using <code>userRelated</code> getter</strong>
            <ul v-for="u in users" :key="u.id">
                <li>{{u.name}}
                    <!-- This call may be done in a method, instead of the view,
                     but you get the point -->
                    <ul v-for="p in $store.getters.userRelated('articles', u.id)">
                        <li>{{p.title}}</li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

export default {
  name: 'app',
  computed: {
    users () {return this.$store.getters.users},
    addresses () {return this.$store.getters.addresses},
    articles () {return this.$store.getters.articles},
    tags () {return this.$store.getters.tags},
    tasks () {return this.$store.getters.tasks},
  },
  created () {
    // this.$store.dispatch('loadUsers')
    // this.$store.dispatch('loadAddresses')
    // this.$store.dispatch('loadTasks')
    this.$store.dispatch('loadArticles')
    // this.$store.dispatch('loadTags')
  },
}
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        width: 100%
    }

    .row {
        display: flex;
        width: 100%
    }

    pre {
        flex-grow: 1;
        background-color: #EEE;
        margin: 15px;
        padding: 15px;
    }
</style>
