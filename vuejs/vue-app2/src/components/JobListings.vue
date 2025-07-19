<script setup>
// import data from '@/jobs.json'
import {ref, reactive, defineProps, onMounted} from 'vue';
import Job from '@/components/Job.vue'
import { RouterLink } from 'vue-router';
import axios from 'axios';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

// const jobs = ref([]);
// console.log(jobs.value);

const state = reactive({
  jobs: [],
  isLoading: true
});

onMounted(async () => {
  try{
    const response = await axios.get('/api/jobs')
    // jobs.value = response.data;
    state.jobs = response.data;
  }catch (err){
    console.log('Error fetching jobs.', err);
  } finally{
    state.isLoading = false;
  }
});

defineProps({
    limit: Number,
    showButton: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <section class="bg-green-50 px-4 py-10">
      <div class="container-xl lg:container m-auto">
        <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
          Browse Jobs
        </h2>
        <!-- show loading spinner when loding is true-->
        <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
          <PulseLoader/>
        </div>
        <!-- show job when loading is false-->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Job Listing 1 -->
          <!-- <Job class="bg-white rounded-xl shadow-md relative" v-for="job in jobs.slice(0, limit || jobs.length)" :key="job.id" :job="job">
          </Job> -->
          <Job class="bg-white rounded-xl shadow-md relative" v-for="job in state.jobs.slice(0, limit || state.jobs.length)" :key="job.id" :job="job">
          </Job>
        </div>
      </div>
    </section>
    <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
      <RouterLink
        to="/jobs"
        class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
        >View All Jobs</RouterLink>
    </section>
</template>