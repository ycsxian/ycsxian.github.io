<template>
<div>
    <div v-html="currentStyle"></div>

    <div id="J-main-wrapper" class="main-wrapper container pageGraphic-container">
          <!-- <viewspot-component ref="viewspot" :currentTabProducts="currentTabProducts" :public="public"></viewspot-component> -->
          <graphic-details-component v-if="graphicDetails.isShowModule" :graphicDetails="graphicDetails" :configCss="componentData.config_css"></graphic-details-component>
    </div>
</div>
</template>


<script>

var $win = $(window);
var $body = $('body');

// import componentViewSpot from '../components/ViewSpot'
import componentGraphicDetails from '../components/GraphicDetails'

export default {
  name: 'pagegraphicdetail',
  props:['componentData'],
  data () {
    return {
      msg: 'this is test for pagegraphicdetail.vue!!',
      currentTabProducts:[],
      currentStyle:'',
      configData:this.componentData.config_data,
      graphicDetails:this.componentData.graphic_details,
      public:this.componentData.config_pub
    }
  },
  components: {
      // 'viewspot-component':componentViewSpot,
      'graphic-details-component':componentGraphicDetails
  },
  created(){
    this.setBodyMod();
  },
  mounted(){
    var cssTemp = this.componentData.styleTemp.pub + this.componentData.styleTemp[this.public.modType];
    var mainTmpl = this.handlercss(cssTemp, this.componentData.config_css);
    this.currentStyle = '<style>' + mainTmpl + '</style>';
    this.$store.dispatch('createMetricAct','pagegraphicdetail');

  },
  methods:{
    handlercss(temp,data){
        var htmltemp='';
        var strings = temp.split('}}');
        for(var i = 0;i<strings.length;i++){
            var key = strings[i].split('{{this.');
            var a = 'data' + '.' + key[1];
            var value = eval(a);
            var string = key[0] + value;
            htmltemp = htmltemp+string;

        }
        return htmltemp
    },
    setBodyMod(){
      $('body').addClass('mod1');
        this.$set(this.public,'modType','mod1');
        this.$set(this.public,'module','pagegraphicdetail');
        this.currentTabProducts = this.configData[0].NumList;

    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

