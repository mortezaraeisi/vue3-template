<template>
  <FontAwesomeIcon :icon="name"/>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps({
  name: {
    type: String,
    required: true,
  },
});

</script>
