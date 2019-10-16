## 描述
该组件是将 `elementui` 中的 `el-table`、`el-pagination` 整合在一起，并通过属性来进行控制表格的显示效果

## 使用方式

先将本地仓库修改 `npm set registry http://113.98.231.67:10008`

安装：`cnpm install zt-table@latest --save`

使用：
```
import ztTable from "zt-table";

export default {
	components:{
		ztTable
	}
}

<zt-table></zt-table>

```

## 属性

| 属性名 | 类型 |描述|默认值|
| :----- | :----- |   :----- | :----|
|rowKey|String|列的唯一标志，实现翻页也保持勾选状态必传||
|table-data|Array|表格数据|[]|
|table-column | Array|表头数据|[]|
|current-page |Number|当前页面|1|
|paginationbg|Boolean|是否现在分页背景色|true|
|pageSizes|Array|每页显示多少条的选项数|[10,20,50,100]|
|pageSize|Number|每页显示多少条数|0|
|pageCount|Number|总页数|0|
|request|Function|表格请求数据函数||
|requestParams|Object|表格请求数据的传参||
|getSelection|Array|设置选中的列表，使用 .sync 可实现双向绑定 |[]|
|selectableFilter|Function|是否禁用复选框的函数||
|pagination|Boolean|是否分页|true|
|spanMethod|Function|合并行或列的计算方法||
|tableDataFormatter|Function|对 request 请求到的数据进行格式化||
|loading | Boolean |是否有加载效果||
|element-loading-text | String |表格 loading 文字提示||
|radioLabel| String |单选 label||
|selectRadio||选中的 Radio||
|isBackTop|Boolean|点击分页后是否回到表头处|true|
|maxHeight|String/Number|Table 的最大高度||

### table-column  参数

**这里仅显示了部分参数，如果有需要可以在组件里面添加进入**

| 属性名 | 类型 |描述|可选值|默认值|
| :----- | :----- |   :----- | :----|:----|
|reserve|Boolean|是否开启勾选状态保存，在type为radio或selection可传|true/false|false
|type|string|对应列的类型。|radio/index/selection|selection|
|width|string|列宽度||50px|
|label|string|表头名称|||
|formatter|function|格式化表格数据|||
|fixed|Boolean|是否固定|true/false|false|
|show-overflow-tooltip|Boolean|当内容过长被隐藏时显示 tooltip|true/false|false|
|children|Array|多级表头数据，目前只支持二级表头|[]|||

## 函数

| 属性名 |描述|
| :----- | :----- |
|requestTable|表格发起请求函数|
|handleSizeChange|修改每页的条数回调|
|handleCurrentChange|点击某一页回调|
|handlePrevClick|点击上一页回调|
|handleNextClick|点击下一页回调|
|select-all|点击全选按钮回调|
|select|勾选某一行回调|


