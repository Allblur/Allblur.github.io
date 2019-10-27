/*
*  @描述：文件作用
*  @作者：付文松
*  @创建时间：2018/5/16
*/
<template>
  <div class="limit__box">
    <el-input class="limit__textarea" :maxlength="maxlength" type="textarea" :rows="3" :placeholder="placeholder" v-model="dValue" :disabled="disabled"></el-input>
    <span class="textarea__wordcount">{{wordcount}}/{{maxlength}}</span>
  </div>
</template>

<style lang="scss" scoped>
  .limit__box /deep/ {
    line-height: 1;
    display: flex;
	.el-textarea__inner{
		font: inherit;
		padding:10px;
	}
    .textarea__wordcount{
      color: #999;
      margin-left: 10px;
      align-self: flex-end;
    }
  }
</style>

<script>
  export default {
    name: "limit-textarea",
    props:{
      value:{
        type:String,
        default:""
      }
      ,maxlength:{
        type:Number,
        default:100
      }
      ,placeholder:{
        type:String,
        default:"请输入备注"
      }
      ,disabled: {
        type:Boolean,
        default:false

      }
    }
    ,watch:{
	  value(n,o){
		this.dValue = n;
	  }
      ,dValue(n,o){
        this.wordcount = n.length;
        this.$emit("input",n);
     }
    }
    ,data(){
      return {
        dValue:this.value,
        wordcount:0
      }
    }
  }
</script>

