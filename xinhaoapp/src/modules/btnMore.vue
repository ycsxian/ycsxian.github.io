<template>
    <div v-show="!!componentData.buttonMore[0].text" class="container-more">
        <a :id="'act_marketing_tab_all_'+currentTabIndex+'_'+cityId" :style="{'background-color':componentData.config_pub.btn_bg}" href="javascript:void(0);" class="btn-view-more J-link-more" @click.stop.prevent="linkToMore()">
            <span v-if="componentData.buttonMore[0].type === 2">{{componentData.buttonMore[0].text}}<i class="ui-arrow-s btn-more-type2-addon"></i></span>
            <span v-else><i class="ui-arrow-s ui-arrow-l"></i>{{componentData.buttonMore[0].text}}<i class="ui-arrow-s ui-arrow-r"></i></span>
        </a>
    </div>
</template>

<script>
var $win = $(window);
var $body = $('body');

export default {
  name: 'btnMore',
  props: ['componentData','currentTabIndex','cityId'],

  data() {
    return {
      btn_more_url:''
    }
  },
  created() {
  },
  mounted() {
    this.$store.dispatch('createMetricAct','btnMore');
  },
  methods: {

    resetBtnMoreUrl(){
        var that = this;
        var urlBase64, urlh5, urlapp;
        var citymap = that.componentData.config_pub.citymap;
        var citymap_code = that.componentData.config_pub.citymap_code

        if ( !citymap || !citymap_code ) {
            citymap = '北京';
            citymap_code = 1;
        }

        if (that.componentData.setButtomMore == 1) {

            urlh5 = '//m.ctrip.com/webapp/ticket/dest/ct-' + encodeURIComponent(citymap) + '-' + citymap_code + '/s-tickets';
            this.btn_more_url = urlh5;

            if(pageInfo.isInApp) {
                urlBase64 = CtripTool.base64Encode('ticket/index.html#/dest/ct-' + encodeURIComponent(citymap) + '-' + citymap_code + '/s-tickets');

                urlapp = 'ctrip://wireless/h5?url='+ urlBase64 + '&type=1'
                this.btn_more_url = urlapp;
            }

        } else if (that.componentData.setButtomMore == 2) {

            urlh5 = '//m.ctrip.com/webapp/activity/dest/ct-' + encodeURIComponent(citymap) + '-' + citymap_code;
            this.btn_more_url = urlh5;

            if(pageInfo.isInApp) {
                urlBase64 = CtripTool.base64Encode('activity/index.html#/dest/ct-' + encodeURIComponent(citymap) + '-' + citymap_code);

                urlapp = 'ctrip://wireless/h5?url='+ urlBase64 + '&type=1';
                this.btn_more_url = urlapp;
            }

        } else if (that.componentData.setButtomMore == 3) {
            if (pageInfo.device == 'app') {
                this.btn_more_url = that.componentData.buttonMore[0].urlApp;
            } else if (pageInfo.device == 'online') {
                this.btn_more_url = that.componentData.buttonMore[0].urlOnline;
            } else {
                this.btn_more_url = that.componentData.buttonMore[0].urlH5;
            }
        }
    },

    linkToMore(){

        var device = pageInfo.device;
        if((LizardLite.app.vendor.is('CTRIP'))&&(!LizardLite.app.code.is('MASTER'))){
                device='h5';
            }//非主板app只能跳转http打头的链接
        var that = this;

        that.resetBtnMoreUrl();

        var goUrl = that.btn_more_url;
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
/*more*/

.container-more {text-align: center;padding:15px 0 5px;}
.btn-view-more {display:inline-block;line-height: 36px;text-align:center;color:#fff;font-size: 16px;border-radius: 18px;position: relative;}
.btn-view-more:hover {color: #fff;}
.btn-view-more span {position: relative;}
.btn-view-more .ui-arrow-s {;display:block;width:8px;height:8px;transform:rotate(-45deg);-webkit-transform:rotate(-45deg);}
.btn-view-more .ui-arrow-l {position:absolute;left: -20px;top:2px;border-right:2px solid rgba(255, 255, 255, 0.3);border-bottom:2px solid rgba(255, 255, 255, 0.3);}
.btn-view-more .ui-arrow-l:before {content: "";width: 8px;height: 8px;position:absolute;left: -10px;top:-10px;border-right:2px solid rgba(255, 255, 255, 0.65);border-bottom:2px solid rgba(255, 255, 255, 0.65);}
.btn-view-more .ui-arrow-l:after {content: "";width: 8px;height: 8px;position:absolute;left: -20px;top:-20px;border-right:2px solid white;border-bottom:2px solid white;}
.btn-view-more .ui-arrow-r {position:absolute;right:-20px;top:2px;border-left:2px solid rgba(255, 255, 255, 0.3);border-top:2px solid rgba(255, 255, 255, 0.3);}
.btn-view-more .ui-arrow-r:before {content: "";width: 8px;height: 8px;position:absolute;right:-10px;bottom:-10px;border-left:2px solid rgba(255, 255, 255, 0.65);border-top:2px solid rgba(255, 255, 255, 0.65);}
.btn-view-more .ui-arrow-r:after {content: "";width: 8px;height: 8px;position:absolute;right:-20px;bottom:-20px;border-left:2px solid white;border-top:2px solid white;}
.btn-view-more .arrow-one {position: absolute;top: 13px;right: 20px;border-right:2px solid white;border-bottom:2px solid white;}

.btn-more-type2-addon {width: 8px;height: 8px;position: absolute;right: -14px;top: 3px;border-right: 2px solid white;border-bottom: 2px solid white;}

@media screen and (max-width:1024px){

  .btn-view-more {display: block;line-height: 46px;text-align: center;color: #fff;font-size: 16px;border-radius: 8px;position: relative;margin: 0 9px;}
  .container-more {text-align: center;padding:15px 0;}
}

@media screen and (min-width:1025px){

  .btn-view-more {line-height: 44px;height: 44px;padding: 0 100px;border-radius: 22px;font-family: 'Hiragino Sans GB','Microsoft YaHei';font-size: 20px;}
  .btn-view-more .ui-arrow-s {top:7px;display: none\9;}
  .btn-view-more:hover {box-shadow:0 1px 10px rgba(0,0,0,0.35);}
  .btn-view-more .arrow-one {top: 17px;}
}

</style>

