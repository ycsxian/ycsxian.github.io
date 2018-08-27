<template>
    <div>
        <div v-if="subTitleInfor.templateType==0" class="section-title option-section-title-color J-section-title show" :class="{'hide':((!subTitleInfor.navTitle) || (!subTitleInfor.sectionTitle && !subTitleInfor.editContent))}">
            <h3>{{subTitleInfor.navTitle}}</h3><div class="line"><i class="i-l"></i><i class="i-r"></i></div>
        </div>
        <div v-else class="section-img J-section-title" :class="{'hide':!subTitleInfor.navImgApp ||!subTitleInfor.sectionTitle}">
            <img class="img-auto J-item-img" :src="subTitleInfor.navImgApp" />
        </div>
    </div>
</template>

<script>
//online二级标题为图片目前未渲染
export default {
  name: 'subtab',
  props:['subTitleInfor'],
  data () {
    return {
      msg: 'this is test for subtab.vue!!',
      mod3tabIndex: 0,
    }
  },
  methods:{

  }
}
</script>

<style scoped>
  /*section*/
.section-common {}
.section-title {text-align: center;position: relative;}
.section-title h3 {display: inline-block;*display:inline;*zoom:1;position: relative;z-index: 2;font-style: italic;}

@media screen and (max-width:1024px){
    .mod2-tab .mod-break-words,
    .mod3-tab .mod-break-words {height:32px;line-height: 16px;padding:3px 0 2px;}

    .section-title {height:40px;line-height: 30px;text-align: center;font-size: 22px;font-weight: bold;position: relative;margin-top: 10px;}
    .section-title h3 {display: inline-block;*display:inline;*zoom:1;position: relative;z-index: 2;font-weight: normal;padding:0 25px;height:30px;margin-top:2px;background: #a575ff;border-radius: 15px;height: 34px;font-style: normal;font-size: 18px;line-height: 32px;}
    .section-title .line {display: none;}
    .section-title .line i {display: none;}
}
</style>
