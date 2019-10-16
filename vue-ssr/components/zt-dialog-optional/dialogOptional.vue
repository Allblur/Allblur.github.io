/*
*  @描述：选装弹窗组件
*  @作者：梁飞
*  @创建时间：2019/3/27
*/
<template>
  <div>  
    <!-- 选择项目 -->
    <el-dialog :before-close="beforeClose" class="choosepart__dialog" :title="dTitle" :close-on-click-modal="false" :visible.sync="dVisable">
      <div>
        <el-form class="searchform__optional" :inline="true" size="small">
          <el-form-item>
            <el-input style="width:360px;" v-model="seacrhCarOptional.content" placeholder="选配项目名称/项目编码/选装细项名称/细项编码" size='small'></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="seacrhCarOptional.partType" filterable placeholder="全部类型" size='small'>
              <el-option v-for="optional in optionalList" :key="optional.value" :label="optional.label" :value="optional.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="queryChoosepart" type="primary" size='small'>查询</el-button>
            <el-button @click="resetQueryChoosePart" type="default" size='small'>重置</el-button>
            <!-- 只有保时捷有这个功能 -->
            <el-button @click="toChooseManufacturers" type="primary" size='small' v-show='ztbrandId == 18'>使用厂家代码查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <column-box no-title last style="maxHeight:500px;overflowY:scroll;" v-loading='optionLoading'>
        <template slot="body">
          <div v-show="optional.optionalItemList.length" v-for="(optional,optionalIndex) in optionalData" :key="'optional__'+optionalIndex">
            <div class='optional_title' @click='changeVisible(optionalIndex)'>
              <label class='iconfont zticon-icon_zhankai' v-show='visibleArr[optionalIndex] === true'></label>
              <label class='iconfont zticon-icon_shouqi' v-show='visibleArr[optionalIndex] === false'></label>
              <span>{{optional.partName}}</span>
            </div>
            <zt-collapse v-for='(optionalItem,optionalItemIndex) in optional.optionalItemList' :title="optionalItem.name+'('+(itemChooseTypeList.filter(item => item.value === optionalItem.itemChooseType)[0].name)+')'" :title-tips="optionalItem.isMust === 1?'必选':''" title-item1='销售价' title-item2='采购价' :key="'optionalItem_'+optionalItemIndex" v-show='visibleArr[optionalIndex] === true'>
              <!-- 多选 -->
              <div v-for='(optValue,optKey,optIndex) in optionalItem.multipleGroupObj' :key='optIndex'>
                <!-- 单个分组 单个选项 -->
                <div v-if='optValue.length === 1' class='lf-check-box'>
                  <div v-for='checkItem in optValue' :key='checkItem.id' class='check-item'>
                    <el-checkbox v-model="checkboxData['checkbox-'+checkItem.id+'-'+checkItem.choosePartId+(optionalItem.isMust === 1?'-isMust':'')]" :label='checkItem.id' :true-label='checkItem.id'  :false-label='0' >
                      <span class="optional__label" :title="checkItem.itemName">{{checkItem.itemName}}</span>
                      <span class="optional__code">{{checkItem.choosePartItemNum}}</span>
                      <span class="optional__price1">{{'¥'+checkItem.itemPrice}}</span>
                      <span class="optional__price">{{'¥'+checkItem.purchasePrice}}</span>
                    </el-checkbox>
                  </div>
                </div>
                <!-- 单个分组 多个选项  多选1-->
                <div v-if='optValue.length > 1' class='lf-radio-box'>
                  <div v-for='radioItem in optValue' :key='radioItem.id' class='raido-item'>
                    <el-checkbox v-model="checkboxData['radio-'+optionalIndex+optionalItemIndex+radioItem.itemGroup+'-'+radioItem.choosePartId+(optionalItem.isMust === 1?'-isMust':'')]" :label='radioItem.id' :true-label='radioItem.id'  :false-label='0'>
                      <span class="optional__label" :title="radioItem.itemName">{{radioItem.itemName}}</span>
                      <span class="optional__code">{{radioItem.choosePartItemNum}}</span>
                      <span class="optional__price1">{{'¥'+radioItem.itemPrice}}</span>
                      <span class="optional__price">{{'¥'+radioItem.purchasePrice}}</span>
                    </el-checkbox>
                  </div>
                </div>
              </div>
              <!-- 全选 -->
              <div class='lf-check-box' v-if='optionalItem.itemChooseType === 2'>
                <div v-for='checkItem in optionalItem.vehChoosePartItemDto' :key='checkItem.id' class='check-item'>
                  <el-checkbox v-model="checkAllData['checkbox-'+optionalItem.id+'-'+checkItem.id+(optionalItem.isMust === 1?'-isMust':'')]" :label='checkItem.id' :true-label="optionalItem.id+'-true'"  :false-label="optionalItem.id+'-false'" @change="checkAll">
                      <span class="optional__label" :title="checkItem.itemName">{{checkItem.itemName}}</span>
                      <span class="optional__code">{{checkItem.choosePartItemNum}}</span>
                      <span class="optional__price1">{{'¥'+checkItem.itemPrice}}</span>
                      <span class="optional__price">{{'¥'+checkItem.purchasePrice}}</span>
                  </el-checkbox>
                </div>
              </div>
              <!-- 单选 -->
              <div class='lf-check-box' v-if='optionalItem.itemChooseType === 1'>
                <div v-for='radioItem in optionalItem.vehChoosePartItemDto' :key='radioItem.id' class='check-item'>
                  <el-checkbox v-model="radioData['radio-'+optionalIndex+optionalItemIndex+(optionalItem.isMust === 1?'-isMust':'')]" :label='radioItem.id' :true-label='radioItem.id'  :false-label='0'>
                      <span class="optional__label" :title="radioItem.itemName">{{radioItem.itemName}}</span>
                      <span class="optional__code">{{radioItem.choosePartItemNum}}</span>
                      <span class="optional__price1">{{'¥'+radioItem.itemPrice}}</span>
                      <span class="optional__price">{{'¥'+radioItem.purchasePrice}}</span>
                  </el-checkbox>
                </div>
              </div>
            </zt-collapse>
          </div>
          <div class="dialog__nodata" v-show="!originalOptionalData.length">暂无数据</div>
        </template>
      </column-box>
      <div v-if="this.originalOptionalData.length" slot="footer" class="dialog-footer">
        <el-button @click="cancelAddChoosePart" size="small">取消</el-button>
        <el-button type="primary" @click="submitAddChoosePart" size="small">确认添加</el-button>
      </div>

      <el-dialog
        width="30%"
        :visible.sync="innerVisible"
        append-to-body>
        <div style="paddingLeft:20px;fontSize:16px;">
        <el-row>
            <el-col :span="4">选装项目:</el-col>
            <el-col :span="20"><div class='optional-item_box'>{{showOptions?showOptions:'无'}}</div> </el-col>
        </el-row>
        <el-row>
            <el-col :span="4">项目总价:</el-col>
            <el-col :span="20">¥{{optionsTotalPrice?optionsTotalPrice:0}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="24">确认是否加入配置清单中?</el-col>
        </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTolist">加入清单</el-button>
        </div>
      </el-dialog>
    </el-dialog>

    <!-- 使用厂家代码查询 -->
    <el-dialog class="manufacturers__dialog" title="厂家查询配置" :close-on-click-modal="false" :visible.sync="manufacturersDialogVisible" width="900px"> 
        <el-form class="manufacturers__from" :inline="true">
          <el-form-item>
            <el-input style="width:360px;" v-model.trim="keyword" placeholder="请输入厂家配置代码" size='small'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="toSearch" type="primary" size='small' :loading='searchLoading'>查询</el-button>
          </el-form-item>
        </el-form>
        <div class='manufacturers_table'>
          <el-button @click="toAddItem" type='text'>添 加</el-button>
          <el-button @click="toDeleteItem" type='text'>删 除</el-button>
          <el-form :model="formData"  ref="optForm" :rules="tableRules" class='table_form_box' size="small">
            <zt-table
              :tableColumn="tableColumn"
              :tableData="formData.tableData"
              :getSelection.sync="getSelection"
              :pagination='false'
              :loading='searchLoading'
            >
            </zt-table>
          </el-form>
        </div>
        <div class='tips-box'>
          <el-row>
              <el-col>选择项目编码 : 只能输入字母或数字、最长15位</el-col>
          </el-row>
          <el-row>
              <el-col>选装细项编码 : 只能输入字母或数字、最长15位</el-col>
          </el-row>
          <el-row>
              <el-col>销售价、采购价 : 只可以填数字，最多2位小数点，不可输入负数</el-col>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="manufacturersDialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="addToTable('optForm')" size="small" :loading="addToTableLoading">确 认</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<style lang="scss" scoped>
   //强制换行
    /deep/.optional-item_box{
      word-wrap:break-word;
    }
  .choosepart__dialog /deep/ {
    .el-dialog__body {
      padding-top: 0;
    }
    .searchform__optional{
      padding-left: 20px;
      .el-form-item{
        margin-bottom: 10px;
      }
    }
    .optional_title {
      margin-bottom: 10px;
      font-weight: bold;
      color: #409EFF;
      .iconfont {
        font-weight: normal;
      }   
    }
    .dialog__nodata{
      background:#f0f0f0;
      text-align:center;
      color: #999;
      padding: 10px;
    }
    .lf-radio-box {
      padding: 5px 28px 5px 20px;
      box-sizing: border-box;
      background: #F9F9F9;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .raido-item {
        padding-left: 10px;
        position: relative;
        .el-checkbox{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .el-checkbox__label {
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .optional__label {
              flex: 8;
              word-break: break-all;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .optional__code {
              flex: 5;
            }
            .optional__price1 {
              flex:2;
            }
            .optional__price {
              flex:1;
            }
          }
        }
      }
      .raido-item::before{
          content:'';    
          display: inline-block;
          position: absolute;
          left: 0;
          width: 5px;
          height: 100%;
          border-left: 1px solid #C1C4CB;
      }
      .raido-item:first-child::before{
          content:'';
          display: inline-block;
          position: absolute;
          left: 0;
          width: 5px;
          height: 100%;
          border-left: 1px solid #C1C4CB;
          border-top: 1px solid #C1C4CB;
      }
      .raido-item:last-child::before{
          content:'';
          display: inline-block;
          position: absolute;
          left: 0;
          width: 5px;
          height: 100%;
          border-left: 1px solid #C1C4CB;
          border-bottom: 1px solid #C1C4CB;
      }

    }
    .lf-check-box {
      padding: 5px 28px 5px 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .check-item {
        .el-checkbox{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .el-checkbox__label{
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .optional__label {
              flex: 8;
              word-break: break-all;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .optional__code {
              flex: 5;
            }
            .optional__price1 {
              flex:2;
            }
            .optional__price {
              flex:1;
            }
          }
        }
      }
    }
  }

  .manufacturers__dialog /deep/ {
    .el-dialog__body {
      padding-top: 0;
    }
    // padding: 0 10px;
    .manufacturers_table {
      padding: 0 10px;
      .table_form_box {
        max-height: 600px;
        overflow-y: scroll;
      }
    }
    .manufacturers__from {
      padding: 0 10px;
    }
    .el-form-item {
      margin-bottom: 0px;
    }
    .icon-required {
      color: #f56c6c;
    }
  } 
  .tips-box {
    padding:10px 10px;
    color: #666;
  }

</style>

<script>
  import ztCollapse from "zt-collapse";
  import columnBox from "zt-column-box";
  import ztTable from 'zt-table'

  export default {
    name: "dialog-optional"
    ,components:{
      ztCollapse,
      columnBox,
      ztTable
    }
    ,props:{
      value:{
        type:Array,
        default:function(){
          return [];
        }
      }
      //弹窗显示隐藏属性
      ,visible:{
        type:Boolean,
        default:false
      }
      //车型ID
      ,vehicleId:{
        type:String,
        default:""
      }
      //车系名称
      ,ztfamilyId:{
        type:String,
        default:""
      }
      //车系id
      ,familyName:{
        type:String,
        default:""
      }
      //弹窗标题
      ,title:{
        type:String,
        default:"修改选装项目"
      }
      // 品牌Id
      ,ztbrandId:{
        type:Number,
        default:0
      }
    }
    ,data(){
      let t = this;
      return {
        dVisable:t.visible
        ,dValue:this.value
        ,dTitle:this.title
        //搜索选装
        ,seacrhCarOptional:{
          content:"",
          partType:"",
          vehicleId:[t.vehicleId],
        }
        //选装类型显示隐藏
        ,visibleArr:[]
        // 多选数据
        ,checkboxData:{
        }
        //单选数据
        ,radioData:{
        }
        // 全选数据
        ,checkAllData:{

        }
        //选装类型 查询
        ,optionalList:[]
        //选择类型 筛选
        ,optionalList2:[]
        //数据请求的原始数据
        ,originalOptionalData:[]
        //选装数据
        ,optionalData:[],
        innerVisible:false,
        // 已经选择的选装项目及价格(弹出框展示)
        showOptions:'',
        optionsTotalPrice:null,
        choosePart:[],
        //细项选装方式
        itemChooseTypeList:[
          {name:'多选',value:0},
          {name:'单选',value:1},
          {name:'全选',value:2}
        ],
        optionLoading:false,
        manufacturersDialogVisible:false,
        // 厂家配置列表
        tableColumn:[
          {
            prop:'partType',
            renderHeader:(h,{column,$index})=>{
              return (
                <span>选装类型 <i class="icon-required">*</i></span>
              )
            },
            formatter:(row,column,cellValue,index)=>{
              let val = this.formData.tableData[index].partType;
              let prop = "tableData."+index+".partType";
              let rules = [
                {required:true,message:"请选择选择类型",trigger:"change"}
              ]
              return (
                <el-form-item class="table__formitem" rules={rules} prop={prop}>
                  <el-select  placeholder="选装类型" value={val} onChange={this.partTypeTableItemChange.bind(this,index)} size='small'>
                    {
                      this.partTypeList.map(item => {
                        return (
                          <el-option key={item.id} value={item.id} label={item.name}></el-option>
                        )
                      })
                    }
                  </el-select>
                </el-form-item>
              )
            }
          },
          {
            prop:'colorType',
            renderHeader:(h,{column,$index})=>{
              return (
                <span>颜色对应的部位</span>
              )
            },
            formatter:(row,column,cellValue,index)=>{
              let val = this.formData.tableData[index].colorType;
              return (
                <el-form-item class="table__formitem">
                  <el-select  placeholder="请选择" value={val} onChange={this.colorTypeTableItemChange.bind(this,index)} size='small' clearable >
                    {
                      this.vcColorList.map(item => {
                        return (
                          <el-option key={item.value} value={item.value} label={item.name}></el-option>
                        )
                      })
                    }
                  </el-select>
                </el-form-item>
              )
            }
          },
          {
            prop:'category',
            renderHeader:(h,{column,$index})=>{
              return (
                <span>选装项目名称 <i class="icon-required">*</i></span>
              )
            },
            formatter:(row,column,cellValue,index)=>{
              let val = this.formData.tableData[index].category;
              let prop = "tableData."+index+".category";
              let rules = [
                {required:true,message:"选装项目名称",trigger:"blur"}
              ]
              return (
                <el-form-item class="table__formitem" rules={rules} prop={prop}>
                  <el-input maxlength="15" value={val} onInput={this.categoryTableItemInput.bind(this,index)} placeholder="选装项目名称" size='small'></el-input>
                </el-form-item>
              )
            }
          },
          {
            prop:'choosePartNum',
            label:'选装项目编码',
            formatter:(row,column,cellValue,index)=>{
              let val = this.formData.tableData[index].choosePartNum;
              let prop = "tableData."+index+".choosePartNum";
              let rules = [
                {pattern: /^[0-9a-zA-Z]*$/g,message:"只能输入字母和数字",trigger:"blur"}
              ]
              return (
                <el-form-item class="table__formitem" prop={prop} rules={rules}>
                  <el-input maxlength="15" value={val} onInput={this.choosePartNumTableItemInput.bind(this,index)} placeholder="选装项目编码" size='small'></el-input>
                </el-form-item>
              )
            }
          },
          {
            prop:"option",
            align:"center",
            renderHeader:(h,{column,$index})=>{
              return (
                <span>选装细项名称 <i class="icon-required">*</i></span>
              )
            },
            formatter:(row,column,cellValue,index)=>{
              let val = this.formData.tableData[index].option ;
              let prop = "tableData."+index+".option";
              let rules = [
                {required:true,message:"请输入细项名称",trigger:"blur"}
              ]
              return (
                <el-form-item class="table__formitem" rules={rules} prop={prop}>
                  <el-input maxlength="30" value={val} onInput={this.optionTableItemInput.bind(this,index)} placeholder="请输入细项名称" size='small'></el-input>
                </el-form-item>
              )
            }
          },
          {
            prop:'code',
            label:'选装细项编码',
            formatter:(row,column,cellValue,index)=>{
              let val = this.formData.tableData[index].code ;
              let prop = "tableData."+index+".code";
              let rules = [
                {pattern: /^[0-9a-zA-Z]*$/g,message:"只能输入字母和数字",trigger:"blur"}
              ]
              return (
                <el-form-item class="table__formitem" prop={prop} rules={rules}>
                  <el-input maxlength="15" value={val} onInput={this.codeTableItemInput.bind(this,index)} placeholder="选装细项编码" size='small'></el-input>
                </el-form-item>
              )
            }
          },
          {
            prop:'price',
            renderHeader:(h,{column,$index})=>{
              return (
                <span>销售价 <i class="icon-required">*</i></span>
              )
            },
            formatter:(row,column,cellValue,index)=>{
              let min = 0,
                max = 100000000,
                maxLength = 9;
              let val = this.formData.tableData[index].price;
              let prop = "tableData."+index+".price";
              let rules = [
                {required:true,message:"请输入销售价",trigger:"blur"},
                {pattern: /^\d+(\.\d+)?$/g, message: '只能输入数字',trigger:"blur"}
              ]
              return (
                <el-form-item class="table__formitem" rules={rules} prop={prop}>
                  <el-input
                    step="0.01"
                    type="number"
                    min={min}
                    max={max}
                    maxlength={maxLength}
                    value={val}
                    onInput={this.priceTableItemInput.bind(this,index)}
                    placeholder="请输入销售价" size='small'>
                  </el-input>
                </el-form-item>
              )
            }
          },
          {
            prop:'purchasePrice',
            renderHeader:(h,{column,$index})=>{
              return (
                <span>采购价 <i class="icon-required">*</i></span>
              )
            },
            formatter:(row,column,cellValue,index)=>{
              let min = 0,
                max = 100000000,
                maxLength = 9;
              let val = this.formData.tableData[index].purchasePrice;
              let prop = "tableData."+index+".purchasePrice";
              let rules = [
                {required:true,message:"请输入采购价",trigger:"blur"},
                {pattern: /^\d+(\.\d+)?$/g, message: '只能输入数字',trigger:"blur"}
              ]
              return (
                <el-form-item class="table__formitem" rules={rules} prop={prop}>
                  <el-input
                    step="0.01"
                    type="number"
                    min={min}
                    max={max}
                    maxlength={maxLength}
                    value={val}
                    onInput={this.purchasePriceTableItemInput.bind(this,index)}
                    placeholder="请输入采购价" size='small'>
                  </el-input>
                </el-form-item>
              )
            }
          }
        ],
        tableData:[],
        tableRules:{},
        getSelection:[],
        keyword:'',  // PL4GGV94
        partTypeList:[],
        formData:{
          tableData:[]
        },
        searchLoading:false,
        // 颜色对应部位
        vcColorList: [
          {name:'外观颜色',value: 'O'},
          {name:'内饰颜色',value: 'I'},
        ],
        addToTableLoading: false
      }
    }
    ,watch:{
      //监控弹窗显示隐藏属性变化
      visible(n,o){
        this.dVisable = n;
        if(n){
          this.optionLoading = true;
          this.getChoosePartTypeListByZtBrandId(this.ztbrandId)
        }
        this.$emit("update:visible",n)
      }
      //监控车型ID变化
      ,vehicleId(n,o){
        if(n){
          this.seacrhCarOptional.content = "";
          this.seacrhCarOptional.partType = "";
          this.getChoosePartTypeListByZtBrandId(this.ztbrandId)
        }
        this.seacrhCarOptional.vehicleId = [n];
      }
      ,dVisable(n,o){
        this.$emit("update:visible",n)
      }
      ,value:{
        handler(n,o){
          this.dValue = n;
        }
        ,deep:true
      }
    }
    ,created(){
      let vehicleId = this.seacrhCarOptional.vehicleId;
      // if(vehicleId){
      //   this.queryChoosepart();
      // }
      if(this.ztbrandId){
        this.getChoosePartTypeListByZtBrandId(this.ztbrandId)
      }
      
    }
    ,methods:{
      //查询选装数据
      queryChoosepart(){
        let requestVehChoosepartSelectWmsVehChoosePartPromise = this.$root.requestVehChoosepartSelectWmsVehChoosePart(this.seacrhCarOptional);
        requestVehChoosepartSelectWmsVehChoosePartPromise.then((res)=>{
          this.optionLoading = false;
          let code = parseInt(res.code);
          let msg = res.message;
          if(code){
            this.$message.error(msg);
            return false;
          }
          let data = res.data;
          if(data){
            // 格式化数据
            this.originalOptionalData = JSON.parse(JSON.stringify(data));
            // 传入数据 与当前选择的选装 作回填
            this.formatterData(data,this.value);
          }
        })
        requestVehChoosepartSelectWmsVehChoosePartPromise.catch(err=>{
          loading.close();
        })
      }
      //确定修改选装
      ,submitAddChoosePart(e){
        let optionalData = JSON.parse(JSON.stringify(this.optionalData));
        // 检查必选项 必须有值
        let flag = false;
        for(let k in this.checkAllData){
          if(k.indexOf('isMust') !== -1){
            if(this.checkAllData[k].split('-')[1] === 'false'){
              flag = true;
            }
          }
        }

        for(let k in this.radioData){
          if(k.indexOf('isMust') !== -1){
            if(this.radioData[k] === 0){
              flag = true;
            }
          }
        }
        // 多选 判断
        let chooseObj = {};
        for(let k in this.checkboxData){   
          // 将相同选装项目的多选分到一起
          chooseObj[k.split('-')[2]] = {};
          chooseObj[k.split('-')[2]].arr = [];
          if(k.indexOf('isMust') !== -1){
            chooseObj[k.split('-')[2]].isMust = true;
          }else{
            chooseObj[k.split('-')[2]].isMust = false;
          }
        }
        for(let k in this.checkboxData){   
          // 将相同选装项目的多选分到一起
          chooseObj[k.split('-')[2]].arr.push(this.checkboxData[k]);
        }

        for(let k in chooseObj){
          if(chooseObj[k].isMust === true){
            // 多选只要有一个有值 就可以了
            if(chooseObj[k].arr.filter(item => item === 0).length === chooseObj[k].arr.length){
              flag = true;
            }
          }
        }
        if(flag) return this.$message.warning('请选择必选项!');
        let choosePart = [];
        optionalData.forEach(optional => {
          optional.optionalItemList.forEach(optionalItem => {
            optionalItem.vehChoosePartItemDto.forEach(partItem => {
              // 多选
              for(var k in this.checkboxData){
                if(this.checkboxData[k] === partItem.id){
                  choosePart.push(partItem)
                }
              }
              // 单选
              for(var k in this.radioData){
                if(this.radioData[k] === partItem.id){
                  choosePart.push(partItem)
                }
              }
              // 全选
              for(var k in this.checkAllData){
                if(this.checkAllData[k].split('-')[0] == optionalItem.id){
                  if(this.checkAllData[k].split('-')[1] === 'true'){
                    if(k.split('-')[2] == partItem.id){
                      choosePart.push(partItem)
                    }
                  }
                  
                }
              }
            })
          })
        })

        // 初始化数据
        this.optionsTotalPrice = 0;
        this.choosePart = JSON.parse(JSON.stringify(choosePart))
        var selectedOptions = choosePart.map(item => {
          return item.itemName+'(¥'+item.purchasePrice+')'
        });
        this.showOptions = selectedOptions.join(',');
        choosePart.forEach(item => {
          this.optionsTotalPrice += (+item.purchasePrice)
        })
        this.optionsTotalPrice.toFixed(2);
        this.innerVisible = true;
      }
      // 加入清单
      ,addTolist(){
          this.$emit("submit",this.choosePart);
          this.innerVisible = false;
      }
      //取消修改选装
      ,cancelAddChoosePart(e){
        this.dVisable = false;
        this.$emit("cancel",e);
      }
      //全选事件
      ,checkAll(val){
        for(let k in this.checkAllData){
          if(k.split('-')[1] === val.split('-')[0]){
            if(val.split('-')[1] === 'true'){
              this.checkAllData[k] = val;
            }else{
              this.checkAllData[k] = val.split('-')[0]+'-false';
            }
          }
        } 
      }
      //重置查询
      ,resetQueryChoosePart(){
        this.seacrhCarOptional.content = "";
        this.seacrhCarOptional.partType = "";
        this.queryChoosepart();
      }
      //关闭前回调
      ,beforeClose(done){
        done();
      }
      // 根据品牌ID查询对应品牌的选装项目
      ,getChoosePartTypeListByZtBrandId(ztBrandId){
        this.optionalData = [];
        let requestSelectVehPartTypeList = this.$root.requestSelectVehPartTypeList({ztBrandId});
        requestSelectVehPartTypeList.then(res => {
          let code = res.code;
          let message = res.message;
          if(!code){
            this.optionalList = [];
            this.optionalList2 = [];
            res.data && res.data.forEach(item => {
              var obj = {};
              obj.label = item.name;
              obj.value = item.id;
              this.optionalList.push(obj);
              this.optionalList2.push(obj)
            })
            this.optionalList.unshift({
              label:'全部类型',
              value:''
            })
            // 请求成功之后再调选装细项 这个接口
            this.queryChoosepart();
            return;
          } 
          this.$message.error(message);
        })
      },
      // 格式化数据
      formatterData(data,selectedData){
        // 格式化选装数据  以  选装类型-->选择项目-->选装细项 为父子级关系
        this.optionalData = [];
        // 依赖选装类型
        if(this.optionalList2.length === 0) return this.$message.error('选装类型接口请求数据为空!');

        // 第一步 以选装类型分类
        this.optionalList2.forEach(item => {
          var obj = {
            partName:item.label,
            optionalItemList:[]
          }
          this.optionalData.push(obj)
        })
        this.optionalData.forEach((item,index) => {
          data.forEach(el => {
            if(item.partName === el.partName){
                this.optionalData[index].optionalItemList.push(el);
            }
          })
        })
        this.optionalData.forEach((item,index) => {
          this.$set(this.visibleArr,index,true)
        })
        // 调换顺序  必选置于前面
        this.exchangeOrder(this.optionalData);

        // 第二步 选择项目分类  分为多选 全选  单选
        //多选里面又包含分组 (同一分组 为单选)    
        this.optionalData.forEach((optional,optionalIndex) => {
          optional.optionalItemList.forEach((optionalItem,optionalItemIndex) => {
            // 多选-----------
            if(optionalItem.itemChooseType === 0){
                // 创建一个对象 保存多选分组
                optionalItem.multipleGroupObj = {}
                // 创建多选分组
                optionalItem.vehChoosePartItemDto && optionalItem.vehChoosePartItemDto.forEach(partItem => { 
                   // 没有分组的话  随机自定义分组
                  if(!partItem.itemGroup){
                    partItem.itemGroup = Math.random();
                  }
                  optionalItem.multipleGroupObj['multipleGroup'+partItem.itemGroup] = [];    
                })
                // 将相同分组的细项加入同一组 多选1
                optionalItem.vehChoosePartItemDto && optionalItem.vehChoosePartItemDto.forEach(partItem => {
                  optionalItem.multipleGroupObj['multipleGroup'+partItem.itemGroup].push(partItem)                
              })
              optionalItem.vehChoosePartItemDto && optionalItem.vehChoosePartItemDto.forEach(partItem => {
                // 判断是否是必选项 如果是 打上标识 isMust
                if(optionalItem.isMust === 1){
                  // 判断是否是  多选1(单选) 
                  if(optionalItem.multipleGroupObj['multipleGroup'+partItem.itemGroup].length > 1){
                    // 单选 定义多选 同分组 多选1 checkboxData[radio+选装类型Index+选装Index+选装分组] 数据 保证同一分组 绑定一个值 不同分组绑定不同值
                    this.$set(this.checkboxData,'radio-'+optionalIndex+optionalItemIndex+partItem.itemGroup+'-'+partItem.choosePartId+'-isMust',0)
                  }else{
                    // 多选  定义 不同分组 多选 checkboxData[checkbox + id]  保证不同分组 绑定不同值 
                    this.$set(this.checkboxData,'checkbox-'+partItem.id+'-'+partItem.choosePartId+'-isMust',0)
                  }
                }else{
                  if(optionalItem.multipleGroupObj['multipleGroup'+partItem.itemGroup].length > 1){
                    this.$set(this.checkboxData,'radio-'+optionalIndex+optionalItemIndex+partItem.itemGroup+'-'+partItem.choosePartId,0);

                  }else{
                    this.$set(this.checkboxData,'checkbox-'+partItem.id+'-'+partItem.choosePartId,0)
                  }
                }
              })
            // 全选-----------
            }else if(optionalItem.itemChooseType === 2){
                optionalItem.vehChoosePartItemDto && optionalItem.vehChoosePartItemDto.forEach(partItem => { 
                // 定义checkAllData 数据
                // 判断是否是必选项 如果是 打上标识 isMust
                if(optionalItem.isMust === 1){
                  this.$set(this.checkAllData,'checkbox-'+optionalItem.id+'-'+partItem.id+'-isMust',optionalItem.id+'-false')
                }else{
                  this.$set(this.checkAllData,'checkbox-'+optionalItem.id+'-'+partItem.id,optionalItem.id+'-false')
                }
                
              })
            // 单选-----------
            }else{  
              optionalItem.vehChoosePartItemDto && optionalItem.vehChoosePartItemDto.forEach(partItem => { 
                // 定义radioData 数据
                // 判断是否是必选项 如果是 打上标识 isMust
                if(optionalItem.isMust === 1){
                  this.$set(this.radioData,'radio-'+optionalIndex+optionalItemIndex+'-isMust',0)
                }else{
                  this.$set(this.radioData,'radio-'+optionalIndex+optionalItemIndex,0)
                }
                
              })
            }
          })
        }) 
        
        // 第三步 数据回填
        selectedData.forEach(selectedItem => {
          this.optionalData.forEach((optional,optionalIndex) => {
            optional.optionalItemList.forEach((optionalItem,optionalItemIndex) => {
              // 多选
              if(optionalItem.itemChooseType === 0){
                optionalItem.vehChoosePartItemDto && optionalItem.vehChoosePartItemDto.forEach(partItem => {
                  if(optionalItem.isMust === 1){
                    // 判断是否是  多选1(单选) 
                    if(optionalItem.multipleGroupObj['multipleGroup'+partItem.itemGroup].length > 1){
                      // 单选 定义多选 同分组 多选1 
                      if(selectedItem == partItem.id){
                        this.$set(this.checkboxData,'radio-'+optionalIndex+optionalItemIndex+partItem.itemGroup+'-'+partItem.choosePartId+'-isMust',partItem.id)
                      }
                    }else{
                      // 多选  定义 不同分组 
                      if(selectedItem == partItem.id){
                        this.$set(this.checkboxData,'checkbox-'+partItem.id+'-'+partItem.choosePartId+'-isMust',partItem.id)
                      }
                    }
                  }else{
                    if(optionalItem.multipleGroupObj['multipleGroup'+partItem.itemGroup].length > 1){
                      if(selectedItem == partItem.id){
                        this.$set(this.checkboxData,'radio-'+optionalIndex+optionalItemIndex+partItem.itemGroup+'-'+partItem.choosePartId,partItem.id);
                      }

                    }else{
                      if(selectedItem == partItem.id){
                        this.$set(this.checkboxData,'checkbox-'+partItem.id+'-'+partItem.choosePartId,partItem.id);
                      }
                    }
                  }
                })
              // 全选
              }else if(optionalItem.itemChooseType === 2){
                optionalItem.vehChoosePartItemDto && optionalItem.vehChoosePartItemDto.forEach(partItem => {
                  if(optionalItem.isMust === 1){
                    if(selectedItem == partItem.id){  
                      this.$set(this.checkAllData,'checkbox-'+optionalItem.id+'-'+partItem.id+'-isMust',optionalItem.id+'-true')
                    }
                  }else{
                    if(selectedItem == partItem.id){  
                      this.$set(this.checkAllData,'checkbox-'+optionalItem.id+'-'+partItem.id,optionalItem.id+'-true')
                    }
                  }

                })
              // 单选
              }else{
                optionalItem.vehChoosePartItemDto && optionalItem.vehChoosePartItemDto.forEach(partItem => {
                  if(optionalItem.isMust === 1){
                    if(selectedItem == partItem.id){
                      this.$set(this.radioData,'radio-'+optionalIndex+optionalItemIndex+'-isMust',partItem.id)
                    }
                  }else{
                    if(selectedItem == partItem.id){
                      this.$set(this.radioData,'radio-'+optionalIndex+optionalItemIndex,partItem.id)
                    }
                  }
                })
              }
            })
          })
        })
      },
      // 调换选装项目数组位置 将必选的选择项目排在前面 即isMust = 1;
      exchangeOrder(arr){
        let newArr = JSON.parse(JSON.stringify(arr))
        newArr.forEach(item => {
          if(item.optionalItemList.length > 0){
            let newItemArr = [];
            item.optionalItemList.forEach(el => {
              if(el.isMust === 1){
                // 必选添加到前面
                newItemArr.unshift(el);
              }else{
                // 非必选添加到后面
                newItemArr.push(el)
              }
            })
            item.optionalItemList = newItemArr;
          }
        })
        this.optionalData = newArr;   
      },
      //显示隐藏选装项目
      changeVisible(index){
        this.$set(this.visibleArr,index,!this.visibleArr[index])
      },
      // 使用厂家代码查询
      toChooseManufacturers(){
        // 初始化数据
        this.formData.tableData = [];
        this.manufacturersDialogVisible = true;
        this.dVisable = false;
        this.getPorschePartTypeList();
      },
      //添加
      toAddItem(){
        var obj = {
          index:this.getRandom(),
          partType:null,
          category:"",
          code:'',
          choosePartNum:'',
          option:'',
          price:"",
          purchasePrice:"",
          amount:[],
          colorType: null
        }
        if(this.partTypeList.filter(eItem => eItem.name === '自定义配置').length > 0){
          obj.partType = this.partTypeList.filter(eItem => eItem.name === '自定义配置')[0].id
        }
        this.formData.tableData.push(obj)
      },
      // 删除
      toDeleteItem(){
        if (this.getSelection.length === 0) {
          this.$message.warning("请选择要删除的选装项目");
          return;
        }
        let getSelection = this.getSelection;
        let indexs = getSelection.map(item => item.index);
        let newTableList = this.formData.tableData.filter(
          item => {
            let index = item.index;
            let findIndex = indexs.indexOf(index);
            return findIndex < 0;
          }
        );
        this.formData.tableData = JSON.parse(JSON.stringify(newTableList)) ;
      },
      //查询
      toSearch(){
        this.getPorscheOptionData();
      },
      optionTableItemInput(index,data){
        this.formData.tableData[index].option = data.trim();
      },
      categoryTableItemInput(index,data){
        this.formData.tableData[index].category = data.trim();
      },
      partTypeTableItemChange(index,data){
        this.formData.tableData[index].partType = data;
      },
      colorTypeTableItemChange(index,data) {
        if(!data) return this.formData.tableData[index].colorType = null;
        let tipObj = {
          O: '已选择外观颜色',
          I: '已选择内饰颜色'
        }
        let isHas = this.formData.tableData.some(item => item.colorType == data);
        if(isHas) {
          this.$message.warning(tipObj[data]);
          return;
        }
        this.formData.tableData[index].colorType = data;

      },
      choosePartNumTableItemInput(index,data){
        this.formData.tableData[index].choosePartNum = data.trim();
      },
      codeTableItemInput(index,data){
        this.formData.tableData[index].code = data.trim();
      },
      priceTableItemInput(index,data){
        this.formData.tableData[index].price = data;
        this.formData.tableData[index].purchasePrice = ((+data)*0.92).toFixed(2)
      },
      purchasePriceTableItemInput(index,data){
        this.formData.tableData[index].purchasePrice = data;
      },
      getRandom(){
        return parseInt(Math.random() * Date.now() / 1000000);
      },
      // 查询保时捷品牌的选择类型
      getPorschePartTypeList(){
        let requestSelectVehPartTypeListP = this.$root.requestSelectVehPartTypeList({ztBrandId:18});
        requestSelectVehPartTypeListP.then(res => {
          let code = res.code,message = res.message;
          if(!code){
            this.partTypeList = res.data && res.data.map(item => {
              return {
                id:item.id,
                name:item.name
              }
            })
            return;
          }
          this.$message.error(message);
        })
      },
      addToTable(formName){
        if(this.formData.tableData.length == 0) return this.$message.warning('请先添加配置!');

        // 如果选择了内饰必须选择外观，选择了外观可以不选择内饰；
        let oFlag = this.formData.tableData.some(c => c.colorType == 'O'); // 外观
        let iFlag = this.formData.tableData.some(c => c.colorType == 'I');  // 内饰
        if(iFlag && !oFlag) return this.$message.warning('请选择外观颜色');

        this.$refs[formName].validate((valid) => {
          if(!valid) return false;
          let tipStr = '';
          // console.log(this.formData.tableData)
          let oIndex = this.formData.tableData.findIndex(c => c.colorType == 'O');
          let iIndex = this.formData.tableData.findIndex(c => c.colorType == 'I');
          console.log(oIndex, iIndex)
          if(oIndex !== -1 && this.formData.tableData[oIndex].category.indexOf('车身') === -1) {
            tipStr = `请确认是否将"${this.formData.tableData[oIndex].category}: ${this.formData.tableData[oIndex].option}"关联到云平台的外观颜色？<br>`
          }
          if(iIndex !== -1 && this.formData.tableData[iIndex].category.indexOf('内饰') === -1) {
            tipStr = tipStr + `请确认是否将"${this.formData.tableData[iIndex].category}: ${this.formData.tableData[iIndex].option}"关联到云平台的内饰颜色？`
          }
          let message = tipStr || '是否确定添加？';

          this.$confirm(message,'提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: true
          }).then(() => {
            this.addToTableRequest();
          }).catch(()=>{});
        })

      },
      // 提交请求
      addToTableRequest() {
        let submitTableData = [],
            vcColorDto = [];
        // let choosePartNumList = this.formData.tableData.map(item => item.choosePartNum);
        // 去重
        // choosePartNumList = [...new Set(choosePartNumList)]

        // choosePartNumList.forEach(item => {
        //   var detailTable = []
        //   var obj = {}
        //   this.formData.tableData.forEach(el => {
        //     if(item === el.choosePartNum){
        //       var objItem = {
        //         choosePartItemNum:el.code,
        //         itemName:el.option,
        //         itemPrice:el.price,
        //         purchasePrice:el.purchasePrice
        //       }
        //       obj = {
        //         name:el.category,
        //         choosePartNum:el.choosePartNum,
        //         partType:el.partType,
        //         ztBrandId:18, //固定为保时捷
        //         vehFamilys:[{'familyId':this.ztfamilyId}],
        //         vehChoosePartItemDto:[]

        //       }
        //       obj.partName = this.partTypeList.filter(elItem => elItem.id === el.partType)[0].name || '';
        //       detailTable.push(objItem)
        //     }
        //   })
        //   obj.vehChoosePartItemDto = detailTable;
        //   submitTableData.push(obj)
        // })
          
        this.formData.tableData.forEach(el => {
          var detailTable = []
          var obj = {}
          var objItem = {
            choosePartItemNum:el.code,
            itemName:el.option,
            itemPrice:el.price,
            purchasePrice:el.purchasePrice
          }
          obj = {
            name:el.category,
            choosePartNum:el.choosePartNum,
            partType:el.partType,
            ztBrandId:18, //固定为保时捷
            vehFamilys:[{'familyId':this.ztfamilyId, 'familyName': this.familyName}],
            vehChoosePartItemDto:[]

          }
          obj.partName = this.partTypeList.filter(elItem => elItem.id === el.partType)[0].name || '';
          detailTable.push(objItem);
          obj.vehChoosePartItemDto = detailTable;
          if(el.colorType) {
            vcColorDto.push({
              colorType: el.colorType,
              colorCode: el.code,
              colorName: el.option,
              salePrice: el.price,
              purchasePrice: el.purchasePrice,
              vehFamilys:[{'familyId':this.ztfamilyId, 'familyName': this.familyName}],
              ztBrandId: 18, //固定为保时捷
            })
          } else {
            submitTableData.push(obj);
          }
        })
        console.log(submitTableData)
        // return;
        this.addToTableLoading = true;
        let submitObj = {
          dtoList:submitTableData,
          ztVehicleId:this.vehicleId,
          vcColorDto: vcColorDto.length ? vcColorDto : null
        }
        let requestSavePorscheDataDtoP = this.$root.requestSavePorscheDataDto(submitObj);
        requestSavePorscheDataDtoP.then(res => {
          this.addToTableLoading = false;
          let code = res.code,message = res.message;
          if(!code){
            this.$message.success('添加成功!');
            this.manufacturersDialogVisible = false;
            let choosePart = [],
                vcColorDto = (res.data && res.data.vcColorDto) || [];
            res.data && res.data.dtoList && res.data.dtoList.forEach(item => {
              item.vehChoosePartItem && item.vehChoosePartItem.forEach(el => {
                choosePart.push(el)
              })
            }) 
            this.$emit("submit",choosePart, vcColorDto);
            return;
          }
          this.$message.error(message);
        })
        requestSavePorscheDataDtoP.catch(e => {
          this.addToTableLoading = false;
        })
      },
      getPorscheOptionData(){
        this.searchLoading = true;
        this.formData.tableData = [];
        let requestSpiderPorscheCfgDataP = this.$root.requestSpiderPorscheCfgData({code:this.keyword});
        requestSpiderPorscheCfgDataP.then(res => {
          let code = res.code,message = res.message;
          this.searchLoading = false;
          if(!code){
            res.data && res.data.forEach(item => {
              item.detail && item.detail.forEach(el => {
                var obj = {
                  index:this.getRandom(),
                  partType:null,
                  category:item.category,
                  option:el.option,
                  code:el.code,
                  price:el.price,
                  purchasePrice:((+el.price)*0.92).toFixed(2),
                  choosePartNum:'',
                  amount:[],
                  colorType: null, // 颜色对应的部位
                }
                if(this.partTypeList.filter(eItem => eItem.name === '自定义配置').length > 0){
                  obj.partType = this.partTypeList.filter(eItem => eItem.name === '自定义配置')[0].id
                }
                this.formData.tableData.push(obj)
              })
            })
            return;
          }
          this.$message.error(message)
        })
        requestSpiderPorscheCfgDataP.catch(e => {
          this.searchLoading = false;
        })
      }
    }
  }
</script>

  