<script setup>
import { useStorage } from "@/composables/useStorage";

let food = useStorage('food', 'salad');
let age = useStorage('age');

</script>

<template>
  <main>
    <p>
      What's your favorite food? <input type="text" v-model="food"/>
    </p>
    <p>
      How old are you? <input type="text" v-model="age"/>
    </p>
  </main>
</template>
