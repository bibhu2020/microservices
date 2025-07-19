<!--Using Vue3.x Comosition API-->
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const message = ref('Hello Vue!');
const status = ref('pending');
const link = ref('https://vuejs.org');
const newTask = ref('');
const tasks = ref([
  { id: 1, title: 'Task 1', completed: false },
  { id: 2, title: 'Task 2', completed: true },
  { id: 3, title: 'Task 3', completed: false }
]);

const toggleStatus = () => {
  status.value = status.value === 'active' ? 'pending' : 'active';
}

const count = tasks.value.length;
const addTask = () => {
  if (newTask.value.trim() !== ''){
    tasks.value.push({ id: count, title: newTask.value , completed: false });
    newTask.value = '';
  }
};

const deleteTask = (key) => {
  tasks.value.splice(key, 1);
}

onMounted(async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    tasks.value = data.map((task, index) => ({
      id: index,       // Assuming the 'is' field exists in the API response
      title: task.title, // Assuming the 'title' in the API response corresponds to 'value'
      completed: task.completed // Assuming 'completed' exists in the API response
    }));
  } catch(error){
    console.log('error fetching tasks')
  }
});

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

  <form @submit.prevent="addTask">
    <label for="newTask">Add Task</label>
    <input type="text" id="newTask" name="newTask" v-model="newTask"/>
    <button type="submit">Submit</button>
  </form>

  <h3>Tasks:</h3>
  <ul>
    <li v-for="task in tasks" :key="task.id">
      <span>
        {{ task.title }} - {{ task.completed ? 'Completed' : 'Not Completed' }}
      </span>
      <button @click="deleteTask(task.id)">X</button>
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