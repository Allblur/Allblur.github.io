/*
*  @描述：栏目布局
*  @作者：付文松
*  @创建时间：2018/5/12
*/
<template>
  <div class="column__box" :class="{'column__box--no-title':noTitle,'column__box--last':last}">
    <div v-if="!noTitle" class="column__head">
      <h4 v-if="!isSlotHead" class="column__title--h4" v-text="title"></h4>
      <slot name="head"></slot>
    </div>
    <div class="column__body">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .column__box{
    padding: 10px;
    border-bottom: 1px solid #eaeefb;
    .column__title--h4{color: #666;font-size: 14px;font-weight: bold;}
    .column__body{
      padding-top: 10px;
    }
    &.column__box--no-title{
      .column__body{
        padding-top: 0;
      }
    }
    &.column__box--last{
      border-bottom: none;
    }
  }
</style>

<script>
  export default {
    name: "column-box"
    ,props:{
      title:{
        type:String,
        default:"栏目名称"
      }
      ,noTitle:{
        type:Boolean,
        default:false
      }
      ,last:{
        type:Boolean,
        default:false
      }
    }
    ,data(){
      return {
        isSlotHead:false
      }
    }
    ,created(){
      let slotDefault = this.$slots.default;
      let slotHead = this.$slots.head;
      let slotBody = this.$slots.body;

      if(slotDefault && !slotBody){
        this.$slots.body = slotDefault;
      }
      if(slotHead){
        this.isSlotHead = true
      }
    }
  }
</script>

