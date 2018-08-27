<template>
    <div id="app">
        <div v-html="currentStyle"></div>

        <div id="J-main-viewport" class="main-viewport" :style="{minHeight:minHeight+'px'}">
            <div class="main-body">
            <!-- 已结束模板 -->
            <template v-if="activityFinished">
                <div class="container-act-finished">
                    <a href="javascript:void(0);" style="display:block;" @click="linkToIndex();">
                        <img src="//pages.ctrip.com/commerce/promote/common/images/background/activity-finished.jpg" class="img-auto">
                    </a>
                </div>
            </template>
            <!-- 模块列表 -->
            <template v-else>
                <template v-for="item in componentsList">
                    <div :is="item.name" :componentData="item.data" @handlercss="handlercss"></div>
                </template>
            </template>
            </div>
            <div id="J-footer-announce" v-if="isiOS" class="statement iphoneXcompatible">该活动苹果不是赞助商，并且苹果也不会以任何形式参与其中</div>
        </div>

        
    </div>
</template>

<script>
const _ = {};
//全局变量
// var isWidescreen = document.body.clientWidth > 1025;
var isLoading = true;
var $win = $(window);
var $body = $('body');
var citymap, citymap_code;
_.findWhere = require('lodash.findWhere');

var componentsData = require('./css-options/componentsData.js');
var componentsConfig = require('./componentsConfig.js');

window.userIsLogin = '';
window.isWidescreen = document.body.clientWidth > 1025;

export default {
    name: 'app',
    data() {
        return {
            message: "this is root module app.vue",
            configPublic: this.configPublic,
            configData: this.configData,
            configStyle: this.configStyle,
            activityFinished: false,
            componentsList: [],
            styleTemp:'',
            currentStyle:'',
            cityId:1, //埋点用
            locationCityId:0,//定位用
            tabType:1, //默认tab为按钮样式，2为标签样式，同时控制栏目下图文详情背景
            directJump:false, //控制是否直接跳转填写页
            sourceName:false,
            isiOS:false,//判断是否iOS设备
            minHeight:'',
            urlH5:'//m.ctrip.com/webapp/ticket/index',
            urlApp:'ctrip://wireless/h5?path=ticket&page=index.html#/index',
            urlOnline:'//piao.ctrip.com/'
        }
    },

    components: componentsConfig.componentsAll,

    beforeCreate() {
      this.$store.dispatch('createMetricAct','ModuleStartLoading');

        (function(w) {
            String.prototype.format = function() {
                for (var temS = this, i = 0; i < arguments.length; ++i) {
                    temS = temS.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
                }
                return temS;
            };

            String.prototype.setCookie = function(value, expiryDays, domain, path, secure) {
                var builder = [this, "=", escape(value)];
                if (expiryDays) {
                    var date = new Date();
                    date.setTime(date.getTime() + (expiryDays * 86400000));
                    builder.push(";expires=");
                    builder.push(date.toUTCString());
                }
                if (domain) {
                    builder.push(";domain=");
                    builder.push(domain);
                }
                if (path) {
                    builder.push(";path=");
                    builder.push(path);
                }
                if (secure) {
                    builder.push(";secure");
                }

                document.cookie = builder.join("");
            };
            String.prototype.getCookie = function() {
                var re = new RegExp('\\b' + this + '\\s*=\\s*([^;]*)', 'i');
                var match = re.exec(document.cookie);
                return (match && match.length > 1 ? unescape(match[1]) : '');
            };

            String.prototype.delCookie = function(domain, path) {
                document.cookie = this + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "");
            };


            w.pageInfo = {};

            var useragent = w.navigator.userAgent;


            // 判断是否online版中
            pageInfo.isOnline = !/(iphone|ios|android|mini|mobile|mobi|Nokia|Symbian|iPod|iPad|ws\s+Phone|MQQBrowser|wp7|wp8|UCBrowser7|UCWEB|360\s+Aphone\s+Browser)/i.test(useragent);

            // 判断是否在app中
            pageInfo.isInApp = useragent.indexOf('CtripWireless') >= 0;
            // pageInfo.isInGongLveApp=useragent.indexOf('gs_wireless')>=0;
            if (typeof(w.localStorage) != "undefined") {
                pageInfo.isInApp = pageInfo.isInApp || w.localStorage.getItem('isInApp') == '1' || w.localStorage.getItem('ISINAPP') == '1';
            }
            pageInfo.isIE = useragent.indexOf('MSIE') >= 0;
            pageInfo.isInWeinxin = !!useragent.match(/micromessenger/i);

            if (pageInfo.isInApp) {
                pageInfo.device = 'app';
            } else if (pageInfo.isOnline) {
                pageInfo.device = 'online';
            } else {
                pageInfo.device = 'h5';
            }
            // TODO(you bug)
            // //插入ubt采集代码，分为PC端与移动端
            if (pageInfo.isOnline) {
                (function() {
                    if (!(window.$_bf && window.$_bf.loaded || window.$LAB || window.CtripJsLoader)) {
                        var a = new Date,
                            b = !1,
                            c = "?v=" + a.getFullYear() + a.getMonth() + "_" + a.getDate(),
                            a = document.createElement("script");
                        a.type = "text/javascript";
                        a.charset = "utf-8";
                        a.async = !0;
                        try {
                            b = "https:" == location.protocol
                        } catch (d) {}
                        a.src = ((b ? "https:" : "http:")) + "//webresource.c-ctrip.com/code/ubt/_bfa.min.js" + c;
                        b = document.getElementsByTagName("script")[0];
                        b.parentNode.insertBefore(a, b)
                    }
                })();
            } else {
                (function() {
                    if (!window.$_bf || !window.$_bf.loaded) {
                        var a = new Date,
                            b = "?v=" + a.getFullYear() + a.getMonth() + "_" + a.getDate(),
                            a = document.createElement("script");
                        a.type = "text/javascript";
                        a.charset = "utf-8";
                        a.async = !0;
                        a.src = "//webresource.c-ctrip.com/code/ubt/_mubt.min.js" + b;
                        b = document.getElementsByTagName("script")[0];
                        b.parentNode.insertBefore(a, b)
                    }
                })();
            }

        })(window);
        (function(w) {
            w.othersway = '';
            var strs = window.location.search.split("&");

            for (var i = 0; i < strs.length; i++) {
                if (strs[i].indexOf('referrer') !== -1) {
                    othersway = strs[i].split("=")[1];
                }
            }

        })(window);

    },
    created() {

        this.px2rem();
        this.requestAnimationFrame();
        // this.setPageTitle();

    },
    mounted() {

        if (pageInfo.device === 'app') {
            this.getBridge();
            this.initApp();
        } else {
            this.showLoading();
        }

        var that = this;
        this.getPageConfig({
            success: function() {
                // that.init();
                if(pageInfo.device === 'app') {
                    LizardLite.HybridReady(function() {
                        that.init();
                        CtripPage.app_hide_loading_page();
                        isLoading = false;
                    });
                } else {
                    that.init();
                    that.hideLoading();
                }
            },
            error: function() {}
        });

        // this.hideLoading();
    },
    methods: {
        init:function(){
            this.setPageTitle();
            this.refreshNavBar(); //渲染App nav bar
            this.renderOnlinePageHeader();

            // 判断活动是否结束
            if (!this.activityFinished) {
                this.setModule();
                this.setPageid();
                this.setLocation();//位置定位显示对应tab
                this.setWXShare(); //移动端非app内分享自定义分享文案、图片
            }
            this.showAnnouce(); //显示苹果免责协议
        },
        // set root fontsize for px2rem
        px2rem() {
            var html = document.getElementsByTagName('html')[0];

            resetRootFontsize();

            window.onresize = function() {
                resetRootFontsize();
            };

            function resetRootFontsize() {
                var winWidth = document.body.clientWidth || window.screen.width;
                var rootSize = winWidth * 100 / 375;
                html.setAttribute("style", "font-size:" + rootSize + "px;");
            }
        },
        requestAnimationFrame() {
            var lastTime = 0;
            var vendors = ['webkit', 'moz'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
                    window[vendors[x] + 'CancelRequestAnimationFrame'];
            }

            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function(callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                    var id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }
            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                };
            }
        },
        setPageConfig(data) {
            this.configPublic = JSON.parse(data.data.publicContent.replace(/\'/g, '"'));
            this.configData = this.mixConfigData(data.data.dataContent, data.data.sysRecommendList);
            this.configStyle = JSON.parse(data.data.cssContent.replace(/\'/g, '"'));
            this.activityFinished = this.activityIsFinish();
            componentsConfig.modules=this.configPublic.modules;

            var cssTemp = componentsData.configStyleHtml.bg;
            this.handlercss([cssTemp, this.configStyle]);

        },
        handlercss(e){
            var temp = e[0];
            var data = e[1];
            var htmltemp='';
            var strings = temp.split('}}');
            for(var i = 0;i<strings.length-1;i++){
                var key = strings[i].split('{{this.');
                var a = 'data' + '.' + key[1];
                var value = eval(a);
                var string = key[0] + value;
                htmltemp = htmltemp+string;
            }

            this.styleTemp = this.styleTemp + htmltemp + strings[strings.length-1];
            this.currentStyle = '<style>' + this.styleTemp + '</style>';
        },
        setModule(){
            var that = this;
            //最早的营销后台只适用于产品展示模板，添加早期兼容
            if(!this.configPublic.modules){
                this.configPublic.modules = [];
                this.configPublic.modules.push('banner');
                this.configPublic.modules.push('product');

                this.configPublic.extension = {};
            }

            // 后台更多展示按钮没有独立出来，修改前台模板兼容后台产品展示列表中的btnmore模块
           if(this.configPublic.setButtomMore !== '0'){
                this.configPublic.modules.push('btnMore');
           }

            this.modulelist=this.configPublic.modules;

            //console.log('moduleList',this.configPublic.modules);
            this.$store.dispatch('setModuleListAct',this.configPublic.modules);

          // this.modulelist=["coupon"];//测试数据
            for(var x = 0; x < this.modulelist.length; ++x){
                var module={};
              switch (this.modulelist[x]) {
                    case "banner":
                        this.$set(module, 'name', 'componentBanner');
                        this.$set(module, 'data', componentsData.bannerimage);
                        this.componentsList.unshift(module);
                        componentsData.bannerimage.image_url = $.extend(true,{},this.configPublic.imageurl);
                        componentsData.bannerimage.config_pub.pageInfo_device = pageInfo.device;
                        break;

                    case "coupon":
                        this.$set(module, 'name', 'componentCoupon');
                        this.$set(module, 'data', componentsData.coupon);
                        this.componentsList.push(module);
                        componentsData.coupon.config_coupon = $.extend(true,{},this.configPublic.extension.couponConfig);
                        componentsData.coupon.config_css = $.extend(true,{},this.configStyle.coupon);
                        componentsData.coupon.config_pub.pageInfo_device = pageInfo.device;
                        componentsData.coupon.styleTemp = componentsData.configStyleHtml.coupon;
                        break;

                    case "ar":
                        this.$set(module, 'name', 'componentAr');
                        this.componentsList.push(module);
                        break;

                    case "hello":
                        this.$set(module, 'name', 'componentHello');
                        this.componentsList.push(module);
                        break;

                    case "product":
                        this.$set(module, 'name', 'componentProductlist');
                        this.$set(module, 'data', componentsData.produstlist);
                        componentsData.produstlist.cityId = that.cityId;
                        componentsData.produstlist.locationCityId = that.locationCityId;
                        this.$watch('locationCityId', function (newVal, oldVal) {
                            componentsData.produstlist.locationCityId = newVal;
                        })
                        componentsData.produstlist.tabType = that.tabType;
                        componentsData.produstlist.directJump = that.directJump;
                        componentsData.produstlist.sourceName = that.sourceName;

                        //兼容处理，如果config_data中无数据，则不加载景点展示模块
                        if(this.configData.length !== 0 ){
                            this.componentsList.push(module);
                        }

                        //基础配置中产品相关，后台新添加，老页面中未必有此配置，如果无，从公共中获取
                        if(!!this.configPublic.extension.productConfig){
                            componentsData.produstlist.config_product = this.configPublic.extension.productConfig;
                        } else {
                            componentsData.produstlist.config_product.model = '1';
                            componentsData.produstlist.config_product.navTxt = this.configPublic.navTxt || '选择您身边的省市';
                            componentsData.produstlist.config_product.showSoldout = this.configPublic.showSoldout;
                            componentsData.produstlist.config_product.setButtomMore = this.configPublic.setButtomMore;
                            componentsData.produstlist.config_product.buttonMore = this.configPublic.buttonMore;
                            componentsData.produstlist.config_product.footerLink = this.configPublic.footerLink;
                        }

                        componentsData.produstlist.config_data = $.extend(true,[],this.configData);
                        componentsData.produstlist.config_css = $.extend(true,{},this.configStyle);
                        componentsData.produstlist.config_pub.pageInfo_device = pageInfo.device;
                        // componentsData.produstlist.config_pub.location = city;
                        componentsData.produstlist.config_pub.show_sold_out = componentsData.produstlist.config_product.showSoldout;
                        componentsData.produstlist.styleTemp = componentsData.configStyleHtml.view;

                        break;

                    case "singleproduct":
                        this.$set(module, 'name', 'componentSingleproduct');
                        this.$set(module, 'data', componentsData.singleproduct);
                        this.componentsList.push(module);
                        componentsData.singleproduct.config_data = $.extend(true,[],this.configData);
                        componentsData.singleproduct.config_css = $.extend(true,{},this.configStyle);
                        componentsData.singleproduct.graphic_details = this.configPublic.extension.singleproductConfig;
                        componentsData.singleproduct.config_pub.pageInfo_device = pageInfo.device;
                        componentsData.singleproduct.config_pub.show_sold_out = this.configPublic.showSoldout;
                        componentsData.singleproduct.styleTemp = componentsData.configStyleHtml.view;
                        // whg 20171020 ew added
                        // componentsData.produstlist.cityId = that.cityId;
                        // componentsData.produstlist.tabType = that.tabType;
                        // componentsData.produstlist.directJump = that.directJump;
                        // componentsData.produstlist.sourceName = that.sourceName;

                        break;

                    case "pagegraphicdetail":
                        this.$set(module, 'name', 'componentPagegraphicdetail');
                        this.$set(module, 'data', componentsData.pagegraphicdetail);
                        this.componentsList.push(module);
                        componentsData.pagegraphicdetail.config_data = $.extend(true,[],this.configData);
                        componentsData.pagegraphicdetail.config_css = $.extend(true,{},this.configStyle);
                        componentsData.pagegraphicdetail.graphic_details = this.configPublic.extension.pagegraphicdetailConfig;
                        componentsData.pagegraphicdetail.config_pub.pageInfo_device = pageInfo.device;
                        componentsData.pagegraphicdetail.config_pub.show_sold_out = this.configPublic.showSoldout;
                        componentsData.pagegraphicdetail.styleTemp = componentsData.configStyleHtml.view;
                        break;

                    case "btnMore":
                        this.$set(module, 'name', 'componentbtnMore');
                        this.$set(module, 'data', componentsData.btnMore);
                        this.componentsList.push(module);
                        componentsData.btnMore.setButtomMore= this.configPublic.setButtomMore;
                        componentsData.btnMore.buttonMore = $.extend(true,[],this.configPublic.buttonMore);
                        componentsData.btnMore.config_pub.btn_bg = this.configStyle.c2;
                        // componentsData.btnMore.config_pub.citymap = citymap;
                        // componentsData.btnMore.config_pub.citymap_code = citymap_code;
                        break;

                }
            };

            componentsConfig.components=this.componentsList[0].name;
        },

        initApp() {

            var that = this;

            window._bridgeCallback = {};

            // set native start

            // 注册定位回调
            _bridgeCallback.locate = function(res) {

                // alert("locate:" + JSON.stringify(res))

                if (!res.param || !res.param.value) {
                    return;
                }

                var value = res.param && res.param.value;
                var type = res.param.type;

                if (type == 'address') {
                    //第二次回调,确定城市选择栏tab值
                    var city = value.country + ',' + value.province + ',' + value.city;
                    componentsData.produstlist.config_pub.location = city;
                }
                if (type == 'CtripCity') {
                    //第三次回调，确定城市ID

                    citymap = value.CityEntities[0].CityName;
                    citymap_code = value.CityEntities[0].CityID;
                    componentsData.btnMore.config_pub.citymap = citymap;
                    componentsData.btnMore.config_pub.citymap_code = citymap_code;

                    //20180131新增
                    that.locationCityId = citymap_code;
                }

            };

            //注册从缓存中获取位置信息
            _bridgeCallback.get_cached_ctrip_city = function(res) {

                var city = "";
                // alert(JSON.stringify(res))

                if (typeof(res.param) !== 'undefined' && typeof(res.param.ProvinceName) !== 'undefined' && typeof(res.param.CountryName) !== 'undefined') {
                    //检测是否有city,
                    city = res.param.ProvinceName + ',' + res.param.CountryName;
                    for (var i = 0; i < res.param.CityEntities.length; i++) { //匹配到最低级别的城市，没有则为provice
                        if (typeof(res.param.CityEntities[i].CityName) !== 'undefined') {
                            city += "," + res.param.CityEntities[i].CityName; //查询都是使用"浙江，绍兴"的格式进行
                        }
                    }

                    componentsData.produstlist.config_pub.location = city;

                    citymap = res.param.CityEntities[0].CityName;
                    citymap_code = res.param.CityEntities[0].CityID;
                    componentsData.btnMore.config_pub.citymap = citymap;
                    componentsData.btnMore.config_pub.citymap_code = citymap_code;

                    //20180131新增
                    that.locationCityId = citymap_code;

                } else {
                    CtripMap.app_locate(3, true);
                }
            };


            // 注册点击分享按钮回调
            _bridgeCallback.share = function() {


                if (!that.configPublic.share) {
                    return;
                }

                var param = that.configPublic.shareParam;
                var dataList = [{
                    shareType: "Default",
                    imageUrl: param.picUrl,
                    title: param.title,
                    text: param.content,
                    linkUrl: param.shareUrl
                }];

                CtripShare.app_call_custom_share(dataList);

            };

            _bridgeCallback.member_login = function(res) {
                userIsLogin = !!res.param.data.Auth;

                if (!!res.param && !!res.param.data.Auth) {

                    var get_auth = res.param.data.Auth;
                    LizardLite.UserStore.setUser({"Auth":get_auth})

                }
            };

            LizardLite.HybridReady(function() {
                window.app.callback = function(res) {
                    if (typeof res === 'string') {
                        res = JSON.parse(res);
                    }

                    var tagname = res.tagname;
                    // alert(tagname)
                    if (typeof _bridgeCallback[tagname] === 'function') {
                        _bridgeCallback[tagname](res);
                    }

                };

                if(isLoading) {
                    CtripPage.app_show_loading_page();
                }


            });

        },
        //渲染App nav bar
        refreshNavBar() {
            var that = this;
            if (pageInfo.device != 'app') {
                return false;
            }
            // 使用hybridShell二次封装bridge.js Ctripbar app_refresh_nav_bar刷新顶部条按钮和文字
            var nav_bar_config_json = {
                "center": [{
                    "tagname": "title",
                    "value": this.configPublic.title
                }]
            };

            if (this.configPublic.share && !this.activityIsFinish()) {
                nav_bar_config_json.right = [{
                    "tagname": "share",
                    "value": "分享"
                }];
            }

            // alert("可能会报错");

            CtripBar.app_refresh_nav_bar(JSON.stringify(nav_bar_config_json));

            // alert("no error");
        },
        getPageConfig(settings) {
            var that = this;
            settings = $.extend({
                success: null,
                error: null
            }, settings);

            var topicId = this.getParam('promoteid') || 418;

            // 20171017whg新增
            that.cityId = this.getParam('cityid') || 1;
            that.cityId = parseInt(that.cityId);
            that.tabType = this.getParam('tabtype') || 1;
            that.tabType = parseInt(that.tabType);
            that.directJump = this.getParam('directjump') || false;
            that.directJump = JSON.parse(that.directJump);
            that.sourceName = this.getParam('sourcename') || false;
            that.sourceName = JSON.parse(that.sourceName);


            var goUrl = this.getProtocol();

            var model = LizardLite.Model({
                url: '/soa2/12008/topicInfoQOC',
                // url:goUrl + '//gateway.m.uat.qa.nt.ctripcorp.com/restapi/soa2/12008/topicInfoQOC',
                method: "POST",
                checkAuth: false,
                contentType: 'json'
            });

            model.setParam({
                id: parseInt(topicId),
                type: 1
            });

            model.execute(function(result) {
                if (typeof result === 'string') {
                    result = JSON.parse(result);
                }
                that.setPageConfig(result);

                if (typeof settings.success == 'function') {
                    // console.log(this);
                    settings.success(result);
                }

            }, function(err) {
                // alert('err:'+JSON.stringify(err))
            }, this, function(abort) {});
        },

        activityIsFinish() {
            var currentTime = new Date();
            var endTime = new Date(this.configPublic.endTime);
            return currentTime >= endTime;
        },
        setPageTitle() {
            if (document.title === '') {
                document.title = this.configPublic.title;
            }
        },
        linkToIndex(){
            var device = pageInfo.device;
            if((LizardLite.app.vendor.is('CTRIP'))&&(!LizardLite.app.code.is('MASTER'))){
                device='h5';
            }//非主板app只能跳转http打头的链接
            var that = this;

            var goUrl;
            if (device == 'h5') {
                goUrl = that.urlH5;
            } else if (device == 'app') {
                goUrl = that.urlApp;
            } else {
                goUrl = that.urlOnline;
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
            if (goUrl.indexOf('ctrip://') === -1 && goUrl.indexOf('http://') === -1 && goUrl.indexOf('https://') === -1 ) {
                return false;
            }
            if (device == 'app') {
                CtripUtil.app_open_url(goUrl, targetMode);
            } else {
               window.location.href=goUrl;
            }
        },
        // 加载online公用头尾
        renderOnlinePageHeader() {
            if (isWidescreen) {
                // online公用头配置
                window.globalConfig = {
                    //bt类型，默认为default,没有一二级频道选中，若需选中一二频道请联系（R&D 基础业务 用户中心-用户组成员）
                    BusinessType: 'default',
                    //环境选'other'即可
                    Environment: 'other',
                    // NeedNav:'0',
                    Version:''  //3.0对应响应式版本
                };
                // 加载online公用头
                this._getScript([
                    '//webresource.c-ctrip.com/ResCRMOnline/R1/pageheader/js/IntegratedJS.js'
                ]);
            }
        },
        //动态加载js文件
        _getScript(url) {
            var head = document.getElementsByTagName('head')[0];

            for (var i = url.length - 1; i >= 0; i--) {
                var js = document.createElement('script');
                js.setAttribute('type', 'text/javascript');
                js.setAttribute('src', url[i]);
                head.appendChild(js);
            }
        },
        showAnnouce() {
            var that = this;
            //判断访问终端
            var browser = {
                versions: function() {
                    var u = navigator.userAgent,
                        app = navigator.appVersion;
                    return {
                        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                        iPad: u.indexOf('iPad') > -1, //是否iPad
                    };
                }(),
                language: (navigator.browserLanguage || navigator.language).toLowerCase()
            };
            var $footerAnnounce = $('#J-footer-announce');
            var winHeight = document.body.clientHeight || window.screen.height;
            var heightMainBody;

            //判断是否apple端
            if (browser.versions.iPad || browser.versions.iPhone || browser.versions.ios) {
                that.isiOS = true;
                // 页面产品少于一屏时苹果话术置底
                // if($('#J-main-viewport').height() < winHeight) {
                //     that.contentUnfull = true;
                // }
                that.minHeight = winHeight;
            }

        },

        setPageid() {

            var that = this;
            var pageid;
            var pageid_online, pageid_h5, pageid_app;
            var _configPublic = this.configPublic;


            if (!!(othersway) && !!(_configPublic.otherspid) && !!(_configPublic.otherspid[othersway])) {
                pageid_online = _configPublic.otherspid[othersway].online;
                pageid_h5 = _configPublic.otherspid[othersway].h5;
                pageid_app = _configPublic.otherspid[othersway].app;
            } else {
                pageid_online = _configPublic.pageid.online;
                pageid_h5 = _configPublic.pageid.h5;
                pageid_app = _configPublic.pageid.app;
            }

            var $pageId = $('#page_id');

            if (pageInfo.isInApp) {
                $pageId.val(pageid_app || '');
            } else if (pageInfo.isOnline) {
                $pageId.val(pageid_online || '');
            } else {
                $pageId.val(pageid_h5 || '');
            }
        },

        setWXShare() {
            var that = this;
            var param = this.configPublic.shareParam;
            var shareData = {
                title: param.title,
                desc: param.content,
                href: param.shareUrl,
                icon: param.picUrl
            };

            if (!pageInfo.isInApp && pageInfo.isInWeinxin) {
                LizardLite.weixinReady(function(cShell) {
                    if (!cShell) {
                        return;
                    }
                    try {
                        cShell
                            .share(shareData)
                            .done(function() {})
                            .fail(function() {});
                    } catch (e) {

                    }
                    // cShell.share.run(function(){}, function (err){}, shareData)
                });
            }
        },

        showLoading() {
            $('.J-loading').show();
        },

        hideLoading() {
            $('.J-loading').hide();
        },

        getParam(key) {
            var list = this.getPageParams(location.href);
            return list[key];
        },

        getPageParams(url) {
            url = decodeURIComponent(url);
            var ret = {};
            var queryStr = url.replace(/^[^\?#]*\??/g, '').replace(/#DIALOG_.*$/g, '').replace(/#\|cui-.*$/g, '');
            var searchReg = /([^&=?]+)=([^&]+)/g;
            var urlReg = /\/+.*\?/;
            var arrayReg = /(.+)\[\]$/;
            var match, name, value, isArray;
            while (match = searchReg.exec(queryStr)) {
                name = match[1].toLowerCase();
                value = match[2];
                isArray = name.match(arrayReg);
                if (urlReg.test(value)) {
                    ret[name] = queryStr.substr(queryStr.indexOf(value));
                    break;
                } else {
                    if (isArray) {
                        name = isArray[1];
                        ret[name] = ret[name] || [];
                        ret[name].push(value);
                    } else {
                        ret[name] = value;
                    }
                }
            }

            return ret;
        },
        getProtocol() {
            var currentUrl = window.location.href;
            var protocol;
            if (currentUrl.indexOf('http:') === 0) {
                protocol = "http:";
            } else if (currentUrl.indexOf('https:') === 0) {
                protocol = "https:";
            }
            return (protocol);
        },
        getBridge(){
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = '//webresource.c-ctrip.com/code/lizard/2.2/web/3rdlibs/bridge.js';
            document.body.appendChild(script);
        },
        setLocation() {
            var that = this;
            if (this.configPublic.getLocation) {
                if (pageInfo.isInApp) {
                    // bridge.js CtripMap 的app_get_cached_ctrip_city从缓存获取城市信息，没有的话使用app_locate定位
                    LizardLite.HybridReady(function(){
                        CtripMap.app_get_cached_ctrip_city();
                    });
                } else {
                    // 非app使用接口定位
                    this._setLocationH5();
                }
            }
        },
        _setLocationH5() {
            var that = this;

            var events = {
                'callback':function (success) {
                    // console.log(success)
                    var city = success.country + ',' + success.province + ',' + success.city;
                    componentsData.produstlist.config_pub.location = city;
                },
                'error': function (e) {
                    // console.log('error'+e);

                },
                'posCallback': function (lng,lat,isBaidu) {
                    // console.log('lng'+lng);
                    // console.log('lat'+lat);
                    // console.log('isBaidu'+isBaidu);
                    // var callbacks = {
                    //     'callback':function (success) {
                    //         // console.log(success);
                    //     },
                    //     'error':function (error) {
                    //         // console.log(error);
                    //     }
                    // };
                    // LizardLite.requestMapAddress(139.691706,35.689487,callbacks.callback,callbacks.error,3000,false);
                },
                'posError': function (data) {
                    // console.log('posError'+data);

                },
                'cityCallBack': function (success) {
                    citymap = success.CityEntities[0].CityName;
                    citymap_code = success.CityEntities[0].CityID;
                    componentsData.btnMore.config_pub.citymap = citymap;
                    componentsData.btnMore.config_pub.citymap_code = citymap_code;

                    //20180131新增
                    that.locationCityId = citymap_code;
                    // console.log('框架返回的城市ID为'+citymap_code);
                    // that.locationCityId = 294;
                },
                'cityErrorCallBack': function (e) {
                    // console.log('cityErrorCallBack'+e);
                }
            }

            //所需参数：function(callback, error, posCallback, posError, isAccurate, cityCallBack, cityErrorCallBack,isForceLocate,needBaidu,timeout)
            LizardLite.requestCityInfo(events.callback,events.error,events.posCallback,events.posError,false,events.cityCallBack,events.cityErrorCallBack,true,false,3000);

        },
        mixConfigData(dataManual, dataRecom) {
            // TODO  将人工录入数据和自动推荐数据拼合到configData中
            if(!dataManual){
                return false
            }

            var configData;
            configData = JSON.parse(dataManual.replace(/\'/g, '"'));

            // console.log(configData);
            for (var x = 0; x < configData.length; x++) {
                for (var y = 0; y < configData[x].NumList.length; y++) {
                    var temp = _.findWhere(dataRecom, {
                        recommendKey: configData[x].NumList[y].recommendKey
                    });
                    if (temp) {
                        temp.recommendIdList.forEach(function(key, num) {
                            if (num.type == 0) {
                                configData[x].NumList[y].ids.push({
                                    aid: String(num.id)
                                });
                            } else if (num.type == 1) {
                                configData[x].NumList[y].ids.push({
                                    sid: String(num.id)
                                });
                            }
                        });
                    }
                }
            }
            // console.log(configData);
            return configData;
        }

        // TODO

    }
}
</script>

<style>
/*common*/
body {-webkit-user-select: none;-webkit-touch-callout: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);-webkit-overflow-scrolling: touch;-webkit-text-size-adjust: none;overflow-y: auto;*height:auto;}
#main {*height:auto;}
.main-viewport {*height:auto;}
.container a:active,.container a:hover {text-decoration: none;}
.show {display: block;}
.hide {display: none;}
.img-auto {width: 100%;}
.flex-box {display: -webkit-box; display: box;display: -webkit-flex;display: -moz-flex; display:-ms-flex;display: -ms-flexbox; display: flex;}
.flex-box-1 {-webkit-box-flex:1;-moz-box-flex:1;-webkit-flex:1;flex:1; -ms-flex:1;}
.p10 {padding:10px;}
.arial {font-family:Helvetica,Arial,SimSun;}

#cui_nav,.cui_hd_cont,#base_ft,.cui_footer {display: none;}

.statement{color: #a4a4a4;background-color: #404040;padding:10px 0;line-height: 18px;text-align: center;font-size: 10px;height:38px;box-sizing:border-box;}
.stayAtBottom {
    position: absolute;
    bottom: 0;
    width: 100%;
}
.iphoneXcompatible {
    padding-bottom: env(safe-area-inset-bottom);/*iphonex兼容处理*/
    padding-bottom: constant(safe-area-inset-bottom);/*iphonex兼容处理*/
}

/*activity finished*/
.ctm-act-finished .ctm-header,.ctm-act-finished .container-more{display: none;}
.ctm-act-finished .container-act-finished {text-align: center;}

/* loading */
.ctm-loading {display: none\9;}

.cp-h5-lizard { position: absolute; left:0; right:0; height:100%; width:100%; top:0; bottom:0; }

#cp-huazhu {
    content: "";
    width: 112px;
    height: 57px;
    background-position: center;
    top: 20px;
    position: absolute;
    background-size: 70px 57px;
}

.loading-layer2 .loading-layer2-before,
.loading-cycle{background: url(./assets/images/first-loading.png);background-size: 135px auto;background-repeat: no-repeat;position: absolute;}

/* loading layer */
.loading-box2 {  position: fixed;left:50%;top:50%;margin-left:-56px;margin-top: -56px; width:100%; }
.loading-layer2 {background-color: #fff;width: 112px;height: 27px;padding-top: 85px;border-radius: 7px;z-index:10000;color: #666;font-size: 12px;text-align: center;}
.loading-layer2 .loading-layer2-before {content: "";width: 64px;height: 57px;background-position: -72px 0;top: 20px;left: 25px;}
.loading-cycle{width: 69px;height: 69px;background-position: 0 0;top: 10px;left: 20px;-webkit-animation:loading 1s linear 0s infinite;animation:loading 1s linear 0s infinite;
}
@-webkit-keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media screen and (max-width:1024px){
    .ctm-act-finished .container-act-finished img{width: 100%;}
}

@media screen and (min-width:1025px){
    body {height:auto;}
    #main {height:auto;}
    .main-viewport {height:auto;}
    .container {width: 1020px;margin:0 auto;/*background-color: white;*/}
    .section-common {padding: 15px 0;/*background: white !important;*/}

    #cui_nav,.cui_hd_cont,#base_ft {display: block;}
    #header .cui_nav_single .base_nav {margin-bottom: 0;}

    .ctm-act-finished .container-act-finished img{width: 480px;}
}
</style>
