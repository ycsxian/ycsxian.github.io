<template>
<div>
    <div id="J-insertStyle" v-html="currentStyle"></div>

    <city-tab-component :navTxt="configPro.navTxt" :configData="configData" :cityIndex="currentTabIndex" :public="public" :tabType="componentData.tabType" :cityId="componentData.cityId" @selectCity="selectTab"></city-tab-component>

    <div id="J-main-wrapper" class="main-wrapper container">

        <div class="J-panel">
            <template v-if="public.modType == 'mod3'">

                <subtitle-tab-component :currentTabProducts="currentTabProducts" :mod3tabIndex="mod3tabIndex" @selectsubTab="selectTriggerTab"></subtitle-tab-component>

                <viewspot-component :currentTabProducts="currentTabProducts" :tabInfor="tabInfor" :currentTabIndex="currentTabIndex" :mod3tabIndex="mod3tabIndex" :public="public" :componentData="componentData" :tabType="componentData.tabType" :cityId="componentData.cityId" ref="viewspot" @selectCity="selectTab"></viewspot-component>

            </template>

            <template v-else>
                <viewspot-component ref="viewspot"  :currentTabProducts="currentTabProducts" :tabInfor="tabInfor" :currentTabIndex="currentTabIndex" :public="public" :componentData="componentData" :tabType="componentData.tabType" :cityId="componentData.cityId" @selectCity="selectTab"></viewspot-component>
            </template>

        </div>
    </div>
    <div id="J-empty-pop">很抱歉，该城市下暂无产品</br>将为您自动跳转至其他省市</div>
    <div id="J-empty-mask"></div>
</div>
</template>


<script>

var $win = $(window);
var $body = $('body');
var localUrl = window.location.href;

import componentCityselectedtab from '../components/CitySelectedTab'
import componentSubTitleTab from '../components/SubTitleTab'
import componentViewSpot from '../components/ViewSpot'

export default {
  name: 'productlist',
  props:['componentData'],
  data () {
    return {
      msg: 'this is test for productlist.vue!!',
      currentTabIndex: '0',//改海外定位时修改成string，要是number，初次selectTab不会更新product数据；要是非0值，会导致cityTab报错
      mod3tabIndex: 0,
      currentTabProducts:[],
      currentStyle:'',
      tabInfor:{},
      configData:this.componentData.config_data,
      configPro:this.componentData.config_product,
      public:this.componentData.config_pub
    }
  },
  components: {
      'city-tab-component':componentCityselectedtab,
      'subtitle-tab-component':componentSubTitleTab,
      'viewspot-component':componentViewSpot,
  },
  created(){
    this.setBodyMod();
  },

  watch: {
        'public.location': function (v) {
            this.provinceCheck(v);
        }
    },
// updated(){
//     this.setBodyMod();
//   },
  mounted(){
    var cssTemp = this.componentData.styleTemp.pub + this.componentData.styleTemp[this.public.modType];
    this.$emit('handlercss',[cssTemp, this.componentData.config_css])
    this.$store.dispatch('createMetricAct','product');
  },
  methods:{
    getUrlKey(key){
        var strs = window.location.search.split("&");
        for (var i = 0; i < strs.length; i++) {
            if (strs[i].indexOf(key) !== -1) {
                return strs[i].split("=")[1];
            }
        }
        return false
    },
    setBodyMod(){
        var mod = this.getUrlKey('mod') || this.configPro.model;
        if (!mod && localUrl.indexOf('app-mod') !== -1) {
            mod = localUrl.split('app-mod')[1].split('.html')[0];
        }

        mod = mod || '1';
        var modType = 'mod' + mod;

        $('body').addClass(modType);

        this.$set(this.public,'modType',modType);

        this.provinceCheck(this.public.location);

    },

    provinceCheck(province) {
      var that = this;

        for (var index = 0; index < this.configData.length; index++) {
            if (province.indexOf(this.configData[index].provinceName) > -1) {
                this.selectTab(index);
                // debugger;
                return false;
            }
        }

        if(this.componentData.locationCityId){
          this.overseaProvinceCheck();
        }

    },

    overseaProvinceCheck(province) {
      var that = this;

        //判断关联目的地
        var model = LizardLite.Model({
            url: '/soa2/12008/GSLocationQOC',
            method: "POST",
            checkAuth: false,
            contentType: 'json'
        });

        model.setParam({
            cityid: parseInt(that.componentData.locationCityId),
            type: 1
        });

        model.execute(function(result) {
          // console.log(result.data.coutyid);
          var countryid = result.data.coutyid;
          var continentid = result.data.contid;
          // console.log(countryid)
          $.each(that.configData, function (index, item) {
              if(item.locationFilters.indexOf(countryid) > -1) {
                that.selectTab(index);
                return false;
              }
          });
          $.each(that.configData, function (index, item) {
              if(item.locationFilters.indexOf(continentid) > -1) {
                that.selectTab(index);
                return false;
              }
          });
          // this.selectTab(0);
        }, function(err) {}, this, function(abort) {});

        this.selectTab(0);

    },
    // 选择城市
    selectTab(index){
      this.currentTabIndex = index;
      this.mod3tabIndex = 0
      this.currentTabProducts = this.configData[index].NumList;
      this.tabInfor = this.configData[index];
      // this.tabInfor.emptytab=true;


      if (!isWidescreen) {
          $(window).scrollTop(0);
      }
    },
    selectTriggerTab(index){
        this.mod3tabIndex = index;
        if (!isWidescreen) {
            $(window).scrollTop(0);
        }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

