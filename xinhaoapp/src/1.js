   
      
        if(this.configData[index].NumList[0].ids.length===0&&index!==0){
            this.configData[index].nullWindow=true
        }
   
if(this.configData[index].nullWindow===true){
this.$emit('selectCity', 0);
}else{
    this.$emit('selectCity', index);
}                                                    //对于什么资源也没有，进不去viewspot的情况，跳回第一个tab
     