<template>
    <section>
        <h1>Customers details</h1>
        <p>{{ id }}</p>
    </section>
</template>

<script setup lang="ts">
const {id} = useRoute().params
</script>