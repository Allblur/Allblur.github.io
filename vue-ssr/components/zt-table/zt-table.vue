/*
*  @描述：表格组件
*  @作者：付文松
*  @创建时间：2018/5/3
*/
<template>
  <div class="zt__table"
       v-loading="dloading"
       :element-loading-text="dElementLoadingText"
  >
    <!--表格组件-->
    <el-table
            ref="elTable"
            :row-key="rowKey"
            :current-row-key="dRadioLabel"
            @current-change="currentChange"
            :span-method="spanMethod"
            :highlight-current-row="dHighlightCurrentRow"
            @select-all="selectTableAll"
            @select="selectTableRow"
            border
            :data="dTableData"
            :show-summary="showSummary"
            :summary-method="summaryMethod"
            :row-class-name="rowClassName"
            :row-style="rowStyle"
            @row-click='rowClick'
            :max-height="maxHeight"
            auto-fit-column
            :stripe="stripe"
            @sort-change='sortChange'
            v-if="tableSettingOk"
            @header-dragend="headerDragend"
    >
      <el-table-column
              v-for="column in dTableColumn"
              :key="column.prop"
              :reserve-selection="column.reserve || false"
              :align="column.align"
              :header-align="column.headerAlign"
              :formatter="column.formatter"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :min-width="column.minWidth"
              :fixed="column.fixed"
              :type="column.type"
              :selectable="column.selectable"
              :render-header="column.renderHeader"
              auto-fit
              :sortable='column.sortable'
              :show-overflow-tooltip="column.showOverflowTooltip || false"
      >
        <template v-if="column.children && column.children.length">
          <el-table-column
                  v-for="chilcolumn in column.children"
                  :key="chilcolumn.prop"
                  :align="chilcolumn.align"
                  :header-align="chilcolumn.headerAlign"
                  :formatter="chilcolumn.formatter"
                  :prop="chilcolumn.prop"
                  :label="chilcolumn.label"
                  :width="chilcolumn.width"
                  :fixed="chilcolumn.fixed"
                  :type="chilcolumn.type"
                  :selectable="chilcolumn.selectable"
                  :render-header="chilcolumn.renderHeader"
                  :show-overflow-tooltip="column.showOverflowTooltip || false"
          ></el-table-column>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
            ref="elPagination"
            v-if="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @prev-click="handlePrevClick"
            @next-click="handleNextClick"
            :current-page.sync="dCurrentPage"
            :background="paginationbg"
            :page-sizes="pageSizes"
            :page-size.sync="dPageSize"
            :page-count="pageCount"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dPaginationTotal">
    </el-pagination>

    <!-- 设置按钮 -->
    <div class="zt__table-setting--btn" v-if="settingUrl">
      <i class="iconfont zticon-set" @click="showTableSettingDialog" title="列表设置"></i>
    </div>
    <!-- 列表设置 -->
    <el-dialog title="列表设置" :visible.sync="tableSettingVisible"	width="600px" class="zt__table-setting" :close-on-click-modal="false" :append-to-body="true">
      <el-table
        ref="tableSetting"
        border
        :data="tableDataSetting"
        auto-fit-column
        :stripe="stripe"
        max-height="500"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <!-- default-expand-all -->
        <el-table-column
          v-for="column in tableColumnSetting"
          :key="column.prop"
          :reserve-selection="column.reserve || false"
          :align="column.align"
          :header-align="column.headerAlign"
          :formatter="column.formatter"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :fixed="column.fixed"
          :type="column.type"
          :selectable="column.selectable"
          :render-header="column.renderHeader"
          auto-fit
          :sortable='column.sortable'
          :show-overflow-tooltip="column.showOverflowTooltip || false"
        >
        <!-- <template v-if="column.children && column.children.length">
          <el-table-column
                  v-for="chilcolumn in column.children"
                  :key="chilcolumn.prop"
                  :align="chilcolumn.align"
                  :header-align="chilcolumn.headerAlign"
                  :formatter="chilcolumn.formatter"
                  :prop="chilcolumn.prop"
                  :label="chilcolumn.label"
                  :width="chilcolumn.width"
                  :fixed="chilcolumn.fixed"
                  :type="chilcolumn.type"
                  :selectable="chilcolumn.selectable"
                  :render-header="chilcolumn.renderHeader"
                  :show-overflow-tooltip="column.showOverflowTooltip || false"
          ></el-table-column>
        </template> -->
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer"> 
				<el-button size="small" @click="tableSettingVisible = false">取消</el-button> 
				<el-button size="small" type="primary" :loading="tableSettingLoading" @click="tableSettingSubmit">确定</el-button> 
			</span>
    </el-dialog>  
  </div>
</template>

<style lang="scss" scoped>
  .zt__table /deep/ {
    position: relative;
    .el-pagination {
      text-align: center;
      margin-top: 20px;
    }
    .highlightcurrent__radio {
      .el-radio__label {
        display: none;
      }
    }
    .el-table{
      .cell{
        white-space:nowrap;
        font-size: 12px;
      }
    }
  }
  .zt__table-setting /deep/{
    .el-input-number {
      width: 100%;
      .el-input__inner {
        text-align: left;
      }
    }
    .el-dialog__body {
      padding-top: 0;
      padding-bottom: 10px;
    }
  }
  .zt__table-setting--btn {
    position: absolute;
    color: #999999;
    font-size: 18px;
    width: 34px;
    height: 33px;
    line-height: 33px;
    right: 1px;
    top: 1px;
    text-align: center;
    background-color: #dcdfe6;
    box-shadow: -5px 0 10px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    pointer-events: none;
    z-index: 5;
    .iconfont {
      cursor: pointer;
      pointer-events: auto;
      &:hover {
        color: #409EFF;
      }

    }
    // &::before {
    //   content: '';
    //   position: absolute; 
    //   width: 1px;
    //   height: 18px;
    //   left: 0;
    //   top: 0;
    //   bottom: 0;
    //   background-color: #E7E9F0;
    //   margin: auto;
    // }
  }
</style>

<script>
  import Http from "zt-http";
  export default {
    name: "zt-table",
    props: {
      // 当column的reserve的值为true时,必须要传这个，实现翻页后也能保持勾选状态，rowKey必须是唯一的，最好用每行对应的id
      rowKey: {
        type: String,
        default: ''
      },
      //表格数据
      tableData: {
        type: Array,
        default() {
          return [];
        }
      },
      //表格栏目数据
      tableColumn: {
        type: Array,
        default() {
          return [];
        }
      },
      //是否显示序列号,
      index: {
        type: Boolean,
        default: false
      },
      //是否显示复选框
      selection: {
        type: Boolean,
        default: true
      },
      //当前页码
      currentPage: {
        type: Number,
        default: 1
      },
      //是否显示分页背景
      paginationbg: {
        type: Boolean,
        default: true
      },
      //每页显示多少条的选项数
      pageSizes: {
        type: Array,
        default() {
          return [10, 20, 50, 100];
        }
      },
      //每页显示多少条数
      pageSize: {
        type: Number,
        default: 10
      },
      //分页的总条数
      paginationTotal: {
        type: Number,
        default: 0
      },
      //总页数
      pageCount: {
        type: Number,
        default: 1
      },
      //表格请求
      request: {
        type: [Function, String]
      },
      //表格请求参数
      requestParams: {
        type: Object,
        default() {
          return {};
        }
      },
      //获取选中的行数组
      getSelection: {
        type: Array
      },
      //是否禁用复选框过滤函数
      selectableFilter: {
        type: Function
      },
      //是否使用本地数据
      local: {
        type: Boolean,
        default: false
      },
      //是否分页
      pagination: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      //Loading 提示
      elementLoadingText: {
        type: String,
        default: "正在加载..."
      },
      //合并行或列的计算方法
      spanMethod: {
        type: Function
      },
      //自定义合计计算方法
      summaryMethod:{
        type: Function
      },
      //格式化表格数据
      tableDataFormatter: {
        type: Function
      },
      // 表格尾部展示合计行
      showSummary: {
        type: Boolean,
        default: false
      },
      //单选
      highlightCurrentRow: {
        type: Boolean,
        default: false
      },
      //单选 label
      radioLabel: {
        type: String,
        default: ""
      },
      selectRadio: {
        validator: value => {
          return true;
        }
      },
      //当前行的 key，只写属性
      currentRowKey: {
        type: [String, Number]
      },
      rowClassName: {
        type: Function
      },
      rowStyle: Function,
      isBackTop:{
        type:Boolean,
        default:true
      },
      // 表格最大高度
      maxHeight: {
        type: [String, Number]
      },
      syncTableData:{
        type:Array
      },
      // 当需要设置自定义行样式时会与斑马纹样式冲突
      stripe: {
        type: Boolean,
        default: true
      },
      //是否禁用单选框函数
      radiotableFilter:{
        type:Function,
        default:() => {return false}
      },
      // 表格设置路径
      settingUrl: {
        type: String
      },
    },
    data() {
      let t = this;
      //将表格数据用变量表示
      let tableData = JSON.parse(JSON.stringify(this.tableData));
      //将数据总数用变量表示
      let dTableData = JSON.parse(JSON.stringify(this.tableData));
      let tableColumnFirstType = this.tableColumn[0].type;
      let paginationTotal = this.paginationTotal || dTableData.length;
      if (!tableColumnFirstType) {
        this.tableColumn.unshift({
          type: "selection",
          disabled: true,
          selectable: this.selectableFilter,
          align: "center",
          width: 50
        });
      }
      let dTableColumn = this.formatterColumn(this.tableColumn);
      //如果不需要 ajax 请求数据则用本地数据
      if (!this.request && this.pagination) {
        let pageSize = this.pageSizes[0];
        this.dPageSize = pageSize;
        paginationTotal = tableData.length;
        dTableData = tableData.splice(0, pageSize);
      }
      return {
        dTableData,
        dTableColumn,
        dSelection: this.selection,
        dCurrentPage: this.currentPage,
        dPaginationTotal: paginationTotal,
        dPageSize: this.pageSize,
        dRequestParams: this.requestParams,
        dIndex: this.index,
        //表格加载loading
        dloading: this.loading,
        //加载 Loading 文字
        dElementLoadingText: this.elementLoadingText,
        //表格数据格式化
        dTableDataFormatter: this.tableDataFormatter,
        //是否单选
        dHighlightCurrentRow: this.highlightCurrentRow,
        dSelectRadio: this.selectRadio,
        dCurrentRowKey: this.currentRowKey,
        dRadioLabel: this.radioLabel,
        dRequest:this.request,
        // 列表设置相关
        tableSettingVisible: false,
        tableColumnSetting: [
          {
            prop: "name",
            label: "数据列",
            width: '200'
          },
          {
            prop: "orderNum",
            label: "显示排序",
            formatter:function(row,column,cellValue,index){
              return (
                <el-input-number value={cellValue} onChange={t.orderNumChange.bind(this, row)} min={0} placeholder="输入序号" controls={false} step={1} size="small" disabled={!!row.fixed}></el-input-number>
              )
            }
          },
          {
            prop: "isShow",
            label: "是否显示",
            align: "center",
            formatter:function(row,column,cellValue,index){
              // if(!row || row.level==2){
              //   return cellValue;
              // }
              return (
                <el-checkbox value={cellValue} onChange={t.isShowChange.bind(this, row)} true-label={1} false-label={0}></el-checkbox>
                // <el-checkbox value={t.tableDataSetting[index].isShow} onChange={t.isShowChange.bind(this, index)} true-label={1} false-label={0}></el-checkbox>
              )
            }
          },
          {
            prop: "width",
            label: "列宽(px)",
            formatter:function(row,column,cellValue,index){
              if(row.children && row.level==1){
                let pIndex = t.tableDataSetting.findIndex(p => p.id === row.id);
                let pWidth=t.tableDataSetting[pIndex].width;
                return pWidth || '';
              }
              return (
                <el-input-number value={cellValue} onChange={t.widthChange.bind(this, row)} min={1} placeholder="输入宽度" controls={false} step={1} size="small"></el-input-number>
                // <el-input-number value={t.tableDataSetting[index].width} onChange={t.widthChange.bind(this, index)} min={1} placeholder="输入宽度" controls={false} step={1} size="small"></el-input-number>
              )
            }
          },
        ],
        tableDataSetting: [],
        typeArr: ['radio','index','selection'],
        tableColumnSettingOld: [],
        tableSettingLoading: false,
        getListRule: [],
        tableSettingOk: true
      };
    },
    watch: {
      tableData: {
        handler(n, o) {
          let _tableData = JSON.parse(JSON.stringify(n));  //因为 splice n 的话，也会触发tableData watch
          if(!this.dRequest && this.pagination) {
            let pageSize = this.pageSizes[0];
            this.dPageSize = pageSize;
            this.dTableData = _tableData.splice((this.dCurrentPage - 1) * pageSize, pageSize);
          }else{
            this.dTableData = JSON.parse(JSON.stringify(_tableData));
          }
          this.dPaginationTotal = n.length;
        },
        deep: true
      },
      tableColumn: {
        handler(n, o) {
          this.dTableColumn = this.formatterColumn(n);
        },
        immediate: true
      },
      elementLoadingText(n, o) {
        this.dElementLoadingText = n;
      },
      loading(n, o) {
        this.dloading = n;
      },
      paginationTotal(n, o) {
        this.dPaginationTotal = n;
      },
      highlightCurrentRow(n) {
        this.dHighlightCurrentRow = n;
      },
      radioLabel(n) {
        this.dRadioLabel = n;
      },
      selectRadio(n) {
        this.dSelectRadio = n;
      },
      request(n){
        this.dRequest = n;
      }
    },
    created() {
      this.requestTableDataSetting();
      let t = this;
      //判断是否是ajax 请求数据，并判断请求的是否是函数
      if (this.dRequest && this.isFunction(this.dRequest)) {
        this.requestTableData({
          pageSize: this.pageSizes[0],
          pageNum: 1
        });
      }
      this.$on("requestTable", function(options) {
        t.requestTableData(options);
      });
      this.$on("clearSelection",function(options){
        t.$refs.elTable.clearSelection();
      })
      // 切换全部复选框状态
      this.$on("toggleAllSelection",function(options){
        t.$refs.elTable.toggleAllSelection();
      })
      
    },
    mounted() {
      this.setHighLightRow();
    },
    methods: {
      //判断数据类型
      isFunction(data) {
        return Object.prototype.toString.call(data) === "[object Function]";
      },
      //修改每页的条数回调
      handleSizeChange(pageSize) {
        if (this.dRequest && this.isFunction(this.dRequest)) {
          this.requestTableData({
            pageSize: pageSize
          });
        }
        if (!this.dRequest) {
          this.dPageSize = pageSize;
          let tableData = JSON.parse(JSON.stringify(this.tableData));
          this.dTableData = tableData.splice(0, this.dPageSize);
        }
        this.$emit("handleSizeChange", pageSize);
      },
      //点击某一页回调
      handleCurrentChange(pageNum) {
        if (this.dRequest && this.isFunction(this.dRequest)) {
          this.requestTableData({
            pageNum: pageNum
          });
        }
        if (!this.dRequest) {
          let tableData = JSON.parse(JSON.stringify(this.tableData));
          let currentData = tableData.splice(
            (pageNum - 1) * this.dPageSize,
            this.dPageSize
          );
          this.$emit("update:currentPage", pageNum - 1);
          this.dTableData = JSON.parse(JSON.stringify(currentData));
        }
        this.isBackTop && this.backTop();
        this.$emit("handleCurrentChange", pageNum);
      },
      //点击上一页回调
      handlePrevClick(options) {
        this.$emit("handlePrevClick", options);
      },
      //点击下一页回调
      handleNextClick(options) {
        this.$emit("handleNextClick", options);
      },
      //请求表格数据
      requestTableData(options) {
        let t = this;
        if(!this.dRequest){t.dloading = false;return false;}
        options = options || {};
        let requestParams = Object.assign(this.dRequestParams,options);
        this.dCurrentPage = requestParams.pageNum; // 把当前页强制置为传进来的pageNum,修复搜索的pageNum与翻页组件当前页不对应
        this.dloading = this.loading || true;
        let requestPromise = this.dRequest(requestParams);
        if(!requestPromise){t.dloading = false;return false;}
        requestPromise.then(function(res) {
          t.dloading = false;
          let code = parseInt(res.code),
            data = res.data || {},
            msg = res.msg || res.message;
          if (code) {
            return false;
          }
          t.$emit('getResData',data); // 给父组件返回请求的数据,方便父组件进行逻辑处理
          t.$emit('update:syncTableData',data.list); // 给父组件返回请求的数据,方便父组件进行逻辑处理
          let list = data.list || [],
            total = parseInt(data.total || 0),
            pageSize = parseInt(data.pageSize || 10);
          let tdFormatter = t.dTableDataFormatter || t.defaultTableDataFormatter;
          if(list.length !== 0){
            t.dTableData = tdFormatter(list);
          }else{
            t.dTableData = [];
          }
          t.dPaginationTotal = total;
          t.dPageSize = pageSize;
        });
        requestPromise.catch(function(res) {
          t.dloading = false;
          t.dTableData = [];
          t.$message({
            message: "服务器请求出错",
            type: "error"
          });
        });
      },
      //table 数据格式化函数
      defaultTableDataFormatter(tableList) {
        let newTableList = tableList.map(function(item) {
          return item;
        });
        return newTableList;
      },
      //点击全选按钮
      selectTableAll(selection) {
        let newSelection = this.unique(selection,this.rowKey);
        this.$emit("update:getSelection", newSelection);
        this.$emit("select-all", newSelection);
      },
      //勾选某一行
      selectTableRow(selection, row) {
        let newSelection = this.unique(selection,this.rowKey);
        this.$emit("update:getSelection", newSelection);
        this.$emit("select", newSelection, row);
      },
      //格式化 radio 栏目
      radioColumnFormatter: function(row, column, cellValue, index) {
        let h = this.$createElement;
        return (
          <el-radio
            value={this.dSelectRadio}
            label={row[this.dRadioLabel]}
            onChange={this.radioChange.bind(this, row[this.dRadioLabel])}
            disabled={this.radiotableFilter(row)}
            class="highlightcurrent__radio"
          >
            &nbsp;
          </el-radio>
        );
      },
      //单选事件
      radioChange(label) {
        this.$emit("update:selectRadio", label);
      },
      //选中某行函数
      currentChange(currentRow, oldCurrentRow) {
        if (currentRow) {
          if(this.radiotableFilter(currentRow)) return;
          this.dSelectRadio = currentRow[this.dRadioLabel];
          this.$emit(
            "update:selectRadio",
            currentRow[this.dRadioLabel],
            currentRow
          );
        }
      },
      // 高亮指定行
      setHighLightRow() {
        let dSelectRadio = this.dSelectRadio;
        if (dSelectRadio) {
          let currentRow = this.dTableData.filter(item => {
            return item[this.radioLabel] === dSelectRadio;
          });
          if (currentRow.length) {
            this.$refs.elTable.setCurrentRow(currentRow[0]);
          }
        }
      },
      // 排序
      sortChange({ column, prop, order }){
        this.$emit("getSortChange", { column, prop, order });
      },
      //处理表头
      formatterColumn(tableColumn) {
        let t = this;
        let _tableColumn = [];
        _tableColumn = tableColumn.map(function(item, index) {
          let type = item.type;
          if (type === "radio") {
            item.label = item.label || "单选";
            item.formatter = item.formatter || t.radioColumnFormatter;
          }
          if (type === "radio" || type === "index" || type === "selection") {
            item.width = item.width || "50px";
            item.align = item.align || "center";
          }
          return item;
        });
        return _tableColumn;
      },
      // 当某一行被点击时会触发该事件
      rowClick(row, event, column) {
        if(this.radiotableFilter(row)) return;
        this.$emit("update:getClickRow", row);
        this.$emit("getClickRow", row);
      }
      // 回到顶部
      ,backTop(){
        let tableRect = document.querySelector(".zt__table").getBoundingClientRect();
        let paginationRect = this.$refs.elPagination.$el.getBoundingClientRect();
        let $pageContent = document.querySelector(".page-content");
        let pageContentRect = $pageContent.getBoundingClientRect();
        let pageContentScrollTop = document.querySelector(".page-content").scrollTop;
        document.querySelector(".page-content").scrollTop = pageContentScrollTop - Math.abs(tableRect.top) - 130;
      }
      //选中数据
      ,toggleSelection(rows,key,status){
        this.$nextTick(()=>{
          this.dTableData.forEach(item=>{
            let isselected = rows.some(ele=>{
              return ele[key] === item[key];
            })
            this.$refs.elTable.toggleRowSelection(item,isselected);
          })
        })
      }
      //去重
      ,unique(ary,uniquekey){
        let uniquekeys = [];
        let uniqueAry = [];
        ary = JSON.parse(JSON.stringify(ary));
        for(let i = 0;i<ary.length;i++){
          let uniqueValue = ary[i][uniquekey];
          let isIncludes = uniquekeys.includes(uniqueValue)
          if(isIncludes){
            break;
          }
          uniqueAry.push(ary[i]);
        }
        return uniqueAry;
      },
      // 列宽数据
      async requestTableDataSetting() {
        if(!this.settingUrl) {
          return;
        }
        let promiseRes = await Http.post('/sys/sysListOrder/getListRule', {
          url: this.settingUrl,
          userId: this.$store.state.global.userInfo.userId
        })
        this.getListRule = promiseRes.data ? JSON.parse(promiseRes.data) : [];
        this.getTableDataSetting();
        return true;

      },
      // 获取表格设置数据
      getTableDataSetting() {
        if(!this.getListRule.length) {return};
        this.tableSettingOk = false;
        let tableColumnSettingOld = [];
        let dTableColumn = this.formatterColumn(this.tableColumn) || [];
        let columns = this.$refs.elTable.columns || [];
        // console.log(dTableColumn)
        let dTableColumnNew = [];
        dTableColumn.forEach((item, index) => {
          if(this.typeArr.includes(item.type)) {
            item.isShow = 1;
          };
          item.level = 1;
          // 查询后端返回列表是否已经存了这个对象
          let obj = this.getListRule.find(d => d.name === item.label);
          if(obj) {
            item.isShow = obj.isShow;
            item.orderNum = obj.orderNum || null;
            if(obj.width) {
              // 如果返回的数据有这个表头，则用数据的宽度
              item.minWidth = obj.width;
              item.width = null;
            }
            if(index === dTableColumn.length-1) {
              item.minWidth = item.minWidth+35;
            }
          }else {
            // 否则使用默认的
            let defalutObj = columns.find(c => c.label === item.label) || {};
            item.minWidth = defalutObj.realWidth || 80;
            item.width = null;
            item.isShow = 1;
          }
          
          // 有二级表头的情况
          if(item.children) {
            item.children = item.children.map((c, cIndex) => {
              c.parentIndex = index;
              c.level = 2;
              let cobj = obj && obj.children && obj.children.find(el => c.label === el.name);
              if(cobj) {
                c.isShow = cobj.isShow;
                c.orderNum = cobj.orderNum || null;
                if(cobj.width) {
                  // 如果返回的数据有这个表头，则用数据的宽度
                  c.minWidth = cobj.width;
                  c.width = null;
                }
              }else {
                // 否则使用默认的
                let defalutObjC = columns.find(co => co.label === c.label) || {};
                c.minWidth = defalutObjC.realWidth || 80;
                c.width = null;
                c.isShow = 1;
              }
              return c;
            });
            item.width = item.children.reduce((cur, next) => {
              return cur+next.width;
            }, 0)
          }
          tableColumnSettingOld.push(item);
        })
        this.tableColumnSettingOld = this.deepCopy(tableColumnSettingOld);

        // 筛选显示的表头
        dTableColumnNew = tableColumnSettingOld.filter(t => t.isShow)
        dTableColumnNew = this.deepCopy(dTableColumnNew);
        dTableColumnNew = dTableColumnNew.map(d => {
          let dObj = this.deepCopy(d);
          if(dObj.children) {
            dObj.children = dObj.children.filter(c => c.isShow) || [];
            dObj.children = dObj.children.sort(this.compare('orderNum'))
          }
          return dObj;
        })
        this.dTableColumn = dTableColumnNew.sort(this.compare('orderNum'));
        
        // 表格重新布局
        this.$nextTick(function() {
          this.tableSettingOk = true;
          this.$refs.elTable && this.$refs.elTable.doLayout();
        })
      },
      deepCopy(obj) {
        var result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key]!==null) {
              result[key] = this.deepCopy(obj[key]);   //递归复制
            } else {
              result[key] = obj[key];
            }
          }
        }
        return result;
      },
      // 排序
      compare(proto){
        return function(a,b){
          var value1 = a[proto];
          var value2 = b[proto];
          return value1 - value2;
        }
      },
      // 表格设置弹窗
      showTableSettingDialog(){
        this.tableSettingVisible = true;
        this.defaultTableSetting();
      },
      // 弹窗初始数据
      defaultTableSetting() {
        let colunms = this.$refs.elTable.columns;
        let hasType = false;
        // console.log(this.$refs.elTable)
        let tableDataSetting = [];
        let tableColumnSettingOld = (this.tableColumnSettingOld.length ? this.tableColumnSettingOld : this.dTableColumn) || [];
        // console.log(tableColumnSettingOld)
        // let tableColumnSettingOld = (this.tableColumnSettingOld.length ? this.tableColumnSettingOld : colunms) || [];
        tableColumnSettingOld.forEach((item, index) => {
          let includeType = this.typeArr.includes(item.type);
          if(includeType) {
            // 是否有前面的type，有就为true
            hasType = true;
            return
          };
          let obj = {
            isShow: item.isShow==null ? 1 : item.isShow,
            name: item.label,
            orderNum: item.orderNum || (!this.getListRule.length ? (hasType ? index:index+1) : null),
            width: item.minWidth,
            fixed: item.fixed,
            level: 1,
            children: null,
            id: item.label+index
          }
          // 有二级表头的情况
          if(item.children) {
            obj.children = item.children.map((c, cIndex) => {
              let cobj = {
                name: c.label,
                orderNum: c.orderNum || cIndex+1,
                width: c.minWidth,
                level: 2,
                id: obj.id+c.label+cIndex,
                isShow: c.isShow==null ? 1 : c.isShow,
                parentIndex: index // 父级索引
              }
              let cresult = colunms.find(d => d.label === c.label);
              if(cresult) {
                cobj.width = (cresult.width ? cresult.width : cresult.realWidth) || c.minWidth;
              }
              return cobj;
            });
            obj.width = obj.children.reduce((cur, next) => {
              return cur+next.width;
            }, 0)
          }
          let result = colunms.find(d => d.label === item.label);
          if(!result) {
            // 如果找不到
            tableDataSetting.push(obj);
            return;
          }
          if(!item.children) {
            obj.width = (result.width ? result.width : result.realWidth) || item.minWidth;
          }
          if(index === this.dTableColumn.length-1) {
            obj.width = obj.width-35;
          }
          tableDataSetting.push(obj);
        })
        this.tableDataSetting = [...tableDataSetting];
        // console.log(this.tableDataSetting)

      },
      // 排序改变
      orderNumChange(row, val) {
        let proName;
        if(row.level==2){
          let cIndex = this.tableDataSetting[row.parentIndex]['children'].findIndex(c => c.id === row.id);
          proName = this.tableDataSetting[row.parentIndex]['children'][cIndex];
        } else {
          let pIndex = this.tableDataSetting.findIndex(p => p.id === row.id);
          proName=this.tableDataSetting[pIndex];
        }
        this.$set(proName, 'orderNum', val);
      },
      // 是否显示改变
      isShowChange(row, val) {
        let proName;
        if(row.level==2){
          let cIndex = this.tableDataSetting[row.parentIndex]['children'].findIndex(c => c.id === row.id);
          proName = this.tableDataSetting[row.parentIndex]['children'][cIndex];
        } else {
          let pIndex = this.tableDataSetting.findIndex(p => p.id === row.id);
          proName=this.tableDataSetting[pIndex];
        }
        // let proName = this.tableDataSetting[index];
        this.$set(proName, 'isShow', val);
      },
      // 宽度改变
      widthChange(row, val) {
        let proName;
        if(row.level==2){
          let cIndex = this.tableDataSetting[row.parentIndex]['children'].findIndex(c => c.id === row.id);
          proName = this.tableDataSetting[row.parentIndex]['children'][cIndex];

        } else {
          let pIndex = this.tableDataSetting.findIndex(p => p.id === row.id);
          proName=this.tableDataSetting[pIndex];
        }
        // let proName = this.tableDataSetting[index];

        this.$set(proName, 'width', val);
        if(row.level==2) {
          this.$nextTick(() => {
            // 重新计算父级宽度
            let pwidth = this.tableDataSetting[row.parentIndex]['children'].reduce((cur, next) => {
              return cur+next.width;
            }, 0)
            this.$set(this.tableDataSetting[row.parentIndex], 'width', pwidth);

          })
        }
      },
      // 设置列表确认
      async tableSettingSubmit() {
        if(!this.tableDataSetting.length) return this.$message.warning('暂无可修改的内容');

        if(!this.judgePass(this.tableDataSetting)) return;
        
        this.tableSettingLoading = true;
        try{
          let promiseRes = await Http.post('/sys/sysListOrder/saveOrEdit', {
            url: this.settingUrl,
            userId: this.$store.state.global.userInfo.userId,
            orderJson: JSON.stringify(this.tableDataSetting)
          })
          this.tableSettingLoading = false;
          this.tableSettingVisible = false;
          if(promiseRes.code === 0) {
            this.$message.success('设置成功！');
            this.requestTableDataSetting();
            this.requestTableData();
          }

        } catch(e) {
          this.tableSettingLoading = false;
        }
      },
      // 设置表格确认判断
      judgePass(array, name) {
        let flag = array.some(s => !s.orderNum);
        if(flag) {
          this.$message.warning(`${name||''}排序不能为空或0`);
          return false;
        }
        flag = array.some(s => s.orderNum > array.length);
        if(flag) {
          this.$message.warning(`${name||''}排序不能大于${array.length}`);
          return false;
        }

        let arrNew = array.reduce((arr, currentObj) => {
          if(!arr.find(item => item.orderNum == currentObj.orderNum)) {
            return [...arr, currentObj];
          } else {
            return arr;
          }
        }, []);
        if(array.length > arrNew.length) {
          this.$message.warning(`${name||''}序号不能重复`);
          return false;
        }
        let finF = true;
        array.forEach(item => {
          if(item.children) {
            finF = this.judgePass(item.children, item.name);
          }
        })

        return finF;
      },
      // 当拖动表头改变了列的宽度的时候请求
      async headerDragend(newWidth, oldWidth, column, event) {
        if(!this.settingUrl) {return};
        this.defaultTableSetting();
        try{
          let promiseRes = await Http.post('/sys/sysListOrder/saveOrEdit', {
            url: this.settingUrl,
            userId: this.$store.state.global.userInfo.userId,
            orderJson: JSON.stringify(this.tableDataSetting)
          })
        } catch(e) {}
      },
    }
  };
</script>
