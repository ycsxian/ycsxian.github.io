<template>
    <div  v-if="currentTabProducts.length !== 1" class="mod3-tab clearfix J-tab ">
        <ul class="flex-box J-sub-tab option-page-background option-tab-background">
            <li v-for="(item,index ) in currentTabProducts" @click="selectsubTab(index)" class="flex-box-1 J-tab-trigger" :class="{'option-tab-current-background':(mod3tabIndex == index)}"><span>{{item.navTitle}}</span></li>
        </ul>
    </div>
</template>


<script>

export default {
  name: 'mod3subtab',
  props:['currentTabProducts','mod3tabIndex'],
  data () {
    return {
      msg: 'this is test for mod3subtab.vue!!',
    }
  },
  mounted(){
    this.subbarFloat();
  },
  methods:{
    selectsubTab(index){
        this.$emit('selectsubTab', index);
    },
    subbarFloat() {
      // 绑定在城市选择栏浮动中，此处去除
        // var that = this;
        // var $main = $('body');
        // var $window = $(window);
        // var $subFloat = $('.J-sub-tab');
        // var $warpper = $('.J-tab');
        // var headerHeight = $('#headerview').height();
        // var $headimg = $("#J-ctm-header");

        // // 宽屏不做悬浮
        // if(isWidescreen){
        //     return false;
        // }
        // // 模板3子tab悬停
        // $window.on('scroll.sticky', function () {
        //     requestAnimationFrame(function(){
        //         var top = $window.scrollTop();
        //         var subBarOffsetTop = $warpper.offset().top;
        //         if (top > subBarOffsetTop) {
                     
        //             $subFloat.addClass('scroll-sticky').css('top',$('#J-ctm-nav').height() + headerHeight);
                    
        //         } else {
        //             $subFloat.removeClass('scroll-sticky').removeAttr('style');      
        //         }

        //     });

        // });
      
    },
  }
}
</script>

<style scoped>
  /*section*/
.section-common {}
.section-title {text-align: center;position: relative;}
.section-title h3 {display: inline-block;*display:inline;*zoom:1;position: relative;z-index: 2;font-style: italic;}

@media screen and (max-width:1024px){
    .mod2-tab .mod-break-words, 
    .mod3-tab .mod-break-words {height:32px;line-height: 16px;padding:3px 0 2px;}

    .section-title {height:55px;line-height: 30px;text-align: center;font-size: 22px;font-weight: bold;position: relative;}
    .section-title h3 {display: inline-block;*display:inline;*zoom:1;position: relative;z-index: 2;font-style: italic;font-weight: normal;padding:0 25px;height:30px;margin-top:15px;background: #a575ff;border-radius: 15px;}
    .section-title .line {display: none;}
    .section-title .line i {display: none;}
}
</style>
