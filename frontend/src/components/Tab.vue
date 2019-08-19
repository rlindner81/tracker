<template>
  <div class="component tab" v-show="isActive"><slot></slot></div>
</template>

<script>
export default {
  props: {
    name: { required: true },
    selected: { default: false }
  },
  data () {
    return {
      isActive: false
    }
  },
  created () {
    this.tabs = this.$children
  },
  mounted () {
    if (this.$route.hash) {
      if (this.$route.hash === this.href) {
        this.isActive = true
      }
    } else {
      this.isActive = this.selected
    }
  },
  computed: {
    href () {
      return '#' + this.name.toLowerCase().replace(/ /g, '-')
    }
  },
  methods: {
    selectTab (selectedTab) {
      this.tabs.forEach(tab => {
        tab.isActive = (tab.name === selectedTab.name)
      })
    }
  }
}
</script>
