<template>
<div id="J-city-tab">
    <div id="J-ctm-nav" v-show="configData.length > 1" :class="[navcolums5 ? 'nav-colums-5':'ctm-nav-outer',tabType === 2 ? 'margin-b-20' : 'margin-tb-5']">
        <div id="J-nav-wrapper" :class="[navcolums5 ? '':'ctm-nav' , tabType == 2 ? 'border-none':'']" @click="toggleTabs">
            <div v-if="public.modType !== 'mod2'" class="city-select-wrapper clearfix">
                <span class="J-nav-txt txt">{{navTxt}}</span>
                <div id="J-city-select-wrapper" class="city-select">
                    <div id="J-city-select-label" class="select" data-action="toggle">{{configData[cityIndex].provinceName}}</div>
                    <i :class="'arrow-down'"></i>
                </div>
            </div>
            <div v-if="tabType === 2" id="J-city-select" v-show="showCitySelectWrapper" :class="[public.modType == 'mod2' ? 'mod2-tab':'city-select-box']">
                <ul class="clearfix margin-fix padding-lr-0 padding-b-0 tab-type-2-border" :class="[public.modType == 'mod2' ? 'option-page-background flex-box':'']" style="height:39px;">
                    <li :id="'act_marketing_tab_'+index+'_'+cityId" :class="[public.modType == 'mod2' ? 'flex-box-1':'option-city-text']" v-for="(item,index) in configData" v-if="!configData[index].emptytab" @click="selectCity(index)" style="height:40px;"><span class="show" :class="[{'option-cityselect-background' : (cityIndex == index)},{'selected-tab-tweak' : (cityIndex == index)}]" style="padding-top:3px;padding-bottom:3px;">{{item.provinceName}}</span></li>
                </ul>
                <div class="ol-nav-shadow"></div>
            </div>
            <div v-else id="J-city-select" v-show="showCitySelectWrapper" :class="[public.modType == 'mod2' ? 'mod2-tab':'city-select-box']">
                <ul class="clearfix" :class="[public.modType == 'mod2' ? 'option-page-background flex-box':'']">
                    <li :class="[public.modType == 'mod2' ? 'flex-box-1':'option-city-text']" v-for="(item,index) in configData" v-if="!configData[index].emptytab" @click="selectCity(index)"><span class="show" :class="{'option-cityselect-background' : (cityIndex == index)}">{{item.provinceName}}</span></li>
                </ul>
                <div class="ol-nav-shadow"></div>
            </div>
        </div>
    </div>

    <div v-if="public.modType !== 'mod2'" v-show="showCitySelectWrapper" id="J-mask-city" class="mod-mask"></div>
</div>
</template>

<script>
export default {
  name: 'cityselecttab',
  props:['navTxt','configData','cityIndex','public','tabType','cityId'],
  data () {
    return {
      msg: 'this is test for cityselecttab.vue!!',
      showCitySelectWrapper:false,
      navcolums5:false,

    }
  },
  created(){
    if(this.public.modType == 'mod2' || this.public.pageInfo_device == "online"){
        this.showCitySelectWrapper = true;
    }

    if(this.configData.length > 5 && this.public.modType == 'mod2' && this.public.pageInfo_device !== "online") {
        // 模板2若城市tab超过5个，则一行显示5个
        this.navcolums5 = true;
    }
  },
  mounted(){
    var that = this;

    that.navbarFloat();

    if(this.public.modType !== "mod2" && this.public.pageInfo_device !== "online"){
        document.getElementById("J-city-tab").addEventListener('touchmove', function(e) {
            // e.preventDefault();
        });
    }

  },
  methods:{
    // 展开or收起城市下拉
    toggleTabs(){
        if(this.public.modType !== "mod2" && this.public.pageInfo_device !== "online"){
            this.showCitySelectWrapper = this.showCitySelectWrapper ? false : true;
        }

    },
    selectCity(index){

        this.$emit('selectCity', index);
       // } //对于什么资源也没有，进不去viewspot的情况，跳回第一个tab

    },
    navbarFloat() {
        var that = this;
        var $main = $('body');
        var $window = $(window);
        var $navFloat = $('#J-nav-wrapper');
        var $warpper = $navFloat.parent();
        var headerHeight = $('#headerview').height();

        // 宽屏不做悬浮
        if(this.public.pageInfo_device == "online"){
            return false;
        }

        // 模板1、3悬浮。模板2城市选择栏超过3行则不浮动
        if ($main.hasClass("mod1") || $main.hasClass("mod3") || ( $main.hasClass("mod2") && that.configData.length <= 15)) {
            $window.on('scroll.sticky', function () {
                requestAnimationFrame(function(){
                    var top = $window.scrollTop();
                    var navBarOffsetTop = $warpper.offset().top;
                    var $curSubTab = $('.J-sub-tab');
                    if (top > navBarOffsetTop) {
                        $navFloat.addClass('scroll-sticky').css('top',headerHeight);
                        // 模板3子tab悬停
                        if($main.hasClass("mod3")){
                            $curSubTab.addClass('scroll-sticky').css('top',$navFloat.height() + headerHeight);
                        }
                    } else {
                        $navFloat.removeClass('scroll-sticky').removeAttr('style');
                        if($main.hasClass("mod3")){
                            $curSubTab.removeClass('scroll-sticky').removeAttr('style');
                        }
                    }

                });

            });
        }
    },
  }
}
</script>

<style>
/*nav*/
.ctm-nav {width: 100%;height:40px;position: relative;left: 0;background:#7932ff;}
.border-none {border:none !important;height:32px;}

/*mask*/
.mod-mask{position:fixed; top:0; left: 0; width:100%; height: 100%; background-color: rgba(0,0,0,0.4); z-index: 5;}

/*city select*/
.city-select-wrapper {height:40px;line-height: 40px; -webkit-touch-callout:none ;-webkit-user-select:none ;}
.city-select-wrapper .txt {font-size: 14px;color:#fff;margin-left:10px;}
.city-select{float: right;width: 150px;height: 28px;position: relative;z-index: 10;margin-right: 10px;}
.city-select .select{width: 124px;font-size: 14px;border: none;color:#fff;text-align: right;}
.city-select .arrow-down {width:6px;height:6px;position: absolute;right:5px;bottom:5px;border-width:2px;border-color:transparent #fff #fff transparent;border-style:solid;transform:rotate(45deg);-webkit-transform:rotate(45deg);transition: transform 0.3s;}
.city-select .arrow-up {transform:rotate(-135deg);-webkit-transform:rotate(-135deg);bottom: 0;transition: transform 0.3s;}
.city-select-box{width: 100%;position: absolute;top: 40px;left: 0;overflow: hidden;-webkit-touch-callout:none;-webkit-user-select:none;background: #fff;box-shadow: 0 3px 8px rgba(0,0,0,0.1);}
.city-select-box ul {margin:0 5px;margin-bottom: -1px;}
.city-select-box li{float: left;width: 20%;text-align: center;font-size: 14px;line-height: 45px;cursor: pointer;border-bottom:1px solid #D0D0D0;box-sizing:border-box;margin-bottom: -1px;}
.city-select-box li span {display: block;}
/*.city-select-box li .option-cityselect-background {color: #fff;}*/

/*mod2, mod3*/
.option-tab-background li {cursor: pointer;}

.mod3 .option-tab-current-background span,.mod2 .option-cityselect-background  {border-width: 0 ;font-weight: bold;}
@media screen and (max-width:1024px){
    .mod1 .ctm-nav-outer,.mod3 .ctm-nav-outer{height: 41px;}
    .mod1 .ctm-nav,.mod3 .ctm-nav {border-bottom: 1px solid #ccc;}

    .city-select-box li {padding: 5px;line-height: 35px;white-space: nowrap;}

    /*mod2, mod3*/
    .mod3-tab {height: 44px;display: none;}
    .mod3 .mod3-tab {display: block;}
    .mod3-tab ul {padding: 2px 4px 7px;}
    .mod3-tab li {line-height:28px;text-align: center;margin-left:-1px;overflow: hidden;padding: 5px 2px 0;box-sizing: border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;}
    .mod3-tab li span {display: block;border-radius: 5px;border: 1px solid;overflow: hidden;height: 28px;}

    .mod2-tab ul {padding: 2px 4px 7px;}
    .mod2-tab li {line-height:33px;text-align: center;border-left:1px solid rgba(255,255,255,0.1);margin-left:-1px;overflow: hidden;padding: 5px 2px 0;box-sizing: border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;}
    .mod2-tab li span {border-radius: 5px;border: 1px solid;overflow: hidden;height: 28px;line-height: 28px;}
    .nav-colums-5 .mod2-tab ul {display: block;}
    .nav-colums-5 .mod2-tab li {width: 20%;float: left;-webkit-box-flex:0.0;-moz-box-flex:0.0;-webkit-flex:0.0;flex:0.0; -ms-flex:0.0;}
    .mod3 .option-tab-current-background span,.mod2 .option-cityselect-background  {height: 30px;line-height: 30px;}

    /* 标签状tab样式 */
    .margin-fix {margin-top:-10px;}
    .margin-tb-5 {margin-top:5px;margin-bottom:5px;}
    .margin-b-20 {margin-bottom:20px;}
    .padding-lr-0 {padding-left:0 !important;padding-right:0 !important;}
    .padding-b-0 {padding-bottom:0 !important;}
    .tab-type-2-border {border-bottom:1px solid transparent}
    .tab-type-2-border span {border-radius: 5px 5px 0 0 !important; border-bottom: 0 !important;}
    .selected-tab-tweak {height:28px !important;line-height:28px !important;border-width:1px !important;}

    /*模板二城市tab浮动*/
    .scroll-sticky {position: fixed;z-index: 4;left: 0;top: 0;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;width: 100%;}
    .ctm-nav {z-index: 1000;}
}

@media screen and (min-width:1025px){
    .ctm-nav {top: -15px;margin-bottom: -15px;height:auto;background:transparent;}
    .city-select-box {display: block;position: static;height: 38px;line-height: 38px;font-family: 'Hiragino Sans GB','Microsoft YaHei';width: 680px;margin:0 auto;height:auto;background:#fff;box-shadow:none;}
    .city-select-wrapper {display: none;}
    .city-select-box ul {margin: 5px 5px -1px;overflow: hidden;}
    .city-select-box li {width: 90px;margin:0 0 5px -1px;font-size: 14px;height: 40px;padding: 0;border:none;color: #666;}
    .city-select-box li span {padding: 7px 0;height: 26px;line-height: 26px;border-left:1px solid #D0D0D0;}
    .city-select-box .option-cityselect-background {font-size: 16px;position: relative;z-index: 1;}
    .city-select-box .option-cityselect-background span {border-left-width: 0;}
    .ol-nav-shadow {height: 15px;background:url(../assets/images/sprite-online.png) no-repeat 0 -110px;overflow: hidden;}

    .mod-mask{display: none;}

    .mod2-tab,.mod3-tab {width: 660px;margin: 0 auto 30px;}

    .mod2-tab {margin: 30px auto}

    .mod2-tab ul {width: 100%;font-family:'Microsoft YaHei';font-size: 20px;height: 47px;border-bottom: 1px solid #BEC4C7;}
    .mod2-tab li {height:47px;*height: 46px;line-height:47px;*line-height: 46px;text-align: center;color:#333;border:1px solid #BEC4C7;border-bottom: 0 solid white;border-top-right-radius: 10px;border-top-left-radius: 10px;background-clip: padding-box;-webkit-background-clip: padding-box;overflow: hidden;box-sizing: border-box;margin-left: 10px;}

    .mod3-tab ul {width: 100%;font-family:'Microsoft YaHei';font-size: 20px;height: 47px;border-bottom: 1px solid #D7DDE1;background: transparent;}
    .mod3-tab li {height:47px;*height: 46px;line-height:47px;*line-height: 46px;text-align: center;color:#333;border:1px solid #D7DDE1;border-bottom: 0 solid white;border-top-right-radius: 10px;border-top-left-radius: 10px;background-clip: padding-box;-webkit-background-clip: padding-box;overflow: hidden;box-sizing: border-box;margin-left: 10px;}
    .mod3-tab li:first-child {margin-left: 0px;}
    .mod3-tab li span {display: block;background: white !important;}
    .margin-dis{margin-left: 0 !important;}
    /*mod3 tab选项宽度*/
/*    .tab-count2 li {width:325px;float:left;}
    .tab-count3 li {width:213px;float:left;}
    .tab-count4 li {width:157px;float:left;}
    .tab-count5 li {width:124px;float:left;}*/

    .city-select-box {width: 1020px;}
    .mod2-tab,
    .mod3-tab {width: 1000px;margin: 0 auto 30px;}

    .mod2-tab ul>:first-child {margin-left: 0;}

    .mod2-tab {margin: 30px auto;}
    /*mod2,mod3 tab选项宽度*/
    .tab-count2 li {width:495px;float:left;*width: 493px;}
    .tab-count3 li {width:326px;float:left;*width: 324px;}
    .tab-count4 li {width:242px;float:left;*width: 240px;}
    .tab-count5 li {width:192px;float:left;*width: 190px;}
}

</style>