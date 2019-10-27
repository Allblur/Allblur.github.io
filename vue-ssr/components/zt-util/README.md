# js 基础工具库

### 描述
该工具是项目内的一些通用的方法。

### 使用

安装： `cnpm install zt-util@latest --save`  
引入： `import Util from "zt-util"`  
使用例: 
```
import Util from "zt-util"
Util.numberFormat(909090.98099);

```


### 对外提供

| 属性名 |描述|
| :----- | :----- |
| numberFormat | 格式化金额 |
| deepCopy | 深拷贝 |


### 参数

1.**numberFormat**
| 顺序 | 参数 | 类型 | 描述 | 默认值 |
| 1 | :----- | :----- | :----- | :----- |
| 2 | number | Number/String | 要格式化的数字 |  |
| 3 | decimals | Number | 保留几位小数 | 2 |
| 4 | unit | String | 单位 |  |
| 5 | dec_point | String | 小数点符号 | '.' |
| 6 | thousands_sep | String | 千分位符号 | ',' |
| 7 | roundtag | String | 舍入参数('floor'向下取/'ceil' 向上取/'round' 四舍五入) | 'floor' |
