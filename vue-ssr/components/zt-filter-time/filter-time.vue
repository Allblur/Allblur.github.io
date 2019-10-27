/*
*  @描述：时间tab选择，时间区间选择组件
*  @作者：白朗
*  @创建时间：2018-04-25
*/
<template>
  <div class="filter-time flex_lc" >
    <!-- 时间天数选择 -->
    <ul class="filter-day">
      <li v-for="item in timeData" :class="{'timeActive':timeTabActive === item.value}" :key="item.value" @click="selFliterTime(item)">{{item.name}}</li>
    </ul>
    <!-- 时间区间选择 -->
    <div class="date-picker-box">
      <el-date-picker
              v-model="timePicker"
              type="datetimerange"
              size="small"
              range-separator="至"
              :start-placeholder="placeholder.start"
              :end-placeholder="placeholder.end"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :editable="false"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions"
              @change="datePicker"
      >
      </el-date-picker>
    </div>
    <!-- 今日到店 -->
    <!-- <div class="toStoreBox flex_lc">
        <div class="toStore" :class="{'timeActive':timeTabActive == item.value}" v-for="item in filterData" :key="item.value" @click="selFliterTime(item)">{{item.name}}</div>
    </div> -->
    <!--<input type="hidden" name="" v-model="filterTime">-->
  </div>
</template>

<script>
  export default {
    props: {
      filterTime:{
        type: Object
      },
      initDateTime:{
        type: Array
      },
      placeholder: {
        type: Object,
        default() {
          return {
            start: '开始日期',
            end: '结束日期'
          }
        }
      },
      // 时间选择tab
      timeData:{
        type:Array,
        default(){
          return [
            {
              name:'全部',
              value:0
            },
            {
              name:'今天',
              value:1
            },
            {
              name:'昨天',
              value:2
            },
            {
              name:'7天',
              value:3
            },
            {
              name:'30天',
              value:4
            }
          ]
        }
      },
      //配置项
      pickerOptions:{
        type:Object,
        default(){
          return {
            disabledDate(time){
              let now = new Date();
              let y = now.getFullYear();
              let m = now.getMonth()+1;
              let d = now.getDate();
              let today = y+'/'+m+'/'+d+' 23:59:59';
              return time.getTime() > new Date(today).getTime();
            }
          }
        }
      }
    },
    data() {
      return {
        // 时间天数tab索引
        timeTabActive:0,
        // 时间区间选择数据
        timePicker:this.initDateTime || [] ,
        dFilterTime:this.filterTime
      };
    },
    created(){
    },
    methods:{
      //时间天数选择
      selFliterTime(itm){
        this.timeTabActive = parseInt(itm.value);
        // 清空区间选择
        this.timePicker = null;
        this.dFilterTime = {
          startDate:"",
          endDate:""
        };
        switch(this.timeTabActive){
          case 0:
            this.dFilterTime.startDate = "";
            this.dFilterTime.endDate = "";
            break;
          case 1:
            this.dFilterTime.startDate = this.getDateStr(0) + " 00:00:00";
            this.dFilterTime.endDate = this.getDateStr(0) + " 23:59:59";
            break;
          case 2:
            this.dFilterTime.startDate = this.getDateStr(-1) + " 00:00:00";
            this.dFilterTime.endDate = this.getDateStr(-1) + " 23:59:59";
            break;
          case 3:
            this.dFilterTime.startDate = this.getDateStr(-6) + " 00:00:00";
            this.dFilterTime.endDate = this.getDateStr(0) + " 23:59:59";
            break;
          case 4:
            this.dFilterTime.startDate = this.getDateStr(-29) + " 00:00:00";
            this.dFilterTime.endDate = this.getDateStr(0) + " 23:59:59";
            break;
          default:
            this.dFilterTime.startDate = "";
            this.dFilterTime.endDate = "";
            break;
        }
        this.$emit('update:filterTime',this.dFilterTime);
      },
      getDateStr(addDay){
        addDay = parseInt(addDay) || 0;
        let date = new Date();
        date.setDate(date.getDate() + addDay);
        let year = date.getFullYear(),
          month = date.getMonth() + 1,
          day = date.getDate();
        month = month < 10 ? '0'+month : month;
        day = day < 10 ? '0' + day : day;
        return year + "-" + month + '-' + day;
      },
      //时间区间选择
      datePicker(){
        //tab恢复全部
        this.timeTabActive = '0';
        if(this.timePicker){
          this.dFilterTime = {
            startDate:this.timePicker[0],
            endDate:this.timePicker[1]
          }
        }else{
          this.dFilterTime = {
            startDate:'',
            endDate:''
          }
        }
        this.$emit('update:filterTime',this.dFilterTime);
      },
      //父组件触发
      updateActive(type){
        this.timeTabActive = type;
        // 清空区间选择
        this.timePicker = null;
        this.selFliterTime({value:type});
      },
      initTime() {
        this.updateActive(0);
        this.timePicker = this.initDateTime;
        this.dFilterTime.startDate = this.initDateTime[0];
        this.dFilterTime.endDate = this.initDateTime[1];
      }

    }
  }
</script>

<style lang="scss" scoped>
  .filter-time{
    margin-bottom: 10px;
    width: 100%;
    // 时间天数样式
    .filter-day{
<<<<<<< HEAD
=======
      width: 327px;
>>>>>>> 6e757893efb893b86898c131fe57611284b89759
      border: 1px solid #B5B5B5;
      border-radius: 4px 0 0 4px;
      border-right: none;
      background-color: #fff;
      li{
        position: relative;
        width: 65px;
        height: 30px;
        line-height: 32px;
        text-align: center;
        float: left;
        border-right: 1px solid #B5B5B5;
        font-size: 12px;
        color: rgba(0,0,0,0.8);
        cursor: pointer;
        &:last-child {
          border-right: none;
        }
      }
      li.timeActive{
        background-color: #E3F1FF;
        color: #409EFF;
        &::after {
          content: '';
          width: 100%;
          height: 100%;
          position: absolute;
          left: -1px;
          top: -1px;
          border: 1px solid #409EFF;
          z-index: 2;
        }
        &:first-child::after {
          border-radius: 4px 0 0 4px;
        }
      }
      li:hover {
        background-color: #E3F1FF;
        color: #409EFF;
      }
     
    }
    .el-range-editor.el-input__inner {
      border-radius:0 4px 4px 0;
      position: relative;
      left: -1px;
    }
    //今日到店
    .toStoreBox{
      .toStore{
        margin-left: 15px;
        border-radius:4px;
        padding: 0px 10px;
        font-size: 13px;
        color: #606266;
        height: 30px;
        line-height: 30px;
        border:1px solid #dcdfe6;
        cursor: pointer;
      }
      .toStore.toStoreActive{
        background-color: #409eff;
        color: #ffffff;
      }
      .toStore:hover{
        background-color: #409eff;
        color: #ffffff;
      }
    }

  }

</style>
