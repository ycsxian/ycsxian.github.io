// 以下代码请勿动
(function($) {
    var $win = $(window);
    var $body = $('body');
    var $cityLabel;
    var $tab;
    var count = 0;
    var totalCount = 0;
    var currentTabCount = 0;
    var temp, tempAct, tickets;
    var localUrl = window.location.href;

    var channelType;
    var channelActType;
    var emptytab = true

    var ticketImgSize = pageInfo.isOnline ? 'C_302_197' : 'C_262_178'; //原 C_300_252
    var activeImgSize = pageInfo.isOnline ? 'C_364_206' : 'C_280_158'; //原 C_300_256

    var isWidescreen = (document.body.clientWidth > 1025 || window.screen.width > 1025) ? true : false;

    var GeneralValidation = {
        "isIe6": function() {
            return !-[1, ] && !window.XMLHttpRequest;
        }
    };


    if (pageInfo.device == 'online') {
        channelType = '1';
        channelActType = '2';
    } else if (pageInfo.device == 'app') {
        channelType = '3';
        channelActType = '5';
    } else {
        channelType = '2';
        channelActType = '7';
    }

    window.ticApp = {
        tabIndex: 0,
        modType: 1,
        configData: null,
        configPublic: null,
        configStyle: null,
        els: {
            $loading: $('#J-loading'),
            $cityLabel: $('#J-city-select-label'),
            $tab: $('#J-city-select')
        },
        init: function() {
            var that = this;
            $cityLabel = $('#J-city-select-label');
            $tab = $('#J-city-select');
            this.getPageConfig({
                success: function() {
                    that.els.$loading.hide();
                    that.setPageTitle();
                    that.setPageid();
                    that.renderOnlinePageHeader();
                    // 判断活动是否结束
                    if (that.activityIsFinish()) {
                        that.showFinishedPage();
                    } else {
                        that.setPageStyle();
                        that.setPageMod();
                        that.renderHeader();
                        that.registerHandlebarsHelper(); //注册HandlebarsHelper
                        that.renderNav(); //渲染省市选择栏
                        that.renderMain(); //渲染主体景点信息
                        that.modControl(); //mod控制
                        that.renderBtnMore(); //渲染底部查看更多按钮
                        that.renderFooterLink(); //渲染底部广告互链
                        that.provinceSelect(0); //ie不做定位处理，默认定位到第一个tab
                    }
                    that.bindOtherEvents(); //绑定点击等事件
                    that.showMainViewport();
                },
                error: function() {

                }
            });
        },

        getPageConfig: function(settings) {
            var that = this;

            settings = $.extend({
                success: null,
                error: null
            }, settings);

            var topicId = !!(this.getParam('promoteid')) ? this.getParam('promoteid') : set_promoteid;

            $.ajax({
                // url:"getPreviewTopicInfo1.json",//测试
                // url:"http://gateway.m.uat.qa.nt.ctripcorp.com/restapi/soa2/12008/topicInfoQOC",
                // url: goUrl,
                url: "//m.ctrip.com/restapi/soa2/12008/topicInfoQOC",
                data: {
                    "id": parseInt(topicId),
                    "type": 1
                },
                dataType: 'jsonp',
                success: function(result) {
                    if (typeof result === 'string') {
                        result = JSON.parse(result);
                    }
                    // console.log(result);
                    // 设置page相关配置文件
                    that.setPageConfig(result);

                    if (typeof settings.success == 'function') {
                        settings.success(result);
                    }
                }
            });
        },

        setPageConfig: function(data) {
            // alert(data.publicContent);
            this.configPublic = JSON.parse(data.data.publicContent.replace(/\'/g, '"'));
            this.configData = this.mixConfigData(data.data.dataContent, data.data.sysRecommendList);
            this.configStyle = JSON.parse(data.data.cssContent.replace(/\'/g, '"'));
        },

        mixConfigData: function(dataManual, dataRecom) {
            // TODO  将人工录入数据和自动推荐数据拼合到configData中
            var configData;
            configData = JSON.parse(dataManual.replace(/\'/g, '"'));
            // console.log(configData);
            for (var x = 0; x < configData.length; x++) {
                for (var y = 0; y < configData[x].NumList.length; y++) {
                    var temp = _.findWhere(dataRecom, {
                        recommendKey: configData[x].NumList[y].recommendKey
                    });
                    if (temp) {
                        _.each(temp.recommendIdList, function(num, key) {
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
        },

        setPageTitle: function() {
            // 修改页面head信息
            if (document.title === '') {
                document.title = this.configPublic.title;
            }
        },

        setPageStyle: function() {

            var mod = this.getParam('mod');
            if (!mod && localUrl.indexOf('app-mod') !== -1) {
                mod = localUrl.split('app-mod')[1].split('.html')[0];
            }

            mod = mod || '1';
            this.modType = 'mod' + mod;

            $('body').addClass(this.modType);
        },

        modControl: function() {
            var mod = this.getParam('mod') || '';
            this.modType = 'mod' + mod;
            if (this.modType == 'mod1') {
                $('.J-panel-tab').show();
            } else if (this.modType == 'mod2') {
                $('#J-city-select').removeClass('city-select-box').addClass('mod2-tab').show();
                $('#J-city-select ul').removeClass('clearfix').addClass('option-page-background flex-box cleanfloat');
                $('#J-city-select li').removeClass('option-city-text').addClass('flex-box-1');
                $('#J-city-select span').addClass('show');
                $('.city-select-wrapper').hide();
                $('.J-panel-tab').show();
            } else if (this.modType == 'mod3') {
                $('.mod3-tab').show();
                $('.J-section-title').hide();
            }
        },

        setPageMod: function() {
            var source = $("#J-insertStyle-tpl").html(),
                template = Handlebars.compile(source),
                mainTmpl = template(this.configStyle);

            $('#J-insertStyle').html(mainTmpl);
        },

        setPageid: function() {
            var that = this;
            var pageid_online;
            var othersway;
            var strs = window.location.search.split("&");
            for (var i = 0; i < strs.length; i++) {
                if (strs[i].indexOf('referrer') !== -1) {
                    othersway = strs[i].split("=")[1];
                }
            }
            if (!!(othersway) && !!(this.configPublic.otherspid)) {
                pageid_online = this.configPublic.otherspid[othersway].online;
            } else {
                // console.log(this.configPublic.publicData.pageid.online);
                pageid_online = this.configPublic.pageid.online;
            }
            var pageid = pageid_online;
            if (!!pageid) {
                $('#page_id').val(pageid);
            }
        },

        showMainViewport: function() {
            $('#J-main-viewport').show();
        },

        activityIsFinish: function() {
            var currentTime = new Date();
            var endTime = new Date(this.configPublic.endTime);
            return currentTime >= endTime;
        },

        // 加载online公用头尾
        renderOnlinePageHeader: function() {
            // 加载online公用头
            var headerUrl = GeneralValidation.isIe6() ? '//webresource.c-ctrip.com/ResCRMOnline/R1/pageframe/js/SimpleHeaderJS.js' : '//webresource.c-ctrip.com/ResCRMOnline/R1/pageheader/js/IntegratedJS.js'; //ie6使用简头，否则会崩溃

            ticApp._getScript([
                headerUrl
            ]);
        },

        // 活动结束
        showFinishedPage: function() {
            var $announce = $('#J-footer-announce');
            var $finished = $('<div class="container-act-finished"><a href="javascript:void(0);" data-urlh5="//m.ctrip.com/webapp/ticket/index" data-urlapp="ctrip://wireless/h5?path=ticket&page=index.html#/index" data-urlonline="//piao.ctrip.com/"><img src="//pages.ctrip.com/commerce/promote/common/images/background/activity-finished.jpg"/></a></div>');
            // $announce.siblings().hide();
            $('body').addClass('ctm-act-finished');
            $announce.before($finished);
        },
        renderHeader: function() {
            var $header = $('#J-ctm-header');

            if (pageInfo.isOnline) {
                if ($('#J-img-online').length === 0) {
                    $header.append('<div style="background: url(' + this.configPublic.imageurl.onlineback + ') center 0 no-repeat;"><img src="' + this.configPublic.imageurl.onlinefront + '" id="J-img-online"  class="img-online"/></div>');
                }
            }

        },
        //注册HandlebarsHelper
        registerHandlebarsHelper: function() {
            var that = this;
            //注册索引+1的helper
            Handlebars.registerHelper("addOne", function(index) {
                //利用+1的时机，在父级循环对象中添加一个_index属性，用来保存父级每次循环的索引
                this._index = index + 1;
                //返回+1之后的结果
                return index + 1;
            });

            //确定二级标题：文案/图片
            Handlebars.registerHelper("getTemplateType", function(type, name, img_app, img_online) {
                var title_html;
                if (type == 1) {
                    if (isWidescreen && !!img_online) {
                        title_html = '<div class="section-img J-section-title hide"><img class="img-auto J-item-img" src="//pages.ctrip.com/commerce/promote/common/images/loading/spacer.png" data-original="' + img_online + '" /></div>'
                    } else if (!!img_app) {
                        title_html = '<div class="section-img J-section-title hide"><img class="img-auto J-item-img" src="//pages.ctrip.com/commerce/promote/common/images/loading/spacer.png" data-original="' + img_app + '" /></div>'
                    }

                } else {
                    if (!!name) {
                        title_html = '<div class="section-title option-section-title-color J-section-title hide"><h3>' + name + '</h3><div class="line"><i class="i-l"></i><i class="i-r"></i></div></div>'
                    }
                }

                return title_html;
            });

            //确认模板的类型
            Handlebars.registerHelper("modelType", function(type) {
                var type_class;
                var _type = type || 'routine1';
                if (_type == 'routine2') {
                    type_class = 'mod-routine-2';
                } else if (_type == 'key1') {
                    type_class = 'mod-key-1';
                } else if (_type == 'key2') {
                    type_class = 'mod-key-2';
                } else {
                    type_class = 'mod-routine-1';
                }
                return type_class;
            });

            //确认每一景点中图片的尺寸
            Handlebars.registerHelper("modImgSize", function(type) {
                var img_size;
                var _type = type || 'routine1';
                if (_type == 'routine2') {
                    img_size = '182_102';
                } else if (_type == 'key1') {
                    img_size = '280_158';
                } else if (_type == 'key2') {
                    img_size = '200_200';
                } else {
                    img_size = '200_200';
                }
                return img_size;
            });

            //立即抢购按钮显示与否
            Handlebars.registerHelper("showButtonBuy", function(type) {
                var show;
                var _type = type || 'routine1';
                if ((_type == 'key1' || _type == 'key2' || _type == 'key3') && !isWidescreen) {
                    show = '<div class="viewpoint-status-buy p-status J-status">立即抢购</div>';
                } else {
                    show = '';
                }
                return show;
            });

            Handlebars.registerHelper("showLabel", function(type, label, labelColor) {
                var _temp;
                var _type = type || '';
                var _label = label || '';
                var _labelColor = labelColor || 'orange';
                if (_type == 1 && !!_label) {
                    if (_label.length > 6) {
                        _temp = '<div class="mod-label mod-label-long  mod-label-color-{1}">{0}</div>'.format(_label, _labelColor);
                    } else {
                        _temp = '<div class="mod-label mod-label-short mod-label-color-{1}">{0}</div>'.format(_label, _labelColor);
                    }
                } else if (_type == 2) {
                    _temp = '<div class="mod-label mod-label-flag mod-label-discount"><span class="J-mod-label-discount percent"></span>折<i></i></div>';
                } else if (_type == 3) {
                    _temp = '<div class="mod-label mod-label-money mod-label-money-little"><span class="lijian">省</span><span class="money J-mod-label-money"></span></div>';
                }
                return _temp;

            });

            //若有tab，默认第一个tab为选中状态
            Handlebars.registerHelper("isFirstTrigger", function(index) {
                var Klass = (index == 0) ? 'option-tab-current-background margin-dis' : '';
                return Klass;
            });

            //若有tab，则显示第一个panel
            Handlebars.registerHelper("isFirstPanel", function(index) {
                var Klass = (index == 0) ? 'show' : 'hide';
                return Klass;
            });
            // 若有tab，tab标签设置换行classs
            Handlebars.registerHelper("detectString", function(string, len) {
                var Klass;
                var _string = string || '';
                var _len = typeof(len) == 'number' ? len : 4;
                if (!_string) {
                    Klass = '';
                } else if (_string.length > _len && pageInfo.device !== 'online') {
                    Klass = 'mod-break-words';
                }
                return Klass;
            });


            // 若有tab，tab标签超过4字换行
            Handlebars.registerHelper("breakWords", function(string, len) {
                var html;
                var _string = string || '';
                var temp = [];
                var _len = typeof(len) == 'number' ? len : 4;
                if (!_string) {
                    html = '';
                } else if (_string.length > _len) {
                    if (pageInfo.device !== 'online') {
                        html = _string.substring(0, _len) + '<br/>' + _string.substring(_len);
                    } else {
                        html = _string.substring(0, _len) + _string.substring(_len);
                    }
                } else {
                    html = _string;
                }
                return html;
            });

            Handlebars.registerHelper("options_equal_width", function(index) {
                var option_length = that.configData[index]['NumList'].length;
                if (option_length == 1) {
                    return 'hide';
                } else {
                    return "tab-count" + option_length;
                }
            });
            Handlebars.registerHelper("cityNum_equal_width", function() {
                return "tab-count" + that.configData.length;
            });
            Handlebars.registerHelper("isFirstCity", function(index) {
                return index == 0 ? " margin-dis" : "";
            });

            Handlebars.registerHelper("fromQQWallet", function(sid) {
                return '//m.ctrip.com/webapp/ticket/dest/t' + sid + '.html';
            });

        },
        //渲染省市选择栏
        renderNav: function() {
            var NavSource = $("#spotListNav").html(),
                template = Handlebars.compile(NavSource),
                spotsTmpl = template(this.configData);
            $('#J-city-select').html(spotsTmpl);

            if (this.configPublic.navTxt) {
                $('.J-nav-txt').html(this.configPublic.navTxt);
            }

            if (this.configData.length > 1) {
                // 资源若不止1个省市，则显示选择框，否则隐藏
                $('#J-ctm-nav').show();
                // provinceSelect();
            }
        },
        //渲染主体景点信息
        renderMain: function() {
            var source = $("#J-main-tpl").html(),
                template = Handlebars.compile(source),
                mainTmpl = template(this.configData);

            $('#J-main-wrapper').html(mainTmpl);
            $('.J-tab').children().removeClass('flex-box').addClass('cleanfloat');
        },
        //渲染底部查看更多按钮
        renderBtnMore: function() {
            var source = $("#J-btn-more-tpl").html(),
                template = Handlebars.compile(source),
                mainTmpl = template(this.configPublic.buttonMore);
            $('#J-btn-more').html(mainTmpl);
        },
        //渲染底部广告互链
        renderFooterLink: function() {
            var source = $("#J-footer-link-tpl").html(),
                template = Handlebars.compile(source),
                mainTmpl = template(this.configPublic.footerLink);
            if (!!this.configPublic.footerLink && !!this.configPublic.footerLink[0] && !!this.configPublic.footerLink[0].image) {
                $('#J-ctm-footer').html(mainTmpl);
            }
        },

        bindOtherEvents: function() {
            var that = this;

            $('body').on('click', function() {
                // 隐藏省市选项框
                if (pageInfo.device != 'online') {
                    $tab.hide();
                }

            }).on('click', 'a', function(e) {
                // 引用lizard.hybrid.js后a链接无法使用原生跳转，改使用open_url跳转
                e.preventDefault();
                var device = pageInfo.device;
                var $this = $(this);
                var goUrl = $this.data('url{0}'.format(device));
                var targetMode = (/ctrip:/.test(goUrl) == true) ? 1 : 2;
                // CtripUtil.app_open_url($this.attr('href'));
                goUrl = goUrl || $this.data('urlh5') || $this.attr('href');
                if (device == 'h5') {
                    goUrl += '?from=' + window.location.href;
                }
                // 若url去除了协议头，则按照当前url重新加上
                if (goUrl.indexOf('//') == 0) {
                    var currentUrl = window.location.href;
                    if (currentUrl.indexOf('http:') == 0) {
                        goUrl = 'http:' + goUrl;
                    } else if (currentUrl.indexOf('https:') == 0) {
                        goUrl = 'https:' + goUrl;
                    }
                }

                if (device == 'online' && pageInfo.isIE) {
                    // 框架有问题ie下用open_url无法跳转
                    window.location.href = goUrl;
                } else {
                    cHybridShell.Fn('open_url').run(goUrl, targetMode);
                }


            }).on('mouseenter', '.J-item-mod', function() {
                var $this = $(this);
                $this.addClass('item-mod-hover');
            }).on('mouseleave', '.J-item-mod', function() {
                var $this = $(this);
                $this.removeClass('item-mod-hover');
            });


            // 省市选择框显示隐藏
            $('#J-city-select-wrapper').on('click', function(e) {
                e.stopPropagation();
                $tab.toggle();
            });

            $('#J-main-wrapper').on('click', '.J-tab-trigger', function() {
                var $this = $(this);
                var index = $this.index();
                $('.J-section-title').hide();
                var $tab = $this.closest('.J-tab');
                var $panel = $tab.siblings('.J-panel-tab');
                $this.siblings().removeClass('option-tab-current-background');
                $this.addClass('option-tab-current-background');
                $panel.hide().eq(index).show();
                $win.resize();
            });


            // 省市tab切换
            that.els.$tab.on('click', 'li', function() {
                that.tabIndex = $(this).index();
                that._navTab(this);
            });

        },
        // 匹配省份
        provinceSelect: function(index) {
            var provinceIndex = index || 0;
            ticApp._navTab($tab.find('li').eq(provinceIndex));
        },
        provinceCheck: function(province) {
            var $provinceList = $tab.find('li');
            for (var index = 0; index < $provinceList.length; index++) {
                if (province.indexOf($provinceList.eq(index).text()) > -1) {
                    ticApp.provinceSelect(index);
                    return;
                }

            }
            ticApp.provinceSelect();
        },
        //动态加载js文件
        _getScript: function(url) {
            var head = document.getElementsByTagName('head')[0];

            for (var i = url.length - 1; i >= 0; i--) {
                var js = document.createElement('script');
                js.setAttribute('type', 'text/javascript');
                js.setAttribute('src', url[i]);
                head.appendChild(js);
            }
        },

        _collectTicSid: function(list) {
            //var xx={"ssid":138822,"rid":[3025816, 3025817,3027778],"rt":2};
            var arr = [];
            $.each(list, function(index, item) {
                var t = [];
                var temp = {};
                if (!!item.sid) {
                    temp.ssid = item.sid;
                    if (!!item.rid) {
                        t.push(item.rid);
                        temp.rid = t;
                        temp.rt = 2;
                    } else {
                        temp.rt = 1;
                    }
                    arr.push(temp);
                }

            });

            return arr;
        },
        _collectActAid: function(list) {
            var arr = [];
            // console.dir(list)
            $.each(list, function(index, item) {
                if (!!item.aid) {
                    var t = [];
                    var temp = {
                        "aid": item.aid.replace(/\s+/g, "")
                    };
                    if (!!item.optionid) {
                        t.push(item.optionid.replace(/\s+/g, ""));
                        temp.optionid = t;
                        temp.ot = 2;
                    } else {
                        temp.ot = 1;
                    }
                    arr.push(temp);
                };
            });

            return arr;
        },

        //nav切换
        _navTab: function(obj) {

            var $this = $(obj),
                thisIndex = this.tabIndex;

            $this.find('span').addClass("option-cityselect-background");
            $this.siblings().find('span').removeClass("option-cityselect-background");
            $cityLabel.text($this.text());


            //切换样式
            $('.J-panel').hide().removeClass("J-panel-active").eq(thisIndex).show().addClass("J-panel-active");
            $('.J-panel').find('.J-sub-tab').removeClass('scroll-sticky').removeAttr('style');
            if (!isWidescreen) {
                $(window).scrollTop(0);
            }
            this._loadCurrentTabResource($this);

        },

        _tidyIdList: function() {
            var thisIndex = this.tabIndex;
            var _list = this.configData[thisIndex].NumList;
            var _tempList = [];
            $.each(_list, function(index, item) {
                var i = index;
                var _ids = item.ids;
                // _tempList = _tempList.push(_ids)
                $.each(_ids, function(index, item) {
                    var j = index;
                    _tempList.push(item);
                });
            });

            return _tempList;
        },


        _loadResource: function($obj, list) {
            var that = this;
            var $tab = $obj;
            var ImgSize = isWidescreen ? 'C_364_206' : 'C_200_200'; //原 C_300_256
            var ajax_num = 1;
            var headValue = localStorage.HEADSTORE ? (JSON.parse(localStorage.HEADSTORE)).value : {};
            group_ids = [];
            request_num = 0;
            //配置门票id
            var temp = {
                "head": headValue,
                "debug": false,
                "imgsize": ImgSize,
                "tkts": [],
                "acts": []
            };
            if (list.length === 0 && ($tab.index() !== 0)) {
                $tab.hide();
                this.tabIndex = 0;
                ticApp._navTab($tab.find('li').eq(0));
                // $('.J-panel').hide().removeClass("J-panel-active").eq(0).show().addClass("J-panel-active");
                // $('.J-panel').find('.J-sub-tab').removeClass('scroll-sticky').removeAttr('style');
                $('#J-empty-pop').show();
                $('#J-empty-mask').show();
                setTimeout("$('#J-empty-pop').hide()", 2000)
                setTimeout("$('#J-empty-mask').hide()", 2000)


            }
            $.each(list, function(index, item) {
                var t = [];
                var id = {};
                if (!!item.sid) {
                    id.tktid = item.sid.replace(/\s+/g, "");
                    if (!!item.rid) {
                        t.push(item.rid.replace(/\s+/g, ""));
                        id.opid = t;
                    }
                    temp.tkts.push(id);
                } else {
                    id.pid = item.aid.replace(/\s+/g, "");
                    if (!!item.optionid) {
                        t.push(item.optionid.replace(/\s+/g, ""));
                        id.opid = t;
                    }
                    temp.acts.push(id);
                }
                if ((index + 1 == 6 * ajax_num) || (index == list.length - 1)) {
                    group_ids.push(temp);
                    if (ajax_num == 1) {
                        that._getDataById(temp, $tab);
                    }
                    temp = {
                        "head": headValue,
                        "debug": false,
                        "imgsize": ImgSize,
                        "tkts": [],
                        "acts": []
                    };
                    ajax_num += 1;
                }
            });
        },

        // 加载当前tab资源
        _loadCurrentTabResource: function($obj, index) {
            var $tab = $obj;
            var thisIndex = index;

            // 正在加载中 return
            if ($tab.data('loading') && $tab.data('loaded')) {
                return;
            }

            //加载中
            $tab.data('loading', true);

            //判断 如果加载不是完成状态
            if (!$tab.data('loaded')) {
                var list = ticApp._tidyIdList(thisIndex);
                // 当前tab中所有景点数量
                totalCount = 0;
                currentTabCount = list.length;
                ticApp._loadCurrentTabTicketResource($tab, list);
                ticApp._loadCurrentTabActResource($tab, list);
            }
        },
        // 加载当前tab门票资源
        _loadCurrentTabTicketResource: function($obj, list) {
            var $tab = $obj;
            var ticket_query;

            //配置门票id
            temp = {
                "cl": channelType,
                "imgs": ticketImgSize,
                "reqs": []
            };
            if (list.length === 0 && ($tab.index() !== 0)) {

                $tab.hide();
                this.tabIndex = 0;
                // ticApp._navTab($tab.find('li').eq(0));
                this.provinceSelect(0)

                //     alert(1)



                // $tab.find('li').eq(0).find('span').hide()
                $('#J-empty-pop').show();
                $('#J-empty-mask').show();
                setTimeout("$('#J-empty-pop').hide()", 2000)
                setTimeout("$('#J-empty-mask').hide()", 2000)


            }

            var ticketsIds = ticApp._collectTicSid(list);


            for (var k = 0; k < ticketsIds.length; k++) {

                temp.reqs.push(ticketsIds[k]);

                if (temp.reqs.length == 20 || k == ticketsIds.length - 1) {
                    var p = 0;
                    ticket_query = temp;

                    ticket_query = JSON.stringify(ticket_query);

                    //执行ajax
                    ticApp._getDataByIdTicket(ticket_query, $tab);

                    temp.reqs = [];
                    p++;
                }
            }


        },
        // 加载当前tab玩乐资源
        _loadCurrentTabActResource: function($obj, list) {

            var $tab = $obj;
            var active_query;

            tempAct = {
                "dcid": channelActType,
                "imgsize": activeImgSize,
                "idArray": [],
                "actids": ""
            };
            if (list.length === 0 && ($tab.index() !== 0)) {

                $tab.hide();
                this.tabIndex = 0;
                // ticApp._navTab($tab.find('li').eq(0));
                this.provinceSelect(0)
                    // $('.J-panel').hide().removeClass("J-panel-active").eq(0).show().addClass("J-panel-active");
                    // $('.J-panel').find('.J-sub-tab').removeClass('scroll-sticky').removeAttr('style');
                $('#J-empty-pop').show();
                $('#J-empty-mask').show();
                setTimeout("$('#J-empty-pop').hide()", 2000)
                setTimeout("$('#J-empty-mask').hide()", 2000)


            }

            var activesIds = ticApp._collectActAid(list);

            for (var k = 0; k < activesIds.length; k++) {

                // activesIds[k] = JSON.stringify(activesIds[k]);

                tempAct.idArray.push(activesIds[k].aid);

                if (tempAct.idArray.length == 5 || k == activesIds.length - 1) {

                    tempAct.actids = tempAct.idArray.join(",");

                    delete tempAct.idArray;

                    active_query = tempAct;

                    //执行ajax
                    ticApp._getDataByIdActive(active_query, $tab, activesIds);

                    // console.log(active_query);

                    tempAct.idArray = [];
                }
            }

        },
        //ajax-门票
        _getDataByIdTicket: function(data, $this) {
            var that = this;
            var ticketNumber = JSON.parse(data).reqs.length;
            $.ajax({
                url: '//piao.ctrip.com/Thingstodo-Booking-ShoppingWebSite/api/MarketingApi',
                data: {
                    para: data
                },
                dataType: 'jsonp',
                type: 'get',
                cache: true,
                ContentType: 'application/json',
                success: function(data) {
                    for (var i = 0; i < data.sinfos.length; i++) {
                        var _sinfo = data.sinfos[i] || '';
                        var ticId = _sinfo.ssid,
                            imgUrl = !!_sinfo.img ? _sinfo.img.replace(/(http|https):/i, "") : '',
                            Url = _sinfo.url,
                            ticName = _sinfo.snm,
                            cityName = _sinfo.cnm,
                            ticPrice = _sinfo.price,
                            ticMPrice = _sinfo.mprice,
                            ticDiscount,
                            dataPrice = 0,
                            dataMPrice = 0,
                            dataPriceArray = _sinfo.Options,
                            dataPriceResult = 0,
                            dataMPriceResult = 0;
                        var $domTicId, ticOffPrice;

                        //判断资源ID数据是否为空，不为空则取资源数据
                        if (_sinfo.ress && _sinfo.ress[0] != null) {
                            ticPrice = _sinfo.ress[0].rprice,
                                ticMPrice = _sinfo.ress[0].rmprice;
                            $domTicId = $('.J-tic-item-{0}-{1}'.format(ticId, _sinfo.ress[0].rid));
                        } else {
                            ticPrice = _sinfo.price,
                                ticMPrice = _sinfo.mprice;
                            $domTicId = $('.J-tic-item-{0}'.format(ticId));
                        }



                        ticOffPrice = Math.round(ticMPrice - ticPrice);

                        ticDiscount = Math.round(ticPrice / ticMPrice * 100) / 10;

                        $domTicId.find('img.J-item-img').attr('data-original', imgUrl);
                        if ((ticDiscount <= 0 || ticDiscount >= 10) && $domTicId.find('.J-mod-label-discount').length > 0) {
                            $domTicId.find('.J-mod-label').hide();
                        } else {
                            $domTicId.find('.J-mod-label-discount').text(ticDiscount);
                        }

                        // 非一元票显示“起”字
                        if (ticPrice === 1) {
                            $domTicId.find('.J-price-begin-label').hide();
                        }

                        $domTicId.find('.J-mod-label-money').html(ticOffPrice + '<span class="mod-label-money-yuan">元</span>');
                        if ($domTicId.find('.J-mod-label-money').length > 0) {
                            if (ticOffPrice <= 0) {
                                $domTicId.find('.J-mod-label').hide();
                            } else {
                                var $label = $domTicId.find('.J-mod-label-money');
                                var stringprice = String(ticOffPrice);
                                if (stringprice.length > 3) {
                                    var offprice = stringprice.substring(0, stringprice.length - 3) + ',' + stringprice.slice(-3),
                                        $labelDiv = $label.parent();
                                    $labelDiv.addClass('mod-more-money mod-label-flag-more').removeClass('mod-label-money-little');
                                    $labelDiv.find('i').addClass('mod-more-money-i');
                                    $label.addClass('mod-label-money-more').html('<span class="mod-label-money-rmb">&yen</span>' + offprice);
                                } else if (stringprice.length < 3) {
                                    $label.addClass('mod-label-money-two');
                                }
                            }
                        }
                        $domTicId.find('h4').text(ticName);
                        var firstIndex = that.tabIndex;
                        var secondIndex = $domTicId.parent().index() - 1;

                        if (secondIndex === (-2)) {
                            $domTicId.find('.J-city-name').text(cityName).parent('.mod-city').css('visibility', 'visible');
                        } else {
                            if (that.configData[firstIndex].NumList[secondIndex] !== undefined) {
                                if (!cityName || that.configData[firstIndex].NumList[secondIndex].showCitylabel === false) {
                                    $domTicId.find('.J-city-name').text(cityName).parent('.mod-city').css('visibility', 'invisible');
                                } else {
                                    $domTicId.find('.J-city-name').text(cityName).parent('.mod-city').css('visibility', 'visible');
                                }
                            }

                        }
                        // if(!!cityName){
                        //     $domTicId.find('.J-city-name').text(cityName).parent('.mod-city').css('visibility', 'visible');
                        // }
                        if (!!cityName) {
                            $domTicId.find('.J-city-name').text(cityName).parent('.mod-city').css('visibility', 'visible');
                        } else {
                            $domTicId.find('.mod-city').hide();
                        }

                        if (ticMPrice != '0' && ticMPrice > ticPrice) {
                            $domTicId.find('.J-price-market').text(ticMPrice);
                        } else {
                            // 若市场价为0且需显示省**元标签 则隐藏标签
                            if ($domTicId.find('.J-mod-label-money').length > 0) {
                                $domTicId.find('.J-mod-label').hide();
                            }
                            $domTicId.find('.mod-price-market').hide();
                        }

                        $domTicId.find('.J-price-now').text(ticPrice);
                        if (ticPrice != "0" && (_sinfo !== "")) {
                            $domTicId.siblings('.J-section-title').show();
                            $domTicId.css('display', 'block');

                            emptytab = false;
                        }
                        if (_sinfo === "") {
                            emptytab = true;
                        }
                    }

                    if (emptytab === false) {
                        emptytab = true;
                    } else if (($this.index() !== 0) && ($this.index() !== -1)) {
                        ticApp.els.$tab.find('li').eq($this.index()).hide();

                        // this.els.$tab.find('li').eq($this.index()).hide();
                        this.tabIndex = 0
                        ticApp._navTab($tab.find('li').eq(0));
                        // this._navTab(this.els.$tab.find('li').eq(0));
                        // alert(2)
                        $('#J-empty-pop').show();
                        $('#J-empty-mask').show()
                        setTimeout("$('#J-empty-pop').hide()", 2000)
                        setTimeout("$('#J-empty-mask').hide()", 2000)

                    } else if ($this.index() === -1) {
                        this.tabIndex = 0

                        // alert(2)
                        $('#J-empty-pop').show();
                        $('#J-empty-mask').show()
                        setTimeout("$('#J-empty-pop').hide()", 2000)
                        setTimeout("$('#J-empty-mask').hide()", 2000)
                    }
                    totalCount += ticketNumber;
                    // 当前tab所有资源已加载完毕
                    if (totalCount == currentTabCount) {
                        $this.data('loaded', true);
                        totalCount = 0;
                    }

                    that._imgLazyload();

                },
                error: function() {

                }
            });
        },
        //ajax-玩乐
        _getDataByIdActive: function(data, $this, activesIds) {
            var that = this;
            var activeNumber = data.actids.split(",").length;
            $.ajax({
                url: '//huodong.ctrip.com/Activity-Booking-OnlineWebSite/Marketing',
                data: data,
                dataType: 'jsonp',
                type: 'get',
                cache: true,
                ContentType: 'text/plain',
                success: function(data) {
                    for (var i = 0; i < data.ActInfo.length; i++) {
                        var _ainfo = data.ActInfo[i] || '', //这个是get到的各种套餐（分批次），每种有不止一个OptionID
                            actId = _ainfo.ActivityID,
                            actName = _ainfo.ActivityName,
                            imgUrl = !!_ainfo.ImgURL ? _ainfo.ImgURL.replace(/(http|https):/i, "") : '',
                            cityName = _ainfo.CityName,
                            $domActId = $('.J-ttd-item-{0}'.format(actId)),
                            actPrice = _ainfo.Price,
                            actMPrice = _ainfo.MarketPrice,
                            actOffPrice,
                            ttdDiscount,
                            optId;

                        for (k = 0; k < activesIds.length; k++) { //通过configdata获取的aid获取相对应的optid（唯一值||undefined）
                            if (activesIds[k].aid == actId) {
                                optId = activesIds[k].optionid;
                            }
                        }

                        //判断optionid数据是否为空，不为空则取optionid数据
                        //新增汇率判断，不为0时换算成相对应的RMB
                        if (!!optId && _ainfo.Options && _ainfo.Options[0] != null) {
                            $domActId = $('.J-ttd-item-{0}-{1}'.format(actId, optId));
                            for (j = 0; j < _ainfo.Options.length; j++) { //遍历各种套餐里面的OptionID
                                if (_ainfo.Options[j].OptionID == optId) { //与configdata里的optid匹配
                                    actPrice = _ainfo.Options[j].Price,
                                        actName = _ainfo.Options[j].OptionName,
                                        actMPrice = (_ainfo.Options[j].MarketPriceCurrencyRate == 0) ? (_ainfo.Options[j].MarketPrice) : (_ainfo.Options[j].MarketPrice * _ainfo.Options[j].MarketPriceCurrencyRate.toFixed(0));
                                }
                            }
                        }


                        // 计算减免
                        actOffPrice = Math.round(actMPrice - actPrice);

                        //计算折扣
                        ttdDiscount = Math.round(actPrice / actMPrice * 100) / 10;


                        // 若折扣异常则隐藏折扣标签
                        if ((ttdDiscount <= 0 || ttdDiscount >= 10) && $domActId.find('.J-mod-label-discount').length > 0) {
                            $domActId.find('.J-mod-label').hide();
                        } else {
                            $domActId.find('.J-mod-label-discount').text(ttdDiscount);
                        }

                        // 非一元票显示“起”字
                        if (actPrice === 1) {
                            $domActId.find('.J-price-begin-label').hide();
                        }

                        // $domActId.attr('href',jumpUrl);
                        // $domActId.attr('data-appurl','');
                        $domActId.find('img.J-item-img').attr('data-original', imgUrl);
                        $domActId.find('.J-mod-label-money').html(actOffPrice + '<span class="mod-label-money-yuan">元</span>');
                        if ($domActId.find('.J-mod-label-money').length > 0) {
                            if (actOffPrice === 0) {
                                $domActId.find('.J-mod-label').hide();
                            } else {
                                var $label = $domActId.find('.J-mod-label-money');
                                var stringprice = actOffPrice + '';
                                if (stringprice.length > 3) {
                                    var offprice = stringprice.substring(0, stringprice.length - 3) + ',' + stringprice.slice(-3),
                                        $labelDiv = $label.parent();
                                    $labelDiv.addClass('mod-more-money mod-label-flag-more').removeClass('mod-label-money-little');
                                    $labelDiv.find('i').addClass('mod-more-money-i');
                                    $label.addClass('mod-label-money-more').html('<span class="mod-label-money-rmb">&yen</span>' + offprice);
                                } else if (stringprice.length < 3) {
                                    $label.addClass('mod-label-money-two');
                                }
                            }
                        }
                        $domActId.find('h4').text(actName);


                        var firstIndex = that.tabIndex;
                        var secondIndex = $domActId.parent().index() - 1;
                        if (secondIndex === (-2)) {
                            $domActId.find('.J-city-name').text(cityName).parent('.mod-city').css('visibility', 'visible');
                        } else {
                            if (that.configData[firstIndex].NumList[secondIndex] !== undefined) {
                                if (!cityName || that.configData[firstIndex].NumList[secondIndex].showCitylabel === false) {
                                    $domActId.find('.J-city-name').text(cityName).parent('.mod-city').css('visibility', 'invisible');
                                } else {
                                    $domActId.find('.J-city-name').text(cityName).parent('.mod-city').css('visibility', 'visible');
                                }

                            }

                        }
                        // if(!!cityName){
                        //     $domActId.find('.J-city-name').text(cityName).parent('.mod-city').css('visibility', 'visible');
                        // }
                        if (!!cityName) {
                            $domActId.find('.J-city-name').text(cityName).parent('.mod-city').css('visibility', 'visible');
                        } else {
                            $domActId.find('.mod-city').hide();
                        }

                        if (actMPrice != "0" && actMPrice > actPrice) {
                            $domActId.find('.J-price-market').text(actMPrice);
                        } else {
                            // 若市场价为0且需显示省**元标签 则隐藏标签
                            if ($domActId.find('.J-mod-label-money').length > 0) {
                                $domActId.find('.J-mod-label').hide();
                            }
                            $domActId.find('.mod-price-market').hide();
                        }

                        $domActId.find('.J-price-now').text(actPrice);
                        if (actPrice != "0" && _ainfo !== "") {
                            $domActId.siblings('.J-section-title').show();
                            $domActId.css('display', 'block');
                            emptytab = false;
                        }
                        if (_ainfo === "") {
                            emptytab = true
                        }
                    }
                    if (emptytab === false) {
                        emptytab = true;
                    } else if (($this.index() !== 0) && ($this.index() !== -1)) {
                        ticApp.els.$tab.find('li').eq($this.index()).hide();

                        // this.els.$tab.find('li').eq($this.index()).hide();
                        this.tabIndex = 0
                        ticApp._navTab($tab.find('li').eq(0));
                        // this._navTab(this.els.$tab.find('li').eq(0));
                        // alert(2)
                        $('#J-empty-pop').show();
                        $('#J-empty-mask').show()
                        setTimeout("$('#J-empty-pop').hide()", 2000)
                        setTimeout("$('#J-empty-mask').hide()", 2000)

                    } else if ($this.index() === -1) {
                        this.tabIndex = 0

                        // alert(2)
                        $('#J-empty-pop').show();
                        $('#J-empty-mask').show()
                        setTimeout("$('#J-empty-pop').hide()", 2000)
                        setTimeout("$('#J-empty-mask').hide()", 2000)
                    }

                    totalCount += activeNumber;
                    // 当前tab所有资源已加载完毕
                    if (totalCount == currentTabCount) {
                        $this.data('loaded', true);
                        totalCount = 0;
                    }
                    that._imgLazyload();
                }
            });
        },
        _imgLazyload: function() {
            if (typeof $.fn.lazyload == 'function') {
                $('.J-item-img').lazyload();
            }
            // $win.resize();
        },
        getParam: function(key) {
            var list = this.getPageParams(location.href);
            return list[key];
        },

        getPageParams: function(url) {
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
        }
    };
    ticApp.init();

})(jQuery);