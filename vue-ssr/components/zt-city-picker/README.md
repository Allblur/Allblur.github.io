# 省份-城市-区域联动选择器

### 安装
`npm install zt-city-picker --save`

### 引入
`import cityPicker from "zt-city-picker"`

### 使用
`<cityPicker v-model="regionObj" width="200" valid></cityPicker>`

### 参数

| 属性名 |描述|
| :----- | :----- |
|width|每个选择器的宽度,[string.number],默认120px|
|valid|是否开启必填验证，[boolean],默认false|

### 方法

| 方法名 |描述|
| :----- | :----- |
|validate|valid为true时，可调用此方法验证表单，返回值：true/false|
|clearValidate|清空验证|