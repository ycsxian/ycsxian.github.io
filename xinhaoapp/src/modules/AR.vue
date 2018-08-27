<template>
  <div class="main-frame">
      <div id="J-main-viewport" class="main-viewport" style="">
          <div class="main-body">
              <div id="J-ctm-header" class="ctm-header">
                  <img src="../assets/images/banner.jpg" class="img-auto"/>
                  <a href="javascript:void(0);" class="J-btn-go btn-go"></a>
                  <div class="checkbox-wrap">
                      <input type="checkbox" value="rule" name="choose" id="rule" checked="checked">
                      <label for="rule"><span>同意活动免责条款</span></label>
                  </div>
                  <div class="btn-wrap">
                      <a href="javascript:void(0);" class="J-btn-rules btn-rules J-disable-open-url"></a>
                      <a href="javascript:void(0);" class="J-btn-trophy btn-trophy"></a>
                  </div>
              </div>
          </div>
          <div id="J-footer-announce" class="statement hide">该活动苹果不是赞助商，并且苹果也不会以任何形式参与其中</div>
          <div id="J-mask" class="J-close-pop mod-mask"></div>
          <div id="J-popup" class="ui-popup" style="display:none;">
              <div id="J-pop-container" style="max-height:60%;overflow-y: scroll;padding:12px;">
                  <p style="text-align: center;"><span class="popup-title">活动攻略</span></p>
                  <p style="font-weight:bold;">活动时间：<span id="acttime"></span></p>
                  <p class="margin-8"><span class="tip2">参与条件</span></p>
                  <p>1.在<span id="actfield"></span>内</p>
                  <p>2.登入携程账户（7.1及以上版本）。</p>
                  <p>3.苹果手机需更新至iOS 9及以上版本；安卓手机需更新至4.2及以上版本。</p>
                  <p class="margin-8"><span class="tip2">参与方式</span></p>
                  <p>1.打开携程客户端，授权使用定位和摄像头。</p>
                  <p>2.<span id="enter"></span>进入活动页，点击 “GO”按钮，进入地图页。</p>
                  <p>3.开启定位后，寻找小精灵图标，按“点击获取”即可开始捕捉。</p>
                  <p>4.摄像头开启，找到对应的小精灵图标，点击图标获取。</p>
                  <p>5.用户获得的小精灵图标将出现在【我收集的小精灵】页面中展示。</p>
                  <p>6.收集齐6个小精灵图标可兑换奖品，奖品随机发放。</p>
                  <p>7.活动结束后，请前往<b id="actspot"></b>，凭借【我收集的小精灵】页面，领取相应奖品。</p>
                  <!-- <p class="margin-8"><span class="tip1">兑换奖品说明</span></p>
                  <table>
                      <tr>
                          <td>抓取3只精灵礼品：</td>
                          <td>四等奖</td>
                      </tr>
                      <tr>
                          <td>抓取4只精灵礼品：</td>
                          <td>三等奖</td>
                      </tr>
                      <tr>
                          <td>抓取5只精灵礼品：</td>
                          <td>二等奖</td>
                      </tr>
                      <tr>
                          <td>抓取6只精灵礼品：</td>
                          <td>一等奖</td>
                      </tr>
                  </table> -->
                  <p class="margin-8"><span class="tip2">活动规则</span></p>
                  <p>1.请务必确保处于本次活动区域内，即<span id="actfield1"></span>内，并打开定位和摄像头。</p>
                  <p>2.抓取小精灵过程中，请注意人身安全及活动安全。若小精灵出现位置较为危险，请务必放弃抓取并告知现场工作人员。</p>
                  <p>3.每位玩家（同一手机号/账号/设备号）在同一景区仅可领取一份奖品，奖品以实际情况为准，每天定量发放50个，数量有限，先到先得。</p>
                  <p>4.若需重新进入活动页面，可打开携程客户端，<span id="reenter"></span>。已经抓取成功的小精灵信息均会被保留。</p>
                  <p>5.本页面活动独立于携程其他活动，本景区内抓取的小精灵仅可兑换本景区的活动奖品。</p>
                  <p>6.本次活动期间，如用户存在违规行为（包括但不限于恶意刷单），携程将取消用户中奖资格，并有权拒绝发放活动奖品。</p>
                  <p>7.携程可以根据本活动的实际举办情况在法律允许范围内变动或调整活动规则，相关变动或调整将公布在活动页面上，公布后立即生效。</p>
                  <p>8.如出现不可抗力或情势变更的情况（包括但不限于重大灾害事件、系统故障），携程可依相关法律法规主张免责。</p>
                  <p>9.参与此次活动，即视为同意以上规则，携程及<span id="actfield2"></span>保留对活动的解释和修改的权利。</p>
              </div>
              <div class="J-close-pop close-btn">×</div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'ar',
  data () {
    return {
      msg: 'this is test for ar.vue!!'
    }
  },
  mounted(){
    this.$store.dispatch('createMetricAct', 'ar');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
