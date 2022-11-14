<template>
  <div>
    <div style="height:calc(100vh - 40px);overflow-y: scroll;">
      <van-cell-group>
        <van-field
          v-model="formData.RefundId"
          label="售后编号："
          label-width="100"
          label-align="right"
          readonly
        />
        <van-field
          value="退款中"
          label="状态："
          label-width="100"
          label-align="right"
          readonly
        />
        <van-field
          v-model="formData.OrderId"
          label="订单编号："
          label-width="100"
          label-align="right"
          readonly
        />
        <van-field
          v-model="formData.RefundReason"
          label="退款原因："
          label-width="100"
          label-align="right"
          readonly
        />
        <van-field
          v-model="formData.RefundAmount"
          label="申请退款金额："
          label-width="100"
          label-align="right"
          readonly
        />
        <van-field
          value="原路返回"
          label="期望退款途径："
          label-width="100"
          label-align="right"
          readonly
        />
        <van-field
          v-model="formData.UserRemark"
          label="买家备注："
          label-width="100"
          label-align="right"
          readonly
        />
        <van-field
          v-model="formData.OrderTotal"
          label="订单总金额："
          label-width="100"
          label-align="right"
          readonly
        />
        <van-field
          type="number"
          v-model="formData.RefundMoney"
          label="确认退款金额："
          label-width="100"
          label-align="right"
          placeholder="请输入退款金额"
        />
        <van-field
          type="textarea"
          v-model="formData.AdminRemark"
          label="管理员备注："
          label-width="100"
          label-align="right"
          placeholder="请输入管理员备注"
        />
      </van-cell-group>
    </div>
    <div
      style="width: 100%;position: fixed;bottom: 0;border-top: 1px solid #d8d8d8;"
    >
      <div style="display: flex;justify-content: space-around;margin: 10px;">
        <van-button type="info" @click="handleRefund">确认退款</van-button>
        <van-button type="danger" @click="handleRefufs">拒绝退款</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog } from "vant";
import { Toast } from "vant";
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
    //确认退款
    handleRefund() {
      const RefundId =
        this.getUrlParam("RefundId") == undefined
          ? ""
          : this.getUrlParam("RefundId");

      const url =
        "https://www.daogoujingling.com/api/wechatApplet.ashx?customId=1079&action=AcceptRefund";

      let paramsObj = {
        RefundId: RefundId, //	退款Id
        AdminRemark: this.formData.AdminRemark, //备注
        RefundMoney: this.formData.RefundMoney //退款金额
      };

      console.log("paramsObj", paramsObj);
      // return;

      Dialog.confirm({
        title: "标题",
        message: "是否确定退款？"
      })
        .then(() => {
          console.log("on confirm");
          this.$axios
            .get(url, {
              params: paramsObj
            })
            .then(res => {
              console.log("保存", res);
              Toast.success(res.data.Message || "退款成功!");
            })
            .catch(() => {
              Toast.fail(res.data.Message || "退款失败!");
            });
        })
        .catch(() => {
          console.log(" on cancel");
        });
    },
    // 拒绝退款
    handleRefufs() {
      const RefundId =
        this.getUrlParam("RefundId") == undefined
          ? ""
          : this.getUrlParam("RefundId");

      const url =
        "https://www.daogoujingling.com/api/wechatApplet.ashx?customId=1079&action=RefuseRefund";

      let paramsObj = {
        RefundId: RefundId, //	退款Id
        AdminRemark: this.formData.AdminRemark //备注
      };

      console.log("paramsObj", paramsObj);

      this.$axios
        .get(url, {
          params: {
            ...paramsObj
          }
        })
        .then(res => {
          Toast.success(res.data.Message || "已拒绝退款!");
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
      ...this.$route.query
    };
  }
};
</script>
<style lang=""></style>
