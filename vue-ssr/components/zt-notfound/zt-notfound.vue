/*
*  @描述：404页面
*  @作者：巫旋茜
*  @创建时间：2019-03-07
*/
<template>
  <div class="notfound">
    <div class="notfound__box">
      <img class="notfound__box-img" src="./assets/images/errorpic.png">
      <div class="notfound__box-text">
        <p>对不起~没有找到你请求的页面</p>
        <p>你可以 <span class="router__link" @click="goBack()">返回上级</span> 或 <span class="router__link" @click="goHome()">返回首页</span></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'notFound',
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goHome() {
      this.$router.push('/');
    }
  }
}
</script>
<style lang="scss" scoped>
.notfound__box {
  width: 440px;
  margin: 60px auto 0;
  .notfound__box-img {
    width: 440px;
  }
  .notfound__box-text {
    margin-top: 40px;
    font-size: 14px;
    color: #9B9B9B;
    text-align: center;
    line-height: 2;
  }
  .router__link {
    cursor: pointer;
  }
}
</style>

