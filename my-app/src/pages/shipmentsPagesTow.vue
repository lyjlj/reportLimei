<template>
  <div>
    <div class="topBox-sty">
      <div
        class="listBox"
        v-for="(item, index) in shopList.LineItems"
        :key="index"
      >
        <div class="detail_box">
          <div class="detail_img">
            <img
              style="width: 100%;height:100%;"
              :src="item.Image"
              mode="scaleToFill"
            />
          </div>
          <div class="detail_textBox">
            <!-- <div style=" display: flex;"> -->
            <div class="detail_text">
              <p align="right">商品名称：</p>
              <p>{{ item.Name }}</p>
            </div>
            <div class="detail_text">
              <p align="right">货号：</p>
              <p>{{ item.ProductCode }}</p>
            </div>
            <!-- </div> -->

            <!-- <div style=" display: flex;"> -->
            <div class="detail_text">
              <p align="right">供应商单号：</p>
              <p>{{ item.Amount }}</p>
            </div>

            <div class="detail_text">
              <p align="right">商品单件(元)：</p>
              <p>{{ item.Price }}</p>
            </div>
            <!-- </div> -->

            <div style=" display: flex;">
              <div class="detail_text">
                <p align="right">购买数量：</p>
                <p>{{ item.Amount }}</p>
              </div>
              <div class="detail_text">
                <p align="right">发货数量：</p>
                <p>{{ item.Amount }}</p>
              </div>
            </div>

            <!-- <div style=" display: flex;"> -->
            <div class="detail_text">
              <p align="right">小计(元)：</p>
              <p>{{ item.Amount * item.Price }}</p>
            </div>
            <div class="detail_text">
              <p align="right">备注：</p>
              <p>{{ item.ProductRemark }}</p>
            </div>
            <!-- </div> -->
          </div>
        </div>
      </div>
    </div>

    <div>
      <van-cell-group>
        <van-field v-model="formData.OrderDate" label="收货时间：" readonly />
        <van-field
          v-model="formData.Address"
          label="收货信息："
          label-width="80"
          readonly
        />
        <van-field
          v-model="formData.Remark"
          label="买家备注："
          label-width="80"
          readonly
        />
        <van-field
          name="picker"
          v-model="formData.ExpressCompanyName"
          label="物流公司："
          label-width="80"
          placeholder="请选择物流公司"
          @click="showPicker = true"
        />
        <van-field
          v-model="formData.ShipOrderNumber"
          label="快递单号："
          label-width="80"
          placeholder="请输入快递单号"
        />
      </van-cell-group>

      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="companyColumns"
          @confirm="onConfirm"
          @cancel="showPicker = false"
        />
      </van-popup>
    </div>
    <div
      style="width: 100%;position: fixed;bottom: 0;border-top: 1px solid #d8d8d8;"
    >
      <div style="display: flex;justify-content: space-around;margin: 10px;">
        <van-button size="large" type="primary" @click="handleShipments"
          >发货</van-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      showPicker: false,
      formData: {},
      companyColumns: [],
      shopList: []
    };
  },
  methods: {
    loadData() {
      const OrderId =
        this.getUrlParam("OrderId") == undefined
          ? ""
          : this.getUrlParam("OrderId");

      const workerid =
        this.getUrlParam("workerid") == undefined
          ? ""
          : this.getUrlParam("workerid");

      console.log("OrderId", OrderId);

      const url = `https://www.daogoujingling.com/api/wechatApplet.ashx?customId=1079&action=GetOrderDetail`;

      this.$axios
        .get(url, {
          params: {
            orderId: this.formData.OrderId,
            userid: workerid
          }
        })
        .then(res => {
          console.log("获取订单明细", res);
          let dataObj = res.data.Data;
          console.log("dataObj", dataObj);

          // return;

          this.shopList = {
            LineItems:
              dataObj.Suppliers.length > 0 ? dataObj.Suppliers[0].LineItems : [] //商品明细
          };
          console.log("shopList", this.shopList);
        });
    },
    // 发货
    handleShipments() {
      const OrderId =
        this.getUrlParam("OrderId") == undefined
          ? ""
          : this.getUrlParam("OrderId");

      const url =
        "https://www.daogoujingling.com/api/wechatApplet.ashx?customId=1079&action=OrderSendGoods";

      let paramsObj = {
        OrderId: this.formData.OrderId,
        ShipOrderNumber: this.formData.ShipOrderNumber, //物流单号
        ExpressCompanyName: this.formData.ExpressCompanyName //物流公司名称
      };

      console.log("paramsObj", paramsObj);
      // return;

      this.$axios
        .get(url, {
          params: paramsObj
        })
        .then(res => {
          console.log("保存", res);
          Toast.success(res.data.msg || "发货成功!");
        })
        .catch(() => {
          Toast.fail(res.data.msg || "发货失败!");
        });
    },
    onConfirm(value) {
      // console.log("value", value);
      this.formData = {
        ...this.formData,
        ExpressCompanyName: value
      };
      this.showPicker = false;
    },
    // 裁剪url参数
    getUrlParam(key) {
      let searchString = window.location.hash;
      searchString = searchString.replace("#/?", "");

      const pathArr = searchString.split("&");
      // console.log("pathArr", pathArr);

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

    const url =
      "https://www.daogoujingling.com/API/WeChatApplet.ashx?action=GetExpressList&CustomId=1079";

    this.$axios.get(url, {}).then(res => {
      console.log("res", res);
      let data = res.data.Data;
      this.companyColumns = data.map(item => item.ExpressName);
    });

    this.loadData();
  }
};
</script>
<style lang="scss" scoped>
.topBox-sty {
  height: calc(100vh - 300px);
  width: 100%;
  overflow-y: scroll;
}

.listBox {
  margin: 10px 20px;
  padding: 0;
  background-color: white;
  border: 2px solid #c0c0c0;
  border-radius: 10px;
}

.detail_box {
  display: flex;
  margin: 10px 10px;
}

.detail_img {
  width: 102px;
  height: 165px;
  border: 1px solid #c0c0c0;
}
.detail_textBox {
  font-size: 16px;
  display: flex;
  flex-direction: column;
}
.detail_text {
  white-space: nowrap;
  display: flex;
  align-items: center;
}
.detail_text p {
  margin: 2px;
}
.detail_text p:nth-child(1) {
  width: 100px;
  margin-left: 10px;
}
</style>
