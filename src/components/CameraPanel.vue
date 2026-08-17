<template>
  <section class="card camera" :class="{focused:props.focused}">
    <h2>📷 Cámaras</h2>
  </section>
</template>

<script setup>

const props = defineProps({

    focused: Boolean,

    selectedDate: Object

})

</script>


<style scoped>

.focused{

    border:3px solid #58c472;

    box-shadow:0 0 20px rgba(88,196,114,.5);

    transform:scale(1.01);

    transition:.2s;

}

</style>
