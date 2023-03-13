<template>
  <section>
    <h1>404</h1>
    <h5>
      where are you going?
    </h5>
    <button @click="$router.back()">Get back</button>
  </section>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>
