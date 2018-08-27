<template>
<div :class="'coupon-mod'+config_coupon.model">
    <img :src="config_coupon.imgurl.app" class="img-auto" />
    <template v-if="config_coupon.model == 1">
        <a href="javascript:void(0);" class="btn-get-coupon J-get-coupon" :class="'btn-status-'+ couponInfor.btn_status" @click="getCoupon">{{couponInfor.btn_text}}</a>  
        <a href="javascript:void(0);" v-if="!!config_coupon.editContent" class="rules" @click="showRules">活动规则&gt;&gt;</a>
    </template>

    <template v-else-if="config_coupon.model == 2">
        <a href="javascript:void(0);" v-if="!!config_coupon.editContent" class="rules" @click="showRules">活动规则</a>
        <a href="javascript:void(0);" v-if="!!config_coupon.scid" class="btn-get-coupon J-get-coupon" :class="'btn-status-'+ couponInfor.btn_status" @click="getCoupon">{{couponInfor.btn_text}}</a>  
    </template>

    <template v-else>
        <a href="javascript:void(0);" class="btn-get-coupon J-get-coupon" :class="'btn-status-'+ couponInfor.btn_status" @click="getCoupon">{{couponInfor.btn_text}}</a>
        <article v-if="!!config_coupon.editContent" class="ctm-article">
            <h4><span>活动规则</span></h4>
            <div class="J-rules-content rules-content" v-html="config_coupon.editContent"></div> 
        </article>  
    </template>
      
</div>
</template>


<script>

export default {
  name: 'couponmodel',
  props:['config_coupon','couponInfor'],
  data () {
    return {
        msg: 'this is test for couponmodel.vue!!',
    }
  },
  methods:{
    getCoupon(){
        this.$emit('getCoupon');
    },
    showRules(){
        this.$emit('showRules');
    },
  }
}
</script>

<style>
.ctm-article .rules-content p {padding-bottom: 0.05rem;line-height: 0.19rem;text-align: left;font-size: 0.12rem;}
</style>

<style scoped>
.img-auto {display: block;}

.coupon-mod1 {position: relative;}
.coupon-mod1 .btn-get-coupon {position: absolute;top: 0.29rem;right: 0.25rem;width: 1rem;height: 0.35rem;line-height: 0.35rem;font-size: 0.18rem;font-weight: bold;color: #fff;background:#EA4646;text-align: center;border:1px solid transparent;}
.coupon-mod1 .btn-status-has-drawn,.coupon-mod1 .btn-status-drawn-empty{background: #AAAAAA;color: #fff;border:1px solid #C8C8C8;}
.coupon-mod1 .btn-status-sys-error {}
.coupon-mod1 .rules {position: absolute;left: 0.1rem;bottom: 0.09rem;height: 0.15rem;line-height: 0.15rem;font-size:0.14rem;}

.coupon-mod2 .btn-get-coupon {position: absolute;top: 3.35rem;left: 0.92rem;width: 1.87rem;height: 0.42rem;line-height:0.42rem;background:#EA4646;font-size: 0.23rem;color: #fff;font-weight: bold;text-align: center;border:2px solid #FFE132;}
.coupon-mod2 .btn-status-has-drawn,.coupon-mod2 .btn-status-drawn-empty{background: #AAAAAA;color: #fff;border:2px solid #C8C8C8;}
.coupon-mod2 .btn-status-sys-error {}
.coupon-mod2 .rules {position: absolute;top: 0.15rem;right: 0.15rem;width: 0.75rem;height: 0.32rem;line-height: 0.32rem;font-size: 0.15rem;color:#fff;background: #000000;text-align: center;z-index: 5;border-radius: 5px;opacity: 0.5;}


.coupon-mod3 .btn-get-coupon {position: absolute;top: 3.02rem;left: 0.92rem;width: 1.86rem;height: 0.42rem;line-height:0.42rem;background:#EA4646;font-size: 0.23rem;color: #fff;font-weight: bold;text-align: center;border:2px solid #FFE132;}
.coupon-mod3 .btn-status-has-drawn,.coupon-mod2 .btn-status-drawn-empty{background: #AAAAAA;color: #fff;border:2px solid #C8C8C8;}
.coupon-mod3 .btn-status-sys-error {}


.ctm-article {padding: 0.1rem 0.35rem 0.25rem;color: #fff;}
.ctm-article h4 {position: relative;margin-bottom: 0.19rem;}  
.ctm-article h4:before {content: "";position: absolute;top: 9px;left: 0;width: 6px;height: 6px;border-radius: 100%;background: #1264FF;}
.ctm-article h4:after {content: "";position: absolute;top: 9px;right: 0;width: 6px;height: 6px;border-radius: 100%;background: #1264FF;}
.ctm-article span {display: block;margin: 0 auto;width: 1.2rem;height: 0.25rem;line-height: 0.25rem;font-size: 0.17rem;font-style: italic;text-align: center;background: #1264FF;border-radius: 0.25rem;}
.ctm-article span:after {content: "";position: absolute;top: 12px;left:0;right: 0;height: 1px;background: #1264FF;z-index: -1;}
.ctm-article .rules-content {padding: 0.03rem;}

@media screen and (min-width:1025px){
    .coupon-mod1,.coupon-mod2,.coupon-mod3 {display: none;}
}

</style>