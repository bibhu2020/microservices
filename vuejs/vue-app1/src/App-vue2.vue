<!--Using Vue2.x Option API-->
<script>
export default {
  name: 'App',
  data() {
    return {
      message: 'Hello Vue!',
      status: 'pending',
      link: 'https://vuejs.org',
      tasks: [
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: true },
        { id: 3, title: 'Task 3', completed: false }
      ] 
    };
  },
  methods: {
    toggleStatus() {
      this.status = this.status === 'active' ? 'pending' : 'active';
    }
  }
};
</script>

<template>
  <h1>{{message}}</h1>
  <p v-if="status === 'active'">
    User is logged in.
  </p>
  <p v-else-if="status === 'pending'">
    User is pending.
  </p>
  <p v-else>
    User is not logged in.
  </p>
  <h3>Tasks:</h3>
  <ul>
    <li v-for="task in tasks" :key="task.id">
      {{ task.title }} - {{ task.completed ? 'Completed' : 'Not Completed' }}
    </li>
  </ul>
  <a :href="link" target="_blank">Go to Vue.js</a>
  <button v-on:click="toggleStatus()">Change Status</button>
</template>

<style scoped>
h1 {
  color: blueviolet;
}
</style>