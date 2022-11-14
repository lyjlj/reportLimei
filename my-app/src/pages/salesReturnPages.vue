<template>
  <div>
    <div style="height:calc(100vh - 40px);overflow-y: scroll;">
      <van-cell-group>
        <van-field
          label-align="right"
          v-model="formData.ReturnId"
          label="售后编号："
          label-width="100"
          readonly
        />
        <van-field
          label-align="right"
          value="申请退货中"
          label="状态："
          label-width="100"
          readonly
        />
        <van-field
          label-align="right"
          v-model="formData.OrderId"
          label="订单编号："
          label-width="100"
          readonly
        />
        <van-field
          label-align="right"
          v-model="formData.ReturnReason"
          label="退货原因："
          label-width="100"
          readonly
        />
        <van-field
          label-align="right"
          v-model="formData.RefundAmount"
          label="申请退款金额："
          label-width="100"
          readonly
        />
        <van-field
          label-align="right"
          value="原路返回"
          label="退款途径："
          label-width="100"
          readonly
        />
        <van-field
          label-align="right"
          v-model="formData.Quantity"
          label="退款途径："
          label-width="100"
          readonly
        />

        <van-field
          label-align="right"
          v-model="formData.UserRemark"
          label="买家备注："
          label-width="100"
          readonly
        />
        <!-- <van-field
        label-align="right"
        v-model="formData.ReturnId"
        label="订单金额："
        label-width="100"
        readonly
      /> -->
        <van-field
          label-align="right"
          type="number"
          v-model="formData.RefundAmountPlus"
          label="确认退款金额："
          label-width="100"
          placeholder="请输入退款金额"
        />
        <van-field
          label-align="right"
          v-model="formData.AdminShipAddress"
          label="收货地址："
          label-width="100"
          placeholder="请输入收货地址"
        />
        <van-field
          label-align="right"
          v-model="formData.AdminShipTo"
          label="收货人："
          label-width="100"
          placeholder="请输入收货人"
        />
        <van-field
          label-align="right"
          v-model="formData.AdminCellPhone"
          label="收货人电话："
          label-width="100"
          placeholder="请输入收货人电话"
        />
        <van-field
          label-align="right"
          type="textarea"
          v-model="formData.AdminRemark"
          label="管理员备注："
          label-width="100"
          placeholder="请输入管理员备注"
        />
      </van-cell-group>
    </div>
    <div
      style="width: 100%;position: fixed;bottom: 0;border-top: 1px solid #d8d8d8;"
    >
      <div style="display: flex;justify-content: space-around;margin: 10px;">
        <van-button type="info" @click="handleReturns">确认退货</van-button>
        <van-button type="danger" @click="handleRefufs">拒绝退货</van-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        AdminRemark: "",
        RefundMoney: 0
      }
    };
  },
  methods: {
    //确认退货
    handleReturns() {
      const ReturnId =
        this.getUrlParam("ReturnId") == undefined
          ? ""
          : this.getUrlParam("ReturnId");

      const url =
        "https://www.daogoujingling.com/api/wechatApplet.ashx?customId=1079&action=AcceptReturn";

      let paramsObj = {
        ReturnId: ReturnId, //	退款Id
        AdminShipAddress: this.formData.AdminShipAddress,
        AdminCellPhone: this.formData.AdminCellPhone,
        AdminRemark: this.formData.AdminRemark, //备注
        RefundMoney: this.formData.RefundAmountPlus, //退款金额
        AdminShipTo: this.formData.AdminShipTo
      };

      console.log("paramsObj", paramsObj);
      return;

      Dialog.confirm({
        title: "标题",
        message: "是否确定退货？"
      })
        .then(() => {
          console.log("on confirm");
          this.$axios
            .get(url, {
              params: paramsObj
            })
            .then(res => {
              console.log("保存", res);
              Toast.success(res.data.Message || "退货成功!");
            })
            .catch(() => {
              Toast.fail(res.data.Message || "退货失败!");
            });
        })
        .catch(() => {
          console.log(" on cancel");
        });
    },
    // 拒绝退货
    handleRefufs() {
      const ReturnId =
        this.getUrlParam("ReturnId") == undefined
          ? ""
          : this.getUrlParam("ReturnId");

      const url =
        "https://www.daogoujingling.com/api/wechatApplet.ashx?customId=1079&action=RefuseReturn";

      let paramsObj = {
        ReturnId: ReturnId,
        AdminRemark: this.formData.AdminRemark //备注
      };

      console.log("paramsObj", paramsObj);
      return;

      this.$axios
        .get(url, {
          params: paramsObj
        })
        .then(res => {
          console.log("保存", res);
          Toast.success(res.data.Message || "拒绝退货!");
        })
        .catch(() => {
          Toast.fail(res.data.Message || "拒绝退货失败!");
        });
    },
    // 裁剪url参数
    getUrlParam(key) {
      let searchString = window.location.hash;
      searchString = searchString.replace("#/?", "");

      const pathArr = searchString.split("&");
      console.log("pathArr", pathArr);

      for (let i of pathArr) {
        const kv = i.split("=");
        if (kv[0] == key) {
          return kv[1];
        }
      }
    }
  },
  mounted() {
    console.log("this.$route.params", this.$route.query);

    this.formData = {
      ...this.formData,
      ...this.$route.query,
      RefundAmountPlus: 0 //确认退款金额
    };
  }
};
</script>
<style lang=""></style>
