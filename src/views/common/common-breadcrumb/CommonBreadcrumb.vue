<template>
  <div v-if="!this.isHomeRoute" class="common-breadcrumb">
    <a-breadcrumb separator=">">
      <a-breadcrumb-item :key="name" v-for="name in names">
          <span>
              <a @click="$router.push({name: name})">{{ name }}</a>
          </span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>
<script>
export default {
  name: 'CommonBreadcrumb',
  data() {
    return {}
  },
  methods: {
  },
  computed: {
    names: function () {
      return this.$route.matched.map(match => match.name)
    },

    isHomeRoute: function () {
      let currentRoute = this.$store.state.currentRoute;
      return currentRoute === '/'
    }
  }
}
</script>
<style scoped>
@import "common-breadcrumb.css";
</style>
