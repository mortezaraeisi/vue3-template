<template>
  <router-view/>
</template>

<script setup lang="ts">
import { useTheme } from 'src/compositions/use-theme';

const theme = useTheme();
theme.system();

</script>
