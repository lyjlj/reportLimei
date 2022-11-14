<template>
  <div>
    <van-sticky>
      <van-tabs v-model="activeName" @click="onClickTab">
        <van-tab title="退款" name="a"></van-tab>
        <van-tab title="退货" name="b"></van-tab>
      </van-tabs>
    </van-sticky>
    <!-- 组件 -->
    <refund :loadData="dataList" :isPages="activeName" />
  </div>
</template>
<script>
import refund from "@/components/refundList.vue";
export default {
  components: {
    refund: refund
  },
  data() {
    return {
      activeName: "a",
      dataList: []
    };
  },
  methods: {
    // tab切换
    onClickTab(event) {
      this.activeName = event;

      console.log("event", this.activeName);

      return;

      this.dataList = [];
      let url = "";

      switch (event) {
        // 退款
        case "a":
          url =
            "https://www.daogoujingling.com/api/wechatApplet.ashx?customId=1079&action=GetRefundApplyList";
          break;
        // 退货
        case "b":
          url =
            "https://www.daogoujingling.com/api/wechatApplet.ashx?customId=1079&action=GetReturnsApplyList";
          break;
      }

      this.$axios
        .get(url, {
          params: {
            PageSize: 10
          }
        })
        .then(res => {
          console.log("获取订单列表", res);

          let data = res.data.data.Models;
          this.dataList = data;

          // 加载状态结束
          this.loading = false;

          console.log("dataList", this.dataList);
        });
    }
  },
  mounted() {
    // this.onClickTab("a"); //首次默认加载退款的列表
  }
};
</script>
<style lang=""></style>
