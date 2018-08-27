<template>
    <div>
        <div v-for="(numlist, index) in currentTabProducts" class="J-panel-tab container section-common clearfix" :class="numlist.type_class">

            <subtitle-component v-if="public.modType !== 'mod3'" :subTitleInfor="numlist"></subtitle-component>
            <graphic-details-component v-if="numlist.editContent" :graphicDetails="numlist" :configCss="componentData.config_css" :tabType="tabType"></graphic-details-component>
            <template v-if="public.modType !== 'mod3' || mod3tabIndex == index">
                <spot-panel-component :numlist="numlist" :currentTabIndex="currentTabIndex" :cityId="componentData.cityId"></spot-panel-component>
            </template>
            <div v-if="public.modType !== 'mod3'">
                <btn-more-component v-if="!!numlist.showMore" :componentData="colBtnMoreDetail(numlist)" :currentTabIndex="currentTabIndex" :cityId="componentData.cityId"></btn-more-component>
            </div>
            <div v-else>
                <btn-more-component v-if="!!numlist.showMore && mod3tabIndex == index" :componentData="colBtnMoreDetail(numlist)" :currentTabIndex="currentTabIndex" :cityId="componentData.cityId"></btn-more-component>
            </div>
        </div>
        <footer-link-component v-if="componentData.config_product.footerLink.length!=0" :componentData="componentData.config_product.footerLink"></footer-link-component>
    </div>
</template>


<script>
var _array = require('lodash/array');

var $win = $(window);
var $body = $('body');
var count = 0;
var totalCount = 0;
var currentTabCount = 0;
var loadResourceOnScroll = false;//是否滚屏加载资源 默认true
//分屏加载相关参数
var group_ids = [];//给请求的ID分组
var request_num = 0;//发送请求的数量
var adjust_value = -200;//分屏加载快慢调节，正数表示延迟加载，负数表示提前加载, 数值表示像素值
var split_loading = true;//ajax并发拦截开关



var list;

import componentSubTitle from './SubTitle'
import componentGraphicDetails from './GraphicDetails'
import componentspotpanel from './Spotpanel'
import componentbtnmore from '../modules/btnMore'
import componentfooterlink from '../modules/footerLink'

export default {
  name: 'viewspot',
  props:['currentTabProducts','public','mod3tabIndex','currentTabIndex','tabInfor','componentData','tabType'],
  data () {
    return {
      btnMoreDisplayType: 'col',
      msg: 'this is test for viewspot.vue!!',
      loadstatus:{}
    }
  },
  components: {
      'subtitle-component':componentSubTitle,
      'graphic-details-component':componentGraphicDetails,
      'spot-panel-component':componentspotpanel,
      'btn-more-component':componentbtnmore,
      'footer-link-component':componentfooterlink
  },
  created(){
    this._loadCurrentTabResource();//渲染主体景点信息
  },
  watch:{
    currentTabIndex:'_loadCurrentTabResource'
  },
  computed: {

  },
  mounted(){

  },
  methods:{
    colBtnMoreDetail: function(numlist) {
        var colBtnMoreDetail = {
            buttonMore:[{
                text:numlist.buttonMoreText,
                type:numlist.buttonMoreType,
                urlApp:numlist.buttonMoreUrlApp,
                urlH5:numlist.buttonMoreUrlH5,
                urlOnline:numlist.buttonMoreUrlOnline
            }],
            config_pub:{
                btn_bg:this.componentData.config_css.c2,
                citymap:"",
                citymap_code:""
            },
            setButtomMore:"3"
        }
        return colBtnMoreDetail;
    },
     _tidyIdList() {
        var that = this;
        var _list = that.currentTabProducts;
        var _tempList = [];
        // debugger
        $.each(_list, function (index, item) {
            var i = index;
            var _ids = item.ids;

            // _tempList = _tempList.push(_ids)
            $.each(_ids, function (index, item) {
                var j = index;
                item.index = {i ,j};
                _tempList.push(item);
            });
        });

        return _tempList;

    },
    // 加载当前tab资源
    _loadCurrentTabResource() {

        if(!!this.loadstatus[this.currentTabIndex]){
            return false;
        }

        list = this._tidyIdList();

        var hasContent;

        for(var i=0; i<this.currentTabProducts.length; i++) {
            if(this.currentTabProducts[i].editContent) {
                hasContent = true;
                break;
            }
        }

        if(list.length == 0 && this.currentTabIndex!==0 && !hasContent){
            this.$emit('selectCity', 0);
            $('#J-empty-pop').show();
            $('#J-empty-mask').show()
            setTimeout("$('#J-empty-pop').hide()",2000)
            setTimeout("$('#J-empty-mask').hide()",2000)
            if(this.tabInfor!==undefined){
                this.tabInfor.emptytab=true;
            }

        }

        // 当前tab中所有景点数量
        totalCount = 0;
        currentTabCount = list.length;

        this._loadResource(list);
    },
    _loadResource (list) {
        var that = this;
        var ImgSize = isWidescreen ? 'C_364_206' : 'C_200_200';//原 C_300_256
        var ajax_num = 1;

        group_ids = [];
        request_num = 0;
        split_loading = false;
        //配置门票id
        var temp = {
            "debug": false,
            "imgsize": ImgSize,
            "tkts": [],
            "acts": []
        };
        $.each(list, function (index, item) {
            var t = [];
            var id = {};
            if (!!item.sid) {
                item.sid = item.sid.replace(/\s+/g, "");
                id.tktid = item.sid.replace(/\s+/g, "");
                if (!!item.rid) {
                    item.rid = item.rid.replace(/\s+/g, "");
                    t.push(item.rid.replace(/\s+/g, ""));
                    id.opid = t;
                }
                temp.tkts.push(id);
            } else {
                item.aid = item.aid.replace(/\s+/g, "");
                id.pid = item.aid.replace(/\s+/g, "");
                if (!!item.optionid) {
                    item.optionid = item.optionid.replace(/\s+/g, "");
                    t.push(item.optionid.replace(/\s+/g, ""));
                    id.opid = t;
                }
                temp.acts.push(id);
            }
            if ((index + 1 == 6 * ajax_num) || (index == list.length - 1)) {
                group_ids.push(temp);
                if (ajax_num == 1) {
                    that._getDataById(temp);
                }
                temp = {
                    "debug": false,
                    "imgsize": ImgSize,
                    "tkts": [],
                    "acts": []
                };
                ajax_num += 1;
            }
        });

    },
    //不足之处：如果 J-main-wrapper 包含查看更多按钮，则会影响到体验，功能无影响
    loadResourceOnScroll () {
        var that = this;
        var scrollTop = 0;
        var screenHeight = 0;
        var bodyHeight = 0;
        var $warpper = $('#J-main-wrapper');
        if($('body').hasClass('mod3')){
            return false;
        }
        $win.on('scroll.sticky', function () {
            this.requestAnimationFrame(function(){
                scrollTop = $win.scrollTop();
                screenHeight = window.innerHeight;
                bodyHeight = $warpper.height() + $warpper.offset().top;
                if (split_loading && (scrollTop + screenHeight >= bodyHeight + adjust_value)) {
                    if (request_num < group_ids.length) {
                        split_loading = false;
                        that._getDataById(group_ids[request_num]);
//                        console.log(request_num);
                    }
                }
            });

        });
    },

    _getDataById(data) {
        var that = this;
        // var list = this.currentTabProducts;
        var ticketNumber = data.tkts.length + data.acts.length;
        var goUrl = this.getProtocol();

        var model = LizardLite.Model({
            url:goUrl + "//m.ctrip.com/restapi/soa2/12008/productListQOC",
            // url:goUrl + '//gateway.m.uat.qa.nt.ctripcorp.com/restapi/soa2/12008/productListQOC',
            method:"POST",
            checkAuth: false,
            contentType:'json'
        });
        model.setParam(data);

        model.execute(function(result){
            var all_sinfo = result.data.products;

            for (var i = 0; i < all_sinfo.length; i++) {
                var _sinfo = all_sinfo[i] || '';
                var id = _sinfo.id.toString(),
                        imgUrl = !!_sinfo.imgurl ? _sinfo.imgurl.replace(/(http|https):/i, "") : '',
                        name = _sinfo.name,
                        cityName = _sinfo.gscityname,
                        price = _sinfo.price,
                        mprice = _sinfo.mprice,
                        desc = _sinfo.recomm[0],
                        type = (_sinfo.type == 1) ? 'tic' : 'ttd',
                        svol = _sinfo.svol,
                        cmtscore = _sinfo.cmtscore,
                        categoryname = _sinfo.categoryname,
                        options = _sinfo.ops,
                        offPrice, discount;
                var viewsoldout = false, id_infor = {};
                if(this.componentData.sourceName == true){
                    name = options[0].opname ? options[0].opname : name;
                }
                
                if (type == "tic") {
                    id_infor.sid = id;
                    // id_infor.rid = "";
                } else {
                    id_infor.aid = id;
                    // id_infor.optionid = "";
                }


                //判断资源ID数据是否为空，不为空则取资源数据
                if (options && options[0] != null) {
                    if (type == "tic") {
                        id_infor.rid = options[0].opid.toString();
                    } else {
                        id_infor.optionid = options[0].opid.toString();
                    }

                    //售罄逻辑处理
                    // if (options[0].opsats == 0 || options[0].opprice == 0||options[0].inventorynum===0) {
                    if (options[0].opsats == 0 || options[0].opprice == 0) {

                        if (this.public.show_sold_out == true || this.public.show_sold_out == 'true') {
                            viewsoldout = true;
                        } else {
                            price = 0;
                        }
                    } else {
                        //不管填不填资源id，门票都不会显示资源里的景点名称,单景点除外
                        if (type == "ttd" || this.public.module == 'singleproduct') {
                            name = options[0].opname;
                        }
                        price = options[0].opprice;
                        mprice = options[0].opmprice;
                    }
                    //汇率判断，不为0时换算成相对应的RMB
                    mprice = (options[0].oprate == '1') ? (options[0].opmprice) : ((options[0].opmprice * options[0].oprate).toFixed(0));
                }

                offPrice = Math.round(mprice - price);

                discount = Math.round(price / mprice * 100) / 10;

                //获取configData中根数据位置
                var now_list = $.extend(true,[],list);

                // 规避请求未返回切换省市造成的index报错问题
                var temp_now_list = JSON.parse(JSON.stringify(now_list));
                var temp_id_infor = JSON.parse(JSON.stringify(id_infor));
                if(_array.remove(temp_now_list, temp_id_infor)[0] == undefined) {
                    break;
                }

                var original_index = _array.remove(now_list, id_infor)[0].index;

                var index_i = original_index.i;
                var index_j = original_index.j;

                var configdata_tab = this.currentTabProducts[index_i];
                // 规避mod2疯狂切换省市导致的报错
                if(configdata_tab == undefined) {
                    break;
                }

                var original_view = configdata_tab.ids[index_j];
                // 规避mod2疯狂切换省市导致的报错
                if(original_view == undefined) {
                    break;
                }

                //configdata插入景点详情数据
                //1.图片&模板类型&抢购按钮插入
                var mod_type = configdata_tab.modType;

                var type_class, img_size;
                var _type = mod_type || 'routine1';
                if (_type == 'routine2') {
                    type_class = 'mod-routine-2';
                    img_size = '182_102';
                } else if (_type == 'routine3') {
                    type_class = 'mod-routine-3';
                    img_size = '182_102';
                } else if (_type == 'key1') {
                    type_class = 'mod-key-1';
                    img_size = '280_158';
                    this.$set(original_view, 'showButtonBuy', true);
                } else if (_type == 'key2') {
                    type_class = 'mod-key-2';
                    img_size = '200_200';

                    // original_view.showButtonBuy = true;
                    this.$set(original_view, 'showButtonBuy', true);

                } else if (_type == 'key3') {
                    type_class = 'mod-key-3';
                    img_size = '500_280';

                    // original_view.showButtonBuy = true;
                    this.$set(original_view, 'showButtonBuy', true);

                } else {
                    type_class = 'mod-routine-1';
                    img_size = '200_200';
                }

                if(!!original_view.imgurl){
                    imgUrl = original_view.imgurl
                }

                if (!isWidescreen) {
                    imgUrl = imgUrl.replace(/C_[1-9]\d+_[1-9]\d+/, 'C_' + img_size);
                }

                // original_view.imgurl = imgUrl;
                this.$set(original_view, 'imgurl', imgUrl);

                // configdata_tab.type_class = type_class;
                this.$set(configdata_tab, 'type_class', type_class);

                this.$set(original_view, 'viewsoldout', viewsoldout);//已售罄
                if ( document.body.clientWidth < 375 && type_class !== 'mod-key-3') {
                    this.$set(original_view, 'soldouttext', '其他产品 >>');
                } else if(!isWidescreen){
                    this.$set(original_view, 'soldouttext', '去看看其他产品 >>');
                }

                //2.便签类型插入
                var _type = configdata_tab.labelType || '';

                // original_view.showLabel = true;
                this.$set(original_view, 'showLabel', true);

                if (_type == 2) {

                    // original_view.discount = discount;
                    this.$set(original_view, 'discount', discount);

                    // 若折扣异常则隐藏折扣标签
                    if (discount <= 0 || discount >= 10) {

                        // original_view.showLabel = false;
                        this.$set(original_view, 'showLabel', false);
                    }

                } else if (_type == 3) {
                    var stringprice = String(offPrice);

                    // original_view.offprice = stringprice;
                    this.$set(original_view, 'offprice', stringprice);


                    //判断减免价格是否超过4位数
                    if (offPrice <= 0) {

                        // original_view.showLabel = false;
                        this.$set(original_view, 'showLabel', false);

                    } else {
                        if (stringprice.length > 3) {

                            // original_view.offprice = stringprice.substring(0, stringprice.length - 3) + ',' + stringprice.slice(-3);
                            this.$set(original_view, 'offprice', stringprice.substring(0, stringprice.length - 3) + ',' + stringprice.slice(-3));
                        }
                    }
                } else if (_type == 4) {
                    this.$set(original_view, 'type', type);
                    this.$set(original_view, 'svol', svol);
                    this.$set(original_view, 'cmtscore', cmtscore);
                    this.$set(original_view, 'categoryname', categoryname);
                }

                //3.插入景点名称，定位城市，景点详情描述
                // original_view.name = name;
                this.$set(original_view, 'name', name);

                if (!cityName || configdata_tab.showCitylabel === false) {
                    // original_view.cityname = cityName;
                    // original_view.showModcity = {'display':'none'};
                    this.$set(original_view, 'cityname', cityName);
                    this.$set(original_view, 'showModcity', {'display':'none'});
                } else {
                    // original_view.cityname = cityName;
                    // original_view.showModcity = {'visibility':'visible'};
                    this.$set(original_view, 'cityname', cityName);
                    this.$set(original_view, 'showModcity', {'visibility':'visible'});
                }

                if (!original_view.desc && type == 'tic' && configdata_tab.showTicDes) {
                    // original_view.desc = desc;
                    this.$set(original_view, 'desc', desc);
                }

                //4.插入全城返现逻辑
                if (options && options[0] != null){
                    var cashback =  !!options[0].taginfos[0] ? options[0].taginfos[0].tags[0].tname[0] : '';
                    if(!!cashback && pageInfo.device !== 'online'){
                        // original_view.cashback = cashback;
                        this.$set(original_view, 'cashback', cashback);
                    }
                }

                //5.插入市场价&现价

                if (mprice != "0" && mprice > price) {
                    // original_view.mprice = mprice;
                    this.$set(original_view, 'mprice', mprice);
                } else {
                    // 若市场价为0且需显示省**元标签 则隐藏标签
                    if(_type == 2) {
                        original_view.showLabel = false;
                        this.$set(original_view, 'showLabel', false);
                    }

                    original_view.mprice = false;
                    this.$set(original_view, 'mprice', false);
                }
                original_view.price = price;
                this.$set(original_view, 'price', price);
                // 非一元票显示“起”字
                if(price == 1){
                    original_view.priceBeginLabel = true;
                    this.$set(original_view, 'priceBeginLabel', true);
                }

                //6.跳转链接
                if(type == "tic"){
                    //单景点跳转填写页：有资源ID并且未售罄
                    if((this.public.module == 'singleproduct' || this.componentData.directJump) && !!id_infor.rid && !viewsoldout){
                        if (pageInfo.device == 'app') {
                            var urlBase64 = CtripTool.base64Encode('ticket/index.html#/booking?tid='+id_infor.rid+'&spotid='+id);
                            this.$set(original_view, 'viewurl', 'ctrip://wireless/h5?url='+ urlBase64 + '&type=1');

                        } else if (pageInfo.device == 'online' && that.getProtocol() == 'http:') {
                            this.$set(original_view, 'viewurl', '//piao.ctrip.com/dest/t'+ id +'.html');
                        } else if (pageInfo.device == 'online' && that.getProtocol() == 'https:') {
                            this.$set(original_view, 'viewurl', '//m.ctrip.com/webapp/ticket/dest/t' + id + '.html');
                        } else {//h5
                            this.$set(original_view, 'viewurl', '//m.ctrip.com/webapp/ticket/booking?spotid=' + id + '&tid=' + id_infor.rid);
                        }
                    } else {
                        if (pageInfo.device == 'app') {
                            // original_view.viewurl = 'ctrip://wireless/h5?path=ticket&page=index.html%23%2Fdest%2Ft'+ id +'.html'
                            var urlBase64 = CtripTool.base64Encode('ticket/index.html#/dest/t'+id+'.html');
                            this.$set(original_view, 'viewurl', 'ctrip://wireless/h5?url='+ urlBase64 + '&type=1');
                            // this.$set(original_view, 'viewurl', 'ctrip://wireless/h5?path=ticket&page=index.html%23%2Fdest%2Ft'+ id +'.html');
                        } else if (pageInfo.device == 'online' && that.getProtocol() == 'http:') {
                            // original_view.viewurl = '//piao.ctrip.com/dest/t'+ id +'.html'
                            this.$set(original_view, 'viewurl', '//piao.ctrip.com/dest/t'+ id +'.html');
                        } else {
                            //其他发布渠道
                            var fromQQWallet = this.$emit('getUrlKey', 'referrer') == 'qqWallet' ? true : false;
                            // var fromQQWallet = this.getUrlKey('referrer') == 'qqWallet' ? true : false;
                            if(fromQQWallet) {
                                // original_view.viewurl = '//m.ctrip.com/webapp/ticket/wx/dest/t' + id + '.html?allianceid=328000&sid=814901&autoawaken=close&popup=close';
                                this.$set(original_view, 'viewurl', '//m.ctrip.com/webapp/ticket/wx/dest/t' + id + '.html?allianceid=328000&sid=814901&autoawaken=close&popup=close');
                            } else {
                                // original_view.viewurl = '//m.ctrip.com/webapp/ticket/dest/t' + id + '.html';
                                this.$set(original_view, 'viewurl', '//m.ctrip.com/webapp/ticket/dest/t' + id + '.html');
                            }
                        }
                    }

                } else {//玩乐
                    if (pageInfo.device == 'app') {
                        // original_view.viewurl = 'ctrip://wireless/h5?path=activity&page=index.html%23%2Fdest%2Ft'+ id +'.html'
                        var urlBase64 = CtripTool.base64Encode('activity/index.html#/dest/t'+id+'.html');
                        this.$set(original_view, 'viewurl', 'ctrip://wireless/h5?url='+ urlBase64 + '&type=1');
                        // this.$set(original_view, 'viewurl', 'ctrip://wireless/h5?path=activity&page=index.html%23%2Fdest%2Ft'+ id +'.html');
                    } else if (pageInfo.device == 'online' && that.getProtocol() == 'http:') {
                        // original_view.viewurl = '//huodong.ctrip.com/activity/'+ id +'.html'
                        this.$set(original_view, 'viewurl', '//huodong.ctrip.com/activity/'+ id +'.html');
                    } else {//h5
                        // original_view.viewurl = '//m.ctrip.com/webapp/activity/dest/t'+ id +'.html'
                        this.$set(original_view, 'viewurl', '//m.ctrip.com/webapp/activity/dest/t'+ id +'.html');
                    }
                }

                if (price != "0") {
                    if($body.hasClass('mod1') || $body.hasClass('mod2')){
                        // configdata_tab.sectionTitle = true;
                        this.$set(configdata_tab, 'sectionTitle', true);
                    }
                    // original_view.view = true;
                    this.$set(original_view, 'view', true);

                    if(this.tanInfor!==undefined){
                        this.tabInfor.emptytab=false;
                    }
                    // console.log(that.currentTabProducts.emptytab)

                }
            }



            totalCount += ticketNumber;
            // 当前tab所有资源已加载完毕
            if (totalCount == currentTabCount) {
                totalCount = 0;
                var index = this.currentTabIndex;
                this.loadstatus[index] = true;
                if(this.tanInfor!==undefined){
                        if(this.tabInfor.emptytab!=false&& this.currentTabIndex!==0){
                    this.$emit('selectCity', 0);
                    $('#J-empty-pop').show();
                    $('#J-empty-mask').show();
                setTimeout("$('#J-empty-pop').hide()",2000)
                setTimeout("$('#J-empty-mask').hide()",2000)
                    this.tabInfor.emptytab=true;
                }
                    }

            }

            request_num += 1;
            if(request_num === 1){
                if($body.hasClass('mod2')){
                    // 模板2 城市导航栏在view显示后设定高度避免滚动抖动
                    var navHeight = $('#J-nav-wrapper').height() || 0;
                    $('#J-ctm-nav').height(navHeight);
                }
                $win.resize();
            }
            split_loading = true;

            if ((document.body.scrollHeight < document.body.offsetHeight)&&request_num < group_ids.length) {
                split_loading = false;
                that._getDataById(group_ids[request_num]);
            }

            if(($body.hasClass('mod3') || !loadResourceOnScroll) && request_num < group_ids.length){
                split_loading = false;
                that._getDataById(group_ids[request_num]);
            }
        },function(err){
            // alert('err' + JSON.stringify(err))
            // console.log(err);
        },this,function(abort){
            // console.log(abort);
        });

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
    }
  }
}
</script>