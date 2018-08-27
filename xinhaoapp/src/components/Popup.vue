<template>
<div class="popLayer">
    <!-- 规则弹层 -->
    <div v-if="popInfor.type == 'rules'" v-show="popInfor.status" class="pop-rules" key="rules" @click="hidePopupBox">
        <h4><span>活动规则</span></h4>
        <div class="J-rules-content rules-content" v-html="popInfor.popContent"></div> 
    </div>

    <div v-else v-show="popInfor.status" id="J-popup" class="ui-popup" key="commmon" @click="hidePopupBox">

        <!-- 通用弹层 -->
        <div v-if="popInfor.type == 'common'" class="pop-common">
          <div class="content" v-html="popInfor.popContent"></div>
        </div>
        

        <!-- 成功弹层 -->
        <div v-if="popInfor.type == 'success'" class="pop-common">
            <div class="content" v-html="popInfor.popContent"></div>
        </div>
        
    </div>

    <div v-show="popInfor.status" class="pop-mask J-close-pop" @click="hidePopupBox"></div>
</div>
</template>

<script>

export default {
  name: 'popup',
  props:['popInfor','value'],
  data () {
    return {
      msg: 'this is test for popup.vue!!',
      poptype:'',
      styleObject: {

      },
    }
  },
  created(){

  },
  updated(){
    if(this.popInfor.status){
      this.loadPopupBox();
    }
  },
  methods:{

       // 显示弹层
      loadPopupBox:function(){

          var that = this;
          var $overlay = $('#J-popup');
          var windowHeight = $(window).height();
          var offsetTop;

          $('.J-rules-content').css('max-height',windowHeight-200)

          offsetTop = (windowHeight - $overlay.height())/2;

          $overlay.css('top',offsetTop);

          $('body').css({'overflow':'hidden','height':windowHeight});
          // $('#app').css({'overflow':'hidden','height':windowHeight});
          $('.main-body').css({'overflow':'hidden','height':windowHeight});

      },

      hidePopupBox:function(){
          $('body').removeAttr('style');
          // $('#app').css({'overflow':'auto','height':'auto'});
          $('.main-body').removeAttr('style');
          this.$emit('input', false);
      },
  }
}
</script>

<style>
.pop-rules .rules-content p {padding-bottom: 0.05rem;line-height: 0.19rem;text-align: left;font-size: 0.12rem;}
</style>

<style scoped>
/*mask*/
.pop-mask{position:fixed; top:0; left: 0; width:100%; height: 100%; background-color: transparent; z-index: 1005;}
 

.ui-popup {left:0;top:0;position: fixed;width: 100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;z-index: 1001;color: #fff;}

.pop-rules {position: absolute;top:0; left: 0;bottom:0;right: 0;padding: 0.5rem 0.35rem 0.15rem 0.36rem;background: rgba(0,0,0,0.8);color: #fff;z-index: 1005;}
.pop-rules h4 {position: relative;margin-bottom: 0.19rem;}  
.pop-rules h4:before {content: "";position: absolute;top: 9px;left: 0;width: 6px;height: 6px;border-radius: 100%;background: #1264FF;}
.pop-rules h4:after {content: "";position: absolute;top: 9px;right: 0;width: 6px;height: 6px;border-radius: 100%;background: #1264FF;}
.pop-rules span {display: block;margin: 0 auto;width: 1.2rem;height: 0.25rem;line-height: 0.25rem;font-size: 0.17rem;font-style: italic;text-align: center;background: #1264FF;border-radius: 0.25rem;}
.pop-rules span:after {content: "";position: absolute;top: 12px;left:0;right: 0;height: 1px;background: #1264FF;z-index: -1;}
.pop-rules .rules-content {overflow: auto;padding: 0.03rem;}


.pop-common {position: relative;margin: 0 auto;width: 2.57rem;min-height: 0.25rem;padding:0.3rem 0;background: rgba(0,0,0,0.8);font-size: 0.15rem;line-height: 0.25rem;border-radius: 5px;text-align: center;}

</style>
