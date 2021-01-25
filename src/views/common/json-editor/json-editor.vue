<template>
  <vue-json-editor :show-btns="false" :expandedOnStart="true" lang="zh" mode="code" v-model="value2" />
</template>

<script>
export default {
  name: "json-editor",

  model: {
    prop: 'value',
    event: 'update:value'
  },

  props: {
    value: {
      type: Object,
      default: () => null
    },
  },

  computed: {
    value2: {
      get(){
        return this.value;
      },
      set(value) {
        this.$emit('update:value', value);
        this.$emit('input', value);
        this.$emit('change', value);
      }
    }
  }
}
</script>

<style scoped>

</style>
