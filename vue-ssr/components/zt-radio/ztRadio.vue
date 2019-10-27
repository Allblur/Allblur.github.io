/*
*  @描述：单选组件
*  @作者：付文松
*  @创建时间：2018/5/5
*/
<template>
  <div class="zt__radio"
       :class="[
        {'zt__radio--active':model === label}
       ]"
       role="radio"
  >
    <slot></slot>
    <i class="icon__radio--active el-icon-check"></i>
    <input class="zt__radio__original" :value="label" @change="handleChange" v-model="model" type="radio" :name="name" :id="id" tabindex="-1" :disabled="isDisabled">
  </div>
</template>

<style lang="scss" scoped>
  .zt__radio{
    display: inline-block;
    border: 1px solid #e3e6eb;
    border-radius: 4px;
    text-align: center;
    padding: 10px 25px;
    line-height: 1;
    color: #666;
    cursor: pointer;
    position: relative;
    margin-right: 10px;
    overflow: hidden;
    .icon__radio--active{
      display: none;
    }
    &.zt__radio--active{
      border-color: #409eff;
      color: #409eff;
      .icon__radio--active{
        display: block;
        position: absolute;
        content:"";
        width: 0;
        height: 0;
        border: 12px solid #409eff;
        border-left-color: transparent;
        border-top-color: transparent;
        bottom: 0;
        right: 0;
        color:#fff;
        &.el-icon-check:before{
          position: absolute;
          left: -2px;
          top: -2px;
        }
      }
     }
    .zt__radio__original{
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      margin: 0;
    }
  }
</style>

<script>
  export default {
    name: "zt-radio"
    ,props:{
      value:[String,Number]
      ,label:String
      ,disabled:Boolean
      ,name:String
      ,id: Number
    }
    ,data(){
      return {
        isActive:false,
        dLabel:this.label
      }
    }
    ,computed:{
      model:{
        get(){
          return this.value;
        },
        set(val){
          this.$emit("input",val);
        }
      }
      ,isDisabled(){
        return this.disabled;
      }
    }
    ,created(){

    }
    ,methods:{
      pickRadio(e){
        this.isActive = true;
        this.$emit("change",this.dLabel);
      }
      ,handleChange(){
        this.$emit("change",{code:this.label,name:this.name,id: this.id});
      }
    }
  }
</script>

