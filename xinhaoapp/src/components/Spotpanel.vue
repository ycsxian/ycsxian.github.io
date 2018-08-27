<template>
    <div :class="[numlist.editContent ? 'margin-bottom-10' : '']" style="overflow:hidden">
        <template v-for="(item,index) in numlist.ids">
        <div v-show="item.view" class="item-mod J-item-mod" :class="[!!item.sid ? 'item-mod-ticket' : 'item-mod-ttd' , numlist.labelType==4 ? 'padding-top-3' : '']">
            <div class="flex-box ">
                <div class="mod-img-box">
                    <img class="item-img J-item-img" :src="item.imgurl" />
                    <div v-if="item.showLabel" class="J-mod-label">
                        <div v-if="numlist.labelType==1 && !!item.label" class="mod-label mod-label-color-orange" :class="[!!item.label && item.label.length <6 ? 'mod-label-short' : 'mod-label-long']">{{item.label}}</div>
                        <div v-else-if="numlist.labelType==2" class="mod-label mod-label-flag mod-label-discount"><span class="J-mod-label-discount percent">{{item.discount}}</span>折<i></i></div>
                        <div v-else-if="numlist.labelType==3">

                            <div v-if="item.offprice.length>=3" class="mod-label mod-label-money mod-more-money mod-label-flag-more"><span class="lijian">省</span><span class="money J-mod-label-money mod-label-money-more"><span class="mod-label-money-rmb">&yen</span>{{item.offprice}}</span></div>

                            <div v-else class="mod-label mod-label-money mod-label-money-little"><span class="lijian">省</span><span class="money J-mod-label-money" :class="[item.offprice.length<3 ? 'mod-label-money-two':'']">{{item.offprice}}<span class="mod-label-money-yuan">元</span></span></div>

                        </div>
                        <div v-else-if="numlist.labelType==4" class="mod-label" :class="[!!item.label && item.label.length <6 ? 'mod-label-short' : 'mod-label-long' , item.type === 'tic' ? 'mod-label-color-green' : 'mod-label-color-orange']" style="top:-3px;">{{item.categoryname}}<div class="mod-label-two-ends" :class="[item.type === 'tic' ? 'mod-label-two-ends-color-green' : 'mod-label-two-ends-color-orange']"></div></div>
                    </div>
                </div>
                <div class="mod-desc flex-box-1">
                    <div class="hd">
                        <h4 class="mod-title">{{item.name}}</h4>
                        <div class="mod-info">
                            <span class="mod-city option-city-label-border-color" :class="{'soldout-mod-city':item.viewsoldout}" :style="item.showModcity">
                                <i class="ui-ico-city option-city-label-border-color"></i><span class="J-city-name option-city-label-bg-color">{{item.cityname}}</span>
                            </span>
                            <span v-if="numlist.modType !== 'routine3'" class="define-desc J-desc">{{item.desc}}</span>
                            <span v-if="numlist.modType === 'routine3'" class="cmtscore J-cmtscore">{{item.cmtscore}}<span style="font-size: 12px;">分</span></span>
                            <span v-if="numlist.modType === 'routine3'" v-show="item.svol !== 0" class="svol J-svol" style="margin-left: 8px;">月销:{{item.svol}}份</span>
                        </div>
                        <div v-if="!!item.cashback" class="J-cashback"><div class="cashback"><span>{{item.cashback}}</span></div></div>
                    </div>
                    <template v-if="!item.viewsoldout">
                    <div class="bd clearfix">
                        <div class="mod-price-now">
                            <span v-if="!!numlist.priceLabelText" class="mod-price-label option-label-price-color">{{numlist.priceLabelText}}:</span>
                            <span class="yuan option-price-color arial">&yen;</span><span class="mod-price option-price-color arial J-price-now">{{item.price}}</span><span v-if="!item.priceBeginLabel" class="txt option-label-price-color J-price-begin-label" :class="[numlist.modType === 'routine3' ? 'option-label-price-grey' : '']">起</span>
                        </div>
                        <div class="mod-price-market" v-if="(!!item.mprice) && (numlist.modType !== 'routine3')">
                            <span class="arial">&yen</span><span class="price-market arial">{{item.mprice}}</span>
                        </div>
                    </div>
                    <div v-if="!!item.showButtonBuy && device !== 'online'" class="viewpoint-status-buy p-status option-button-bg-color J-status">立即抢购</div>
                    </template>
                    <template v-else>
                    <div class="ico-item-soldout J-link-soldout">{{item.soldouttext}}</div>
                    </template>
                </div>
            </div>
            <a href="javascript:void(0);" :id="'act_marketing_'+currentTabIndex+'_'+index+'_'+cityId" class="item-link" @click.stop.prevent="linkToDetails(item.viewurl)"></a>
        </div>
        </template>
    </div>

</template>


<script>

export default {
  name: 'spotpanel',
  props:['numlist','currentTabIndex','cityId'],
  data () {
    return {
      msg: 'this is test for spotpanel.vue!!',
      device:''
    }
  },
  created(){
    this.device = pageInfo.device;
  },
  methods:{
    linkToDetails(url){
        var device = pageInfo.device;
        if((LizardLite.app.vendor.is('CTRIP'))&&(!LizardLite.app.code.is('MASTER'))){
            device='h5';
        }//非主板app只能跳转http打头的链接

        var goUrl = url;
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

<style src="../css-options/productlist.css"></style>
