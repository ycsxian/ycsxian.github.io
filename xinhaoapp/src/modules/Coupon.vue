<template>
    <div :class="progress">
        <coupon-model-component :config_coupon="config_coupon" :couponInfor="couponInfor" @getCoupon="btnCouponClick" @showRules="clickRules"></coupon-model-component>

        <popup-component v-model="popInfor.status" :popInfor="popInfor"></popup-component>
    </div>
</template>

<script>
import componentcouponmodel from '../components/CouponModel'
import componentpopup from '../components/Popup'

var $win = $(window);
var localUrl = window.location.href;
var errmsg;
export default {
  name: 'coupon',
  props:['componentData'],
  data () {
    return {
      msg: 'this is test for coupon.vue!!',
      config_coupon:this.componentData.config_coupon,
      couponInfor:{
        btn_status:'',
        btn_text:'立即领取'
      },
      popInfor:{
        status:false,//控制弹层显示与否
        type:'',
        popContent:''
      },
      progress:'start'
    }
  },
  components: {
      'coupon-model-component':componentcouponmodel,
      'popup-component':componentpopup
  },
  created(){
    this.getUserStatus();
  },

  mounted(){
    var cssTemp = this.componentData.styleTemp['mod'+this.config_coupon.model];
    this.$emit('handlercss',[cssTemp, this.componentData.config_css['mod'+this.config_coupon.model]])
    this.$store.dispatch('createMetricAct','coupon');
  },
  methods:{

      getUserStatus:function(){
          var that =  this;

          if(pageInfo.isInApp){
              userIsLogin = LizardLite.Member.isLogin();
          } else {
              var model = LizardLite.Model({
                  url:"/soa2/10512/GetLoginStatusByTicket.json",
                  checkAuth: false
              })

              model.execute(function(data) {
                  if(data.IsLogin === "T") {
                      userIsLogin = true;

                  } else {
                      userIsLogin = false;
                  }

              }, function(e) {

              }, true);
          }
      },

      _goLogin:function(){
          if(pageInfo.isInApp){
              LizardLite.HybridReady(function(){
                  CtripUser.app_member_login(false);
              })
          } else {
              LizardLite.Member.memberLogin({param:'from=' + localUrl})
          };

      },


      // 登陆验证
      toDraw:function(){
          var that=this;
          // userIsLogin = true;
          if (userIsLogin) {
              that._toDraw();
          }else{
              that._goLogin();
          }
      },


      //执行抽奖
      _toDraw:function(){
          var that = this;
          var scid = this.config_coupon.scid;
          // var cityid = cityid;
          var vken = this.config_coupon.vken || "";

          var model = LizardLite.Model({
              url:"/soa2/12008/SendPromotionQOC",
              checkAuth: false
          })

          model.setParam({
              "scid":parseInt(scid),
              "vken":vken
          })
         
          model.execute(function(data) {
              that._drawCouponHandler(data);
          }, function(e) {
              that._drawResultHandler('sysError',errmsg);
          }, true);
      },

      // 抽奖回调
      _drawCouponHandler:function(data,$obj){
          var that = this;
          // console.log(data.head)
          errmsg = data.head.errmsg;
          var errcode = data.head.errcode + '';
          // var errcode = '5001';

          switch (errcode){
              case '0':
                  // 领券成功
                  that._drawSuccessDefaultHandler(data);

                  // if(typeof settings.onDrawSuccess == 'function'){
                  //     settings.onDrawSuccess(data);
                  // }
                  break;

              case '5001':
              case '5002':
              case '5003':
                  // 优惠券只能领一次
                  that._drawResultHandler(errcode,errmsg);
                 
                  break;

              default:
                  that._drawResultHandler('sysError',errmsg);
                  break;

          }

          // if(typeof settings.afterDrawCallback == 'function'){
          //     settings.afterDrawCallback(data);
          // }

      },

      _drawSuccessDefaultHandler:function(data){
          var that = this;
          var resData = data.data.spexts;
          var couponInfo;

           for (var i = 0; i < resData.length; i++) {
              var couponVal = resData[i].val;
              if(resData[i].type == 1 && couponVal > 0){
                  couponInfo = '恭喜您领取了<br/><em>'+ couponVal +'</em>元优惠券！'
              }
          }

          this.popInfor.type = 'success';
          this.popInfor.popContent = this.config_coupon.successText || couponInfo;
          this.popInfor.status = true;

          // this.couponInfor.btn_status = 'has-drawn';
          // this.couponInfor.btn_text = '已领取';

      },

      // 抽奖结果异常处理
      _drawResultHandler:function(errcode,errmsg){
          var that = this;
          var codeInfo = this.componentData.config_draw.code[errcode];
          // console.log(codeInfo)
          // var codeInfo = errmsg;

          this.popInfor.type = 'common';
          // this.popInfor.popContent = codeInfo.info;
          this.popInfor.popContent = errmsg;

          this.popInfor.status = true;

          this.couponInfor.btn_status = codeInfo.status;

          if(errcode == '5003'){
              this.couponInfor.btn_text = '已领取';
              this.progress = false
          }else if (errcode == '5001'){
              this.progress = false
              this.couponInfor.btn_text = '已领完';
          }

      },


      _getQueryString:function(){
          var result={};
          var str=location.search.replace(/^\?/, '');
          var arr=str.split('&');
          _.each(arr, function(item){
              var temp=item.split('=');
              if(temp.length==2){
                  result[temp[0]]=temp[1];
              }
          });
          return result;
      },


      btnCouponClick:function(){
          //已抽取
          if(this.couponInfor.btn_status == 'has-drawn'){
              
              this._drawResultHandler('5003',errmsg);//已领取
          } else {
              this.toDraw();
          }
      },

      clickRules:function(){
          this.popInfor.type = 'rules';
          this.popInfor.popContent = this.config_coupon.editContent;
          this.popInfor.status = true;
      },

  }
}

</script>

