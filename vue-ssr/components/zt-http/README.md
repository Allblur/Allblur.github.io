# Ajax 底层基础配置

### 安装
`npm install zt-http --save`

### 引入
`import Http from "zt-http"`

### 对外提供

| 属性名 |描述|
| :----- | :----- |
|get|发起 Get 请求|
|post|发起 POST 请求|
|put|发起 PUT 请求|
|Delete|发起 Delete 请求|
|axios|对外提供 axios 对象，可修改基础配置|
|apiPrefix|接口网关，分类下面有介绍|

### apiPrefix 属性

| 属性名 |前缀|描述|
| :----- | :----- |
| customerApi | /cus |潜客|
| vehicleApi | /veh |车型库|
| systemApi | /sys |系统|
| fitClass | /veh/fitClass |配件分类|
| fitBrand | /veh/fitBrand |配件品牌分类接口|
| fitExtProperty | /veh/fitExtProperty |配件(零件)规格接口|
| comarea | /sys/comarea |省市区域查询接口|
| upload | /upl |上传接口网关|
| equ | /equ |设备|
| act | /act |财务管理|
| security | /security |安全|