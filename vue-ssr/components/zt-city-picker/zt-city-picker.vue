/*
*  @描述：省份-城市-区域联动选择器
*  @作者：邱康松
*  @创建时间：2019/1/4
*/

<template>
  <el-form inline ref="form" :model="form" :rules="rules">
    <el-form-item prop="provinceObj">
      <el-select placeholder="请选择省份" :style="'width:'+ width + 'px'" @change="changeProvince" v-model="form.provinceObj" value-key="id">
        <el-option v-for="item in provinceList" :value="item" :label="item.name" :key="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="cityObj">
      <el-select placeholder="请选择城市" :style="'width:'+ width + 'px'" @change="changeCity" v-model="form.cityObj" value-key="id">
        <el-option v-for="item in cityList" :value="item" :label="item.name" :key="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="areaObj">
      <el-select placeholder="请选择区域" :style="'width:'+ width + 'px'" v-model="form.areaObj" value-key="id">
        <el-option v-for="item in areaList" :value="item" :label="item.name" :key="item.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
  import api from './api';
  export default {
    mixins: [api],
    props: {
      width: { // 每个select的宽度
        type: [Number, String],
        default: 120
      },
      valid: { // 是否开启必填验证
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        parentCode: '1', //接口传参 传1是获取省份列表
        type: 'p', // 获取列表的类型 p:省份列表 c:城市列表 a:区域列表
        typeObj: {
          p: 'provinceList',
          c: 'cityList',
          a: 'areaList'
        },
        form: {
          provinceObj: null,
          cityObj: null,
          areaObj: null,
        },
        provinceList: [], //省份列表
        cityList: [], //城市列表
        areaList: [], //区域列表
        rule: {
          provinceObj: [
            { required: true, message: '请选择省份', trigger: 'change' }
          ],
          cityObj: [
            { required: true, message: '请选择城市', trigger: 'change' }
          ],
          areaObj: [
            { required: true, message: '请选择区域', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.getList();
    },
    computed: {
      rules() {
        return this.valid ? this.rule : {};
      }
    },
    watch: {
      'form.areaObj': function(val) {
        if (val) {
          this.$emit('input',{
            provinceObj: {
              name: this.form.provinceObj.name,
              code: this.form.provinceObj.code,
              id: this.form.provinceObj.id
            },
            cityObj: {
              name: this.form.cityObj.name,
              code: this.form.cityObj.code,
              id: this.form.cityObj.id
            },
            areaObj: {
              name: this.form.areaObj.name,
              code: this.form.areaObj.code,
              id: this.form.areaObj.id
            }
          });
        } else {
          this.$emit('input',null)
        }
      }
    },
    methods: {
      validate() {
        let valid1 = false;
        this.$refs['form'].validate(valid => {
          if (valid) {
            valid1 =  true;
          } else {
            valid1 =  false;
          }
        });
        return valid1;
      },
      clearValidate() {
        this.$refs['form'].resetFields();
      },
      getList() {
        let list = this.typeObj[this.type];
        this.getArea({
          parentCode: this.parentCode
        }).then(res => {
          if (res.code === 0) {
            this[list] = res.data || [];
          }
        })
      },
      changeProvince(obj) {
        this.parentCode = obj.code;
        this.type = 'c';
        this.form.cityObj = null;
        this.form.areaObj = null;
        this.getList();
      },
      changeCity(obj) {
        this.parentCode = obj.code;
        this.type = 'a';
        this.form.areaObj = null;
        this.getList();
      },
    }
  }
</script>

<style scoped>

</style>