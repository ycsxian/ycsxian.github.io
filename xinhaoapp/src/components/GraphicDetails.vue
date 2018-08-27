<template>
    <div v-if="!!this.graphicDetails.panelTitle || !!this.graphicDetails.editContent">
        <subtitle-component :subTitleInfor="subTitleInfor"></subtitle-component>
        <div class="J-details-box details-box details-bg margin-0" :style="styleObject.box" :class="{ 'graphic-detail-special-edition' : tabType }">
          <!-- <div class="desc details-desc-color" :class="status=='fold'?'fold':''" v-html="this.graphicDetails.editContent"></div> -->
          <div class="desc details-desc-color" v-html="this.graphicDetails.editContent"></div>
          <!-- <div class="arrow details-arrow-bg" :class="status=='fold'?'down':'up'" @click="changeStatus">
            <svg version="1.1" id="arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
               width="60px" height="30px" viewBox="0 0 120 60" enable-background="new 0 0 120 60" xml:space="preserve">
              <g>
                <polygon :fill="configCss.c11" points="120,35.25 60,16.5 0,35.25 0,28.5 60,9.75 120,28.5   "/>
                <polygon opacity="0.45" :fill="configCss.c11" points="120,50.25 60,31.5 0,50.25 0,43.5 60,24.75 120,43.5   "/>
              </g>
            </svg>
          </div> -->
          <!-- <div class="mask details-mask-bg" :style="styleObject.mask" v-show="status == 'fold'"></div> -->
        </div>

        <div v-html="currentStyle"></div>
    </div>
</template>

<script>
import componentSubTitle from '../components/SubTitle'

export default {
  name: 'graphicdetails',
  props:['graphicDetails','configCss','tabType'],
  data () {
    return {
      msg: 'this is test for graphicdetails.vue!!',
      status:this.graphicDetails.showType,
      styleObject:{
        bg:{},
        // bgGradient:{},
        box:{},
        // mask:{}
      },
      subTitleInfor:{
        templateType:0,
        sectionTitle:true,
        navTitle:this.graphicDetails.panelTitle,
      },
      currentStyle:''
    }
  },
  components: {
      'subtitle-component':componentSubTitle,
  },
  created(){

    this.bg = {
      background: this.configCss.c8,

    }

    if(this.tabType === 2) {
      this.bg = {
        background: this.configCss.mod2.m2_2,
      }
    }

    // this.bgGradient = {
    //   background: this.configCss.c8,
    //   background: '-moz-linear-gradient(top, ' + this.configCss.c8 + ' 0%, ' + this.configCss.c1_1 + ' 70%)',
    //   background: '-webkit-linear-gradient(top, ' + this.configCss.c8 + ' 0%,' + this.configCss.c1_1 + ' 70%)',
    //   background: 'linear-gradient(to bottom, ' + this.configCss.c8 + ' 0%,' + this.configCss.c1_1 + ' 70%)',
    // };

    //自定义图文模块背景色
    // this.styleObject.box = this.status=='open'? this.bg : this.bgGradient;
    this.styleObject.box = this.bg;

    //自定义图文折叠背景渐变颜色
    // this.styleObject.mask = {
    //   background: 'rgba(255, 255, 255, 0)',
    //   background: '-moz-linear-gradient(top, rgba(255, 255, 255, 0) 0%, ' + this.configCss.c1_1 + ' 70%)',
    //   background: '-webkit-linear-gradient(top, rgba(255, 255, 255, 0) 0%,' + this.configCss.c1_1 + ' 70%)',
    //   background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%,' + this.configCss.c1_1 + ' 70%)',
    // };

    //自定义图文标题、正文文字、箭头颜色
    var mainTmpl ='.details-desc-color {color:'+this.configCss.c9+';}\n\
.details-desc-color h1, .details-desc-color h2,{color:'+this.configCss.c10+';}';

    this.currentStyle = '<style>' + mainTmpl + '</style>';

    

  },
  mounted() {
    this.bindOtherEvents();
    this.additionStyle();
  },
  methods:{
    bindOtherEvents() {
      var that = this;
      // $('.J-details-box').on('click', 'a', function(e) {
      $('.J-details-box a').unbind('click').click(function (e) {
                e.preventDefault();
                var device = pageInfo.device;
                if ((LizardLite.app.vendor.is('CTRIP')) && (!LizardLite.app.code.is('MASTER'))) {
                    device = 'h5';
                } //非主板app只能跳转http打头的链接
                var $this = $(this);

                // if ($this.hasClass("J-disable-open-url")) {
                //     return false;
                // }


                // var goUrl = $this.data('url{0}'.format(device));
                var goUrl = $this[0].href;

                var targetMode = (/ctrip:/.test(goUrl) === true) ? 1 : 2;

                goUrl = goUrl || $this.data('urlh5') || $this.attr('href');

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
                if (goUrl.indexOf('ctrip://') === -1 && goUrl.indexOf('http://') === -1 && goUrl.indexOf('https://') === -1) {
                    return false;
                }
                if (device == 'app') {
                    CtripUtil.app_open_url(goUrl, targetMode);
                } else {
                    window.location.href = goUrl;
                }

                return false;

            });


    },
    additionStyle(){
      $('.J-panel').children().children().eq(4).find('img').addClass('xinhao-title');
      $('.pageGraphic-container').find('.desc').find('img').eq(0).addClass('xinhao-title');

       
    }
    // changeStatus(){
    //   this.status = this.status=='open'?'fold':'open';
    //   this.styleObject.box = this.status=='open'? this.bg : this.bgGradient;
    // },
  }
}
</script>

<style>
.details-box {margin: 10px 7px;position: relative;}
.margin-0 {margin:0;}
.mask {position: absolute;top: 0;left: 0;right: 0;bottom: 0;z-index: 2;}
.desc {padding: 12px 15px;padding-bottom:0;}
.graphic-detail-special-edition .desc {padding-top:0;padding-bottom:0;}
.desc h1, .desc h2 {font-size: 18px;font-weight: bold;}
.desc p {font-size: 14px;line-height: 20px;}
.desc img {display:block;margin: 10px auto;width: 100%;min-height: 1px;}
.xinhao-title{width:3.75rem!important;margin-left:-0.15rem!important;}
.fold {height: 80px;overflow: hidden;}

.arrow {position: relative;padding-top: 10px;height: 30px;margin-bottom: 10px;text-align: center;z-index: 5;}
/*.arrow .i-l {position: relative;display: inline-block;background: #fff;width: 40px;height: 4px;transform: skewY(-18deg);
        -ms-transform:skewY(-18deg);-moz-transform:skewY(-18deg);-webkit-transform:skewY(-18deg);-o-transform:skewY(-18deg);}
.arrow .i-r {position: relative;display: inline-block;background: #fff;width: 40px;height: 4px;transform: skewY(18deg);
        -ms-transform:skewY(18deg);-moz-transform:skewY(18deg);-webkit-transform:skewY(18deg);-o-transform:skewY(18deg);}
.arrow .i-l:after {content: "";width: 0;height: 0;position: absolute;top: 9px;left: 0;background: rgba(255, 255, 255, 0.4);width: 40px;height: 4px;opacity: 0.5;}
.arrow .i-r:after {content: "";width: 0;height: 0;position: absolute;top: 9px;left: 0;background: rgba(255, 255, 255, 0.4);width: 40px;height: 4px;opacity: 0.5;}*/

.down {margin-bottom: 20px;padding-top: 10px;}
.down svg {transform: rotate(180deg);
        -ms-transform:rotate(180deg);-moz-transform:rotate(180deg);-webkit-transform:rotate(180deg);-o-transform:rotate(180deg);}
/*.down .i-l {transform: skewY(18deg);-ms-transform:skewY(18deg);-moz-transform:skewY(18deg);-webkit-transform:skewY(18deg);-o-transform:skewY(18deg);}
.down .i-r{transform: skewY(-18deg);-ms-transform:skewY(-18deg);-moz-transform:skewY(-18deg);-webkit-transform:skewY(-18deg);-o-transform:skewY(-18deg);}
.down .i-l:after {top: -9px;}
.down .i-r:after {top: -9px;}*/
.graphic-detail-special-edition h1 a {font-size: 14px;}
.graphic-detail-special-edition .desc h1 {font-size: 16px;margin-bottom: -6px;}
.graphic-detail-special-edition .desc h2 {font-size: 14px;}

.ql-align-left {text-align: left;}
.ql-align-center {text-align: center;}
.ql-align-right {text-align: right;}
</style>
