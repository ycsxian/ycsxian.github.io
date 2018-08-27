define(function(){

    var componentsData = {
			produstlist:{
				config_data:[],
				config_css:{},
				config_product:{},
				config_pub:{
					pageInfo_device:'',
					show_sold_out:'',
					location:''
				},
				cityId:1,
				tabType:1
			},
			singleproduct:{
				config_data:[],
				config_css:{},
				graphic_details:{},
				config_pub:{
					pageInfo_device:'',
					show_sold_out:'',
				}
			},
			pagegraphicdetail:{
				config_data:[],
				config_css:{},
				graphic_details:{},
				config_pub:{
					pageInfo_device:'',
					show_sold_out:'',
				}
			},
			coupon:{
				config_coupon:{},
				config_css:{},
				config_pub:{
					pageInfo_device:'',
				},
				config_draw:{

			      code:{
			        '0':{
			          status:"success",
			          info:"中奖成功"
			        },
			        '5001':{
			          status:"drawn-empty",
			          info:"优惠券补仓中···<br />请稍后再试"
			        },
			        '5002':{
			          status:"sys-error",
			          info:"抱歉，网络故障，请稍后再试！"
			        },
			        '5003':{
			          status:"has-drawn",
			          info:"您已领取过了<br />该优惠券！"
			        },
			        'sysError':{
			          status:"sys-error",
			          info:"活动太火爆，请稍后再试"
			        },
			        'loading':{
			          status:"loading",
			          info:"领取中..."
			        }
			      }
				},
			},
			bannerimage:{
				image_url:{},
				config_pub:{
					pageInfo_device:'',
				}
			},
			btnMore:{
				setButtomMore:'',
				buttonMore:[],
				config_pub:{
					btn_bg:'',
					citymap:'',
					citymap_code:''
				}

			},
			configStyleHtml:{
				//通用模块颜色,H5和app页面背景色/*页面整体背景色 标题栏背景色*/
				bg:'@media screen and (max-width:1025px){.option-page-background {background-color:{{this.c1_1}};}/*H5和app*/}\n\
@media screen and (min-width:1025px){.option-page-background {background-color:{{this.c1_2}};}/*online*/}',
				///*查看更多按钮背景色\文字颜色*/
				btnMore:'.option-button-view-more-background {background-color:{{this.c2}};}',

				view:{
					///*现价文案颜色*//*现价价格颜色*//*定位城市标签配色*//*重点1和重点2立即抢购按钮配色:背景颜色、文字颜色*/
					pub:'.option-label-price-color {color:{{this.c3}};}.option-price-color {color:{{this.c4}};}\n\
.option-city-label-bg-color {background: #FD9A00 !important;}\n\
.option-city-label-border-color {border-color:#FD9A00 !important;}\n\
.option-city-label-border-color:after {border-top-color:#FD9A00 !important;}\n\
.option-button-bg-color {background-color: {{this.c6}};color: {{this.c7}};}',

					///*模板1*/
					mod1:'.mod1 .city-select-wrapper .txt {color: {{this.mod1.m1_1}};}/*选择身边省市文字颜色*/\n\
.mod1 .city-select .select {color:{{this.mod1.m1_2}};}/*当前省市文字颜色*/\n\
.mod1 .arrow-down {border-color: transparent {{this.mod1.m1_7}} {{this.mod1.m1_7}} transparent;}/*右边小箭头颜色*/\n\
.mod1 .option-cityselect-background {background-color: {{this.mod1.m1_3}};color:{{this.mod1.m1_4}};}/*省市选择框当前城市背景色\文字颜色*/\n\
.mod1 .option-city-text {color: {{this.mod1.m1_5}};}/*省市选择框默认文字颜色*/\n\
.mod1 .option-section-title-color {color:{{this.mod1.m1_6}};}/*标题栏文字颜色*/\n\
@media screen and (max-width:1025px) {\n\
.mod1 .ctm-nav {background:{{this.mod1.m1_9}};}/*选择身边省市背景色*/\n\
.mod1 .section-title {background-image: -webkit-linear-gradient(right, {{this.c1_1}}, {{this.c1_1}} .1rem, transparent .1rem, transparent),-webkit-linear-gradient(left, {{this.c1_1}}, {{this.c1_1}} .1rem, transparent .1rem, transparent),-webkit-linear-gradient(top, {{this.c1_1}}, {{this.c1_1}} 18px, {{this.mod1.m1_8}} 18px, {{this.mod1.m1_8}} 19px, {{this.c1_1}} 19px, {{this.c1_1}});\n\
background-image: -o-linear-gradient(right, {{this.c1_1}}, {{this.c1_1}} .1rem, transparent .1rem, transparent),-o-linear-gradient(left, {{this.c1_1}}, {{this.c1_1}} .1rem, transparent .1rem, transparent),-o-linear-gradient(top, {{this.c1_1}}, {{this.c1_1}} 18px, {{this.mod1.m1_8}} 18px, {{this.mod1.m1_8}} 19px, {{this.c1_1}} 19px, {{this.c1_1}});\n\
background-image: linear-gradient(to left, {{this.c1_1}}, {{this.c1_1}} .1rem, transparent .1rem, transparent),linear-gradient(to right, {{this.c1_1}}, {{this.c1_1}} .1rem, transparent .1rem, transparent),linear-gradient(top, {{this.c1_1}}, {{this.c1_1}} 18px, {{this.mod1.m1_8}} 18px, {{this.mod1.m1_8}} 19px, {{this.c1_1}} 19px, {{this.c1_1}});}/*分栏标题背景图案*/\n\
.mod1 .section-title::before {content:"";position:absolute;display:inline-block;width:5px;height:5px;background:{{this.mod1.m1_8}};border-radius:100%;margin-top:16px;z-index:1;left:.1rem;}/*分栏标题背景图案*/\n\
.mod1 .section-title::after {content:"";position:absolute;display:inline-block;width:5px;height:5px;background:{{this.mod1.m1_8}};border-radius:100%;z-index:1;right: .1rem;margin-top: 16px;}/*分栏标题背景图案*/\n\
.mod1 .section-title h3 {background: {{this.mod1.m1_8}};}/*分栏标题背景图案*/}',

					///*模板2*/
					mod2:'.mod2 .option-section-title-color {color:{{this.mod2.m2_1}};}/*标题栏文字颜色*/\n\
                        .mod2 .mod2-tab .option-cityselect-background {background-color: {{this.mod2.m2_2}};color:{{this.mod2.m2_3}};}/*当前Tab背景色\文字颜色*/\n\
.mod2 .mod2-tab .option-page-background {background-color: {{this.mod2.m2_8}};}/*Tab背景色*/\n\
.mod2 .mod2-tab .tab-type-2-border {border-color: {{this.mod2.m2_5}};}/*下边框颜色*/\n\
.mod2 .mod2-tab .selected-tab-tweak {border-color: {{this.mod2.m2_3}};}/*下边框颜色*/\n\
.mod2 .border-none {border-color: {{this.mod2.m2_2}};}/*下边框颜色*/\n\
.mod2 .mod2-tab li {color: {{this.mod2.m2_4}};}/*未选中Tab默认文字颜色*/\n\
.mod2 .mod2-tab li span {border-color: {{this.mod2.m2_5}};background: {{this.mod2.m2_6}};}/*未选中Tab默认边框颜色、背景颜色*/\n\
@media screen and (max-width:1025px) {\n\
.mod2 .section-title {background-image: -webkit-linear-gradient(right, {{this.c1_1}}, {{this.c1_1}} .1rem, transparent .1rem, transparent),-webkit-linear-gradient(left, {{this.c1_1}}, {{this.c1_1}} .1rem, transparent .1rem, transparent),-webkit-linear-gradient(top, {{this.c1_1}}, {{this.c1_1}} 18px, {{this.mod2.m2_7}} 18px, {{this.mod2.m2_7}} 19px, {{this.c1_1}} 19px, {{this.c1_1}});\n\
background-image: -o-linear-gradient(right, {{this.c1_1}}, {{this.c1_1}} .1rem, transparent .1rem, transparent),-o-linear-gradient(left, {{this.c1_1}}, {{this.c1_1}} .1rem, transparent .1rem, transparent),-o-linear-gradient(top, {{this.c1_1}}, {{this.c1_1}} 18px, {{this.mod2.m2_7}} 18px, {{this.mod2.m2_7}} 19px, {{this.c1_1}} 19px, {{this.c1_1}});\n\
background-image: linear-gradient(to left, {{this.c1_1}}, {{this.c1_1}} .1rem, transparent .1rem, transparent),linear-gradient(to right, {{this.c1_1}}, {{this.c1_1}} .1rem, transparent .1rem, transparent),linear-gradient(top, {{this.c1_1}}, {{this.c1_1}} 18px, {{this.mod2.m2_7}} 18px, {{this.mod2.m2_7}} 19px, {{this.c1_1}} 19px, {{this.c1_1}});}/*分栏标题背景图案*/\n\
.mod2 .section-title::before {content:"";position:absolute;display:inline-block;width:5px;height:5px;background:{{this.mod2.m2_7}};border-radius:100%;margin-top:16px;z-index:1;left:.1rem;}/*分栏标题背景图案*/\n\
.mod2 .section-title::after {content:"";position:absolute;display:inline-block;width:5px;height:5px;background:{{this.mod2.m2_7}};border-radius:100%;z-index:1;right: .1rem;margin-top: 16px;}/*分栏标题背景图案*/\n\
.mod2 .section-title h3 {background: {{this.mod2.m2_7}};}/*分栏标题背景图案*/}',

					///*模板3*/
					mod3:'.mod3 .city-select-wrapper .txt {color: {{this.mod3.m3_1}};}/*选择身边省市文字颜色*/\n\
                        .mod3 .city-select .select {color:{{this.mod3.m3_2}};}/*当前省市文字颜色*/\n\
.mod3 .arrow-down {border-color: transparent {{this.mod3.m3_11}} {{this.mod3.m3_11}} transparent;}/*右边小箭头颜色*/\n\
.mod3 .option-cityselect-background {background-color: {{this.mod3.m3_3}};color:{{this.mod3.m3_4}};}/*省市选择框当前城市背景色\文字颜色*/\n\
.mod3 .option-city-text {color: {{this.mod3.m3_5}};}/*省市选择框默认文字颜色*/\n\
.mod3 .mod3-tab li {color: {{this.mod3.m3_8}};}/*未选中Tab默认文字颜色*/\n\
.mod3 .mod3-tab li span {border-color: {{this.mod3.m3_9}};background: {{this.mod3.m3_10}};}/*未选中Tab默认边框颜色、背景颜色*/\n\
@media screen and (max-width:1025px) {.mod3 .mod3-tab .option-tab-current-background span {background-color: {{this.mod3.m3_6}};color:{{this.mod3.m3_7}};}/*当前Tab背景色\文字颜色*/\n\
.mod3 .ctm-nav {background:{{this.mod3.m3_12}};}/*选择身边省市背景色*/}',
				},


				coupon:{
					mod1:'.start .coupon-mod1 .btn-get-coupon {color: {{this.L1_W1}};background:{{this.L1_A1}};border-color:{{this.L1_B1}};}.coupon-mod1 .rules {color: {{this.L1_W2}};}\n\
.popLayer .pop-rules h4:before,.popLayer .pop-rules h4:after,.popLayer .pop-rules span:after {background:{{this.L1_A2}};}.popLayer .pop-rules span {background:{{this.L1_A2}};color: {{this.L1_W3}};}',

                    mod2:'.start .coupon-mod2 .btn-get-coupon {color: {{this.L2_W1}};background:{{this.L2_A1}};border-color:{{this.L2_B1}};}.coupon-mod2 .rules {color: {{this.L2_W2}};background:{{this.L2_A2}};}\n\
.popLayer .pop-rules h4:before,.popLayer .pop-rules h4:after,.popLayer .pop-rules span:after {background:{{this.L2_A3}};}.popLayer .pop-rules span {background:{{this.L2_A3}};color: {{this.L2_W3}};}',

                    mod3:'.start .coupon-mod3 .btn-get-coupon {color: {{this.L3_W1}};background:{{this.L3_A1}};border-color:{{this.L3_B1}};}.coupon-mod3 .ctm-article span {color: {{this.L3_W2}};}.ctm-article p{color: {{this.L3_W3}};}\n\
.coupon-mod3 .ctm-article h4:before,.coupon-mod3 .ctm-article h4:after,.coupon-mod3 .ctm-article span,.coupon-mod3 .ctm-article span:after {background:{{this.L3_A2}};}'
                }
			},
		};

	return componentsData;
});