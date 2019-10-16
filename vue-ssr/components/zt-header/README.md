# 正通头部组件

## 描述
头部组件是项目中非常重要一个组件，必须依赖最新组件。它提供了以下几个功能：
* 请求登录验证接口，判断用户是否登录，如果没有登录跳转到登录界面重新登陆
* 判断进入的项目是否有权限，如果没有权限跳到端口选择界面，重新选择
* 选择门店功能
* 退出登录功能

## 属性

|属性|描述|
|:--|:--|
|platform|平台名，默认值 store，有 store、group |
|mounted| 加修饰符 .sync ,主要用来判断 zt-header 中的用户信息是否请求完成|
|selportHome|选择端口的跳转页面|
|loginHome|登录跳转页面|


## 对外 store

 |属性|描述|
 |:--|:--|
 |global/setFoursId|对外提供 foursId,如果是门店就是 String,集团是 Array，门店id|
 |global/setFoursName|对外提供 foursName,如果是门店就是 String,集团是 Array,门店名称|
 |global/setUserInfo|对外提供 userInfo,用户信息|