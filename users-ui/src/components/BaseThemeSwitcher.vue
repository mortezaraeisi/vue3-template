<template>
  <q-toggle
    dense
    color="primary"
    class="text-dark"
    :icon="toggleIcon"
    v-model="isDark"
    @update:model-value="toggleDarkness"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from '../compositions/use-theme';

const theme = useTheme();
const isDark = computed(() => theme.isDark.value);
const toggleIcon = computed(() => (theme.isDark.value ? 'fas fa-sun' : 'fas fa-moon'));

function toggleDarkness(val: boolean) {
  if (val) {
    theme.dark();
  } else {
    theme.light();
  }
}
</script>
