/*
*  @描述：门店选择组件
*  @作者：巫旋茜
*  @创建时间：2019/10/08
*/
<template>
  <div class="zt__selectfours">
    <div class="zt__selectfours-select">
      <el-select
        v-model="foursIds"
        multiple
        collapse-tags
        placeholder="全部门店"
        size="small">
        <el-option
          v-for="item in tableDataInit"
          :key="item.idx"
          :label="item.shortName"
          :value="item.foursId">
        </el-option>
      </el-select>
      <div class="mask" @click="foursDialogVisible = true"></div>
    </div>
    <el-dialog
      title="选择门店"
      :visible.sync="foursDialogVisible"
      width="920px"
      :close-on-click-modal="false"
      :append-to-body="true"
      class="zt__selectfours-dialog">
      <div class="zt__selectfours-choose">
        <span>已选择门店（{{selectionChooseList.length || 0}}）</span>
        <span class="clear" @click="clearAll"><i class="el-icon-delete"></i> 清除全部</span>
      </div>
      <div class="zt__selectfours-chooselist">
        <el-tag
          v-for="(tag, idx) in selectionChooseList"
          :key="tag.idx"
          closable
          effect="dark"
          type="info"
          @close="closeTag(tag, idx)">
          {{tag.shortName}}
        </el-tag>
      </div>
      <!-- 下面部分 -->
      <el-form class="filter-box flex_lc" size="small" :inline="true" @keyup.enter.native="getFourseList" @submit.native.prevent>
        <el-form-item>
          <el-input size="small" placeholder="请输入门店名字/编号" v-model.trim="requestParams.name" clearable> </el-input>
        </el-form-item>
        <el-form-item>
          <el-select size="small" v-model="requestParams.code" clearable filterable placeholder="所属品牌部">
            <el-option
              v-for="item in brandDepartment"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select size="small" v-model="requestParams.ztBrandId" clearable filterable placeholder="所属品牌" @visible-change="visibleZtBrandId">
            <el-option
              v-for="item in brandList"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="getFourseList">查询</el-button>
          <el-button size="small" @click="resetFun">重置</el-button>
        </el-form-item>
      </el-form>
      <el-checkbox v-model="checked" class="dialog_choose" @change="chooseAll" :disabled="!tableData.length">全部门店</el-checkbox>
      <zt-table
        ref="table"
        :tableColumn="tableColumn"
        :tableData="tableData"
        :getSelection.sync="selectionList"
        :loading="tableLoading"
        :maxHeight="400"
        @select="selectTable"
        @handleCurrentChange="handleCurrentChangeFn"
        @select-all="selectAllTable"
        @mouted='ztTableMouted'
      >
        <!-- @select-all="selectTable" -->
      </zt-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="foursDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmList" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ztTable from "zt-table";
  // import ztTable from "../zt-table";
import ApiMixin from "./assets/js/api";
import { stringify } from "querystring"
import { parse } from "path"
export default {
  mixins:[ApiMixin],
  name: 'zt-selectfours',
  components:{
    ztTable
  },
  props: {
    foursIds: {
      type: Array,
      default() {
        return [];
      }
    },
    //默认全部选中
    initSeletedAll:{
      type:Boolean,
      default(){
        return false
      }
    }
  },
  data() {
    return {
      foursDialogVisible: false,
      requestParams: {
        name: '',
        ztBrandId: null,
        code: ''
      },
      tableLoading: false,
      tableDataInit: [],
      tableData: [],
      selectionList: [],
      tableColumn: [
        {type: 'selection'},
        { prop: 'storeCode', label: '编号'},
        { prop: 'shortName', label: '门店名称'},
        { prop: 'name', label: '品牌部'},
        { prop: 'brandName', label: '所属品牌'},
      ],
      // 品牌部
      brandDepartment: [],
      // 所属品牌
      brandList:[],
      // 全部选择
      checked: false,
      selectionChooseList: [],
    }
  },
  created() {
    this.getFourseList();
    this.getCode();
  },
  watch: {
    selectionChooseList(n) {
      if(n && n.length>0 && n.length===this.tableData.length) {
        this.checked = true;
      } else {
        this.checked = false;
      }
    },
    foursIds(n, o) {
      if(!n || !n.length) {
        this.clearAll();
      }
    },
    'requestParams.code' (n,o) {
      this.brandList = [];
      this.requestParams.ztBrandId='';
      if(n) {
        this.getBrand();
      }
    }
  },
  methods: {
    // 查询品牌部
    async getCode() {
      let res = await this.requestOrganizationGetBrandGroup();
      if(res.code ===0 ){
        this.brandDepartment = res.data || [];
      }
    },
    // 品牌下拉前
    visibleZtBrandId(status) {
      if(status && !this.requestParams.code) {
        this.$message.warning('请选择品牌部！');
      }
    },
    // 根据品牌部查询品牌
    async getBrand() {
      let res = await this.requestFoursBandQueryBrandsByCode(this.requestParams.code);
      if(res.code ===0 ){
        this.brandList = res.data || [];
      }
    },
    // 查询表格数据
    getFourseList() {
      this.tableLoading = true;
      this.$refs.table && (this.$refs.table.dCurrentPage = 1);
      // this.clearAll();
      let p = this.requestSysFoursGetOrgFoursSelective(this.requestParams);
      p.then(res => {
        this.tableLoading = false
        if(res.code == 0) {
          let data = res.data || [];
          this.tableData = data.map((item, index) => {
            item.idx = item.storeCode+item.code+(item.brandId||'').toString();
            return item;
          })
          if(this.tableDataInit.length < this.tableData.length) {
            this.tableDataInit = JSON.parse(JSON.stringify(this.tableData))
          }
          // this.$refs.table && this.$refs.table.toggleSelection(this.selectionChooseList, 'idx');
          if(this.initSeletedAll){
              this.selectionChooseList = JSON.parse(JSON.stringify(this.tableData))
              let foursIds = this.selectionChooseList.map(t => t.foursId) || [];
              this.$emit("update:foursIds", foursIds);
          }
          this.$nextTick(() => {
            if(this.selectionChooseList.length>0 && this.selectionChooseList.length===this.tableData.length) {
              this.checked = true;
            } else {
              this.checked = false;
            }
          })
        }
      })
      p.catch(e => {
        this.tableLoading = false;
      })
    },
    // 重置
    resetFun() {
      this.requestParams.name='';
      this.requestParams.ztBrandId=null;
      this.requestParams.code = '';
      this.$refs.table && (this.$refs.table.dCurrentPage = 1);
      this.getFourseList();
      // this.clearAll();
    },
    // 清除全部
    clearAll() {
      this.checked = false;
      this.$refs.table && this.$refs.table.$emit('clearSelection');
      this.selectionChooseList = [];
      this.selectionList = [];
    },
    // 全部选择
    chooseAll(val) {
      if(val) {
        // this.$refs.table.$emit('toggleAllSelection');
        this.$refs.table.toggleSelection(this.tableData, 'idx');
        this.$nextTick(() => {
          this.selectionChooseList = JSON.parse(JSON.stringify(this.tableData));
          this.selectionList = JSON.parse(JSON.stringify(this.tableData));
        })
      } else {
        this.$refs.table.$emit('clearSelection');
        this.selectionChooseList = [];
        this.selectionList = [];
      }
    },
    // 单独勾选某一行
    selectTable(selection, item) {
      // this.checked = false;
      let has = selection.find(s => s.idx === item.idx);
      if(has) {
        let hasChoose = this.selectionChooseList.find(s => s.idx === item.idx);
        hasChoose || this.selectionChooseList.push(item);
      } else{
        let idx = this.selectionChooseList.findIndex(e => e.idx == item.idx);
        this.selectionChooseList.splice(idx, 1);
      }

    },
    // 全选表格
    selectAllTable(data=[], currentdata=[]) {
      // console.log(data, this.selectionList)
      currentdata.forEach(item => {
        this.selectTable(data, item);
      })
    },
    // 点击某一页
    handleCurrentChangeFn() {
      if(this.checked) {
        this.$refs.table.$emit('clearSelection');
        this.$refs.table.$emit('toggleAllSelection');
      } else {
        this.$refs.table.toggleSelection(this.selectionChooseList, 'idx');
      }
    },
    // 关闭tag
    closeTag(tag, idx) {
      this.selectionChooseList.splice(idx, 1);
      // this.selectionList = this.selectionList.filter(s => s.index !== tag.index);
      this.checked = false;
      this.$refs.table.toggleSelection(this.selectionChooseList, 'idx');
    },
    // 确定
    confirmList() {
      // if(!this.selectionChooseList.length) return this.$message.warning('请选择门店！');
      let foursIds = this.selectionChooseList.map(t => t.foursId) || [];
      this.$emit("update:foursIds", foursIds);
      this.foursDialogVisible = false;
    },
    ztTableMouted(){
      this.$refs.table.toggleSelection(this.selectionChooseList, 'idx');
    }
  }
}
</script>
<style scoped lang="scss">
.zt__selectfours /deep/{
  .zt__selectfours-select {
    position: relative;
    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 2;
      top: 0;
      left: 0;
      cursor: pointer;
    }
    .el-select .el-tag__close.el-icon-close {
      display: none;
    }
  }
}
.zt__selectfours-dialog /deep/{
  .el-dialog__body {
    padding-top: 0;
  }
  .el-form--inline .el-form-item {
    margin-bottom: 10px;
  }
  .dialog_choose {
    margin-bottom: 5px;
    margin-left: 10px;
  }
  .zt__selectfours-choose {
    .clear {
      cursor: pointer;
      display: inline-block;
      margin-left: 10px;
      cursor: pointer;
      color: #FA5555;
    }
  }
  .zt__selectfours-chooselist {
    padding: 0 15px;
    margin: 10px -15px;
    max-height: 90px;
    overflow-y: auto;
    position: relative;
    .el-tag {
      margin-bottom: 10px;
      margin-right: 10px;
    }
  }

}
</style>