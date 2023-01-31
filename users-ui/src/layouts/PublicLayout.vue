<template>
  <q-layout>
    <q-header bordered class="bg-transparent">
      <q-toolbar>
        <q-toggle
          dense
          color="primary"
          class="text-dark"
          :icon="toggleIcon"
          v-model="isDark"
          @update:model-value="toggleDarkness"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view/>
    </q-page-container>
    <q-footer class="row q-gutter-x-md justify-center items-center bg-transparent text-dark">
      {{ $t('copyright.company') }}
      <q-icon name="fas fa-copyright"/>
      <div>
        {{ $t('copyright.law') }}
      </div>
      <a :href="$t('copyright.url')" target="_blank">
        <q-icon name="fas fa-external-link" size="13px" color="primary"/>
      </a>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';

const q = useQuasar();
const isDark = ref(q.dark.isActive);
const toggleIcon = computed(() => (isDark.value ? 'fas fa-sun' : 'fas fa-moon'));

function toggleDarkness() {
  q.dark.set(isDark.value);
}
</script>
