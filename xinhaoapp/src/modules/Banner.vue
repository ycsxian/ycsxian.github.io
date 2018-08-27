<template>
  <div class="ctm-header">
    <img v-if="!isOnline" v-show="!!componentData.image_url.app" :src="componentData.image_url.app" class="img-auto"/>

    <div v-else v-show="!!componentData.image_url.onlinefront" :style="styleObject">
      <img :src="componentData.image_url.onlinefront" class="img-online"/>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'banner',
    props: ['componentData'],
    data() {
      return {
        isOnline: false,
        styleObject: {}
      }
    },
    created() {
      if (document.body.clientWidth > 1025 || pageInfo.isOnline) {
        this.isOnline = true;
        this.styleObject.background = 'url(' + this.componentData.image_url.onlineback + ') center 0 no-repeat'
      }
    },
    mounted() {
      this.$store.dispatch('createMetricAct', 'banner');
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
  .ctm-header {
    text-align: center;
    position: relative;
  }

  @media screen and (max-width: 1024px) {
    .ctm-header .img-auto {
      display: block;
      min-height: 0.9rem;
    }
  }

  @media screen and (min-width: 1024px) {
    .ctm-header {
      text-align: center;
    }

    .ctm-header .img-online {
      display: inline-block;
      width: auto;
    }
  }
</style>
