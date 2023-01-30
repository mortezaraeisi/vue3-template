<template>
  <q-layout>
    <q-page-container>
      <router-view/>
    </q-page-container>
    <q-footer class="row q-gutter-x-md justify-center items-center">
      {{ $t('copyright.company') }}
      <q-icon name="fas fa-copyright"/>
      <div>
        {{ $t('copyright.law') }}
      </div>
      <a :href="$t('copyright.url')" target="_blank">
        <q-icon name="fas fa-external-link" size="13px"/>
      </a>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">

</script>
