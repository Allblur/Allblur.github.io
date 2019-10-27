/*
*  @描述：折叠面板
*  @作者：付文松
*  @创建时间：2018/5/15
*/
<template>
  <div class="collapse__wrap">
    <div class="cw__head" @click="change">
      <i class="iconfont" :class="{'zticon-icon_zhankai':dToggle,'zticon-icon_shouqi':!dToggle}"></i>
      <span class="cw__title_box">
        <span class="cw__title_item">
          <span class="cw__title" v-text="dTitle"></span>
          <span class="cw__title_tips" v-if="titleTips">{{titleTips}}</span>
        </span>
        <span class="cw__title_item price1" v-if="titleItem1">{{titleItem1}}</span>
        <span class="cw__title_item price2" v-if="titleItem2">{{titleItem2}}</span>
      </span>
    </div>
    <div class="cw__body" v-show="dToggle">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .collapse__wrap{
    border: 1px solid #eaeefb;
    margin-bottom: 20px;
    .cw__head{
      background: #f1f6fc;
      padding: 6px 10px;
      display: flex;
      border-bottom: 1px solid #eaeefb;
      cursor: pointer;
      .iconfont{margin-right: 5px;color: #9da0a6;}
      .cw__title_box {
        display: flex;
        width: 100%;
        flex-direction: row;
        .cw__title_item {
          flex: 8;
          .cw__title{
            font-size: 14px;
            font-weight: bold;
            color: #666;
          }
          .cw__title_tips {
            font-size: 14px;
            font-weight: bold;
            color: #f00;
            margin-left: 10px;
          }
        }
        .cw__title_item.price1{
          flex: 1;
        }
        .cw__title_item.price2{
          flex: 1;
        }
      }

    }
  }
</style>

<script>
  export default {
    name: "zt-collapse"
    ,props:{
      title:{
        type:String,
        default:"栏目名称"
      },
      titleTips:{
        type:String,
        default:''
      },
      titleItem2:{
        type:String,
        default:''
      },
      titleItem1:{
        type:String,
        default:''
      },
      toggle:{
        type:Boolean,
        default:true
      }
    }
	,watch:{
		title(n,o){
			this.dTitle = n;
		},
		toggle(n,o){
			this.dToggle = n;
		}
	}
    ,data(){
      return {
        dToggle:this.toggle,
		dTitle:this.title
      }
    }
    ,methods:{
      change(e){
        this.dToggle = !this.dToggle;
        this.$emit("change",e,this.dToggle);
      }
    }
  }
</script>

