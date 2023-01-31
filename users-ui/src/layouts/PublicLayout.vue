<template>
  <q-layout>
    <q-header bordered class="bg-transparent">
      <q-toolbar>
        <base-theme-switcher/>
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
</script>
