<template>
    <div class="ctm-footer container clearfix">
        <div class="section-title">
            <h3>其他精彩专题</h3>
            <div class="line"></div>
        </div>
        <a v-for="(item, index) in componentData" href="javascript:void(0);" >
            <img :src="item.image" class="img-auto" @click="footerLinkJump(item);"/>
        </a>
    </div>
</template>

<script>
var $win = $(window);
var $body = $('body');

export default {
  name: 'footerLink',
  props: ['componentData'],

  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
    this.$store.dispatch('createMetricAct','footerLink');
  },
  methods: {

    footerLinkJump(item){
        var device = pageInfo.device;
        if((LizardLite.app.vendor.is('CTRIP'))&&(!LizardLite.app.code.is('MASTER'))){
                device='h5';
            }//非主板app只能跳转http打头的链接
        var that = this;
        var goUrl;

        if(device == 'h5') {
            goUrl = item.urlH5;
        } else if(device == 'app') {
            goUrl = item.urlApp;
        } else {
            goUrl = item.urlOnline;
        }

        var targetMode = (/ctrip:/.test(goUrl) === true) ? 1 : 2;

        if (device == 'h5') {
            if (goUrl.indexOf('?') > -1) {
                goUrl += '&from=' + encodeURIComponent(window.location.href);
            } else {
                goUrl += '?from=' + encodeURIComponent(window.location.href);
            }
        }

        // 若url去除了协议头，则按照当前url重新加上
        if (goUrl.indexOf('//') === 0) {
            var currentUrl = window.location.href;
            if (currentUrl.indexOf('http:') === 0) {
                goUrl = 'http:' + goUrl;
            } else if (currentUrl.indexOf('https:') === 0) {
                goUrl = 'https:' + goUrl;
            }
        }
        if ( goUrl.indexOf('ctrip://') === -1 && goUrl.indexOf('http://') === -1 && goUrl.indexOf('https://') === -1 ) {
            return false;
        }
        if (device == 'app') {
            CtripUtil.app_open_url(goUrl, targetMode);
        } else {
           window.location.href=goUrl;
        }
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ctm-footer {padding:10px;box-sizing: border-box;}
.ctm-footer a {margin-bottom:10px;display: block;}
.ctm-footer .section-title {display: none;}
@media screen and (min-width:1025px){
    .ctm-footer {background: #F0F2F3;width: 2000px;margin-left: -490px;padding-left: 490px;padding-right: 490px;}
    .ctm-footer .section-title {display: block;width: 420px;padding: 0;}
    .ctm-footer .section-title h3 {background: #f0f2f3;font-size: 20px;padding: 0 25px;line-height: 42px;}
    .ctm-footer .section-title .line {width: 100%;left: 0;top: 20px;border-bottom-style: solid;}
}
</style>
