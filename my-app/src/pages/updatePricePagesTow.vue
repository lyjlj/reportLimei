<template>
  <div id="limeiPagesTow">
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
          <!-- <div class="detail_text">
            <p align="left">商品描述:{{ item.ProductRemark }}</p>
            <p align="left">商品单件:{{ item.Price }}</p>
            <p align="left">购买数量:{{ item.Amount }}</p>
            <p align="left">发货数量:{{ item.Amount }}</p>
            <p align="left">总价:{{ item.Amount * item.Price }}</p>
          </div> -->
          <div class="detail_textBox">
            <div class="detail_text">
              <p align="right">商品描述：</p>
              <p>{{ item.ProductRemark || 11111 }}</p>
            </div>
            <div class="detail_text">
              <p align="right">商品单件：</p>
              <p>{{ item.Price }}</p>
            </div>
            <div class="detail_text">
              <p align="right">购买数量：</p>
              <p>{{ item.Amount }}</p>
            </div>
            <div class="detail_text">
              <p align="right">发货数量：</p>
              <p>{{ item.Amount }}</p>
            </div>
            <div class="detail_text">
              <p align="right">总价：</p>
              <p>{{ item.Amount * item.Price }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      style="position:fixed;height: 30px;line-height: 30px;bottom: 132px;padding-right: 10px;left: 0px;right: 0px;text-align: right;border-top: 1px solid silver;"
    >
      商品金额(元)：{{ shopList.OrderAmount }}
    </div>
    <div class="shopNumBox">
      <!-- <div>涨价或减价：￥1000</div>
      <div>订单实收款：￥10000</div> -->

      <!-- <van-field v-model="editPrice" type="text" label="商品金额(元)" /> -->
      <div style="display: flex;">
        <van-field
          v-model="shopList.CouponAmount"
          type="text"
          label="打折优惠"
          disabled
        />
        <van-field v-model="shopList.Freight" type="text" label="运费" />
      </div>
      <div style="display: flex;">
        <van-field
          v-model="shopList.AdjustedDiscount"
          type="text"
          label="涨价或减价"
        />
        <van-field
          v-model="shopList.OrderTotal"
          type="text"
          label="订单实收款"
          disabled
        />
      </div>
    </div>

    <div class="saveBtn_sty" @click="handleUpdateSave">保存</div>
  </div>
</template>
<script>
import { Dialog } from "vant";
import { Toast } from "vant";
export default {
  name: "web",
  data() {
    return {
      editPrice: 0,
      shopList: [
        // {
        // //   shopPic:
        // //     "https://uat-jewelry.oss-cn-shenzhen.aliyuncs.com//1027/Storage/master/product/images/38378296.jpg?x-oss-process=image/resize,h_180,w_180",
        // //   shopName: "商品1",
        // //   shopmiaosu: "描述1111",
        // //   shopPrice: 100,
        // //   shopgmSum: 1,
        // //   shopffSum: 1,
        // //   shopTotalSum: 100
        // // },
        // // {
        // //   shopPic:
        // //     "https://uat-jewelry.oss-cn-shenzhen.aliyuncs.com//1027/Storage/master/product/images/38378296.jpg?x-oss-process=image/resize,h_180,w_180",
        // //   shopName: "商品1",
        // //   shopmiaosu: "描述1111",
        // //   shopPrice: 100,
        // //   shopgmSum: 1,
        // //   shopffSum: 1,
        // //   shopTotalSum: 100
        // // },
        // // {
        // //   shopPic:
        // //     "https://uat-jewelry.oss-cn-shenzhen.aliyuncs.com//1027/Storage/master/product/images/38378296.jpg?x-oss-process=image/resize,h_180,w_180",
        // //   shopName: "商品1",
        // //   shopmiaosu: "描述1111",
        // //   shopPrice: 100,
        // //   shopgmSum: 1,
        // //   shopffSum: 1,
        // //   shopTotalSum: 100
        // // },
        // // {
        // //   shopPic:
        // //     "https://uat-jewelry.oss-cn-shenzhen.aliyuncs.com//1027/Storage/master/product/images/38378296.jpg?x-oss-process=image/resize,h_180,w_180",
        // //   shopName: "商品1",
        // //   shopmiaosu: "描述1111",
        // //   shopPrice: 100,
        // //   shopgmSum: 1,
        // //   shopffSum: 1,
        // //   shopTotalSum: 100
        // // }
      ]
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

      const url = `https://www.daogoujingling.com/api/wechatApplet.ashx?customId=1079&action=GetOrderDetail`;

      this.$axios
        .get(url, {
          params: {
            orderId: OrderId,
            userid: workerid
          }
        })
        .then(res => {
          console.log("获取订单明细", res);
          let dataObj = res.data.Data;
          console.log("dataObj", dataObj);

          this.shopList = {
            Freight: dataObj.Freight, //运费
            CouponAmount: dataObj.CouponAmount, //打折优惠
            AdjustedDiscount: dataObj.AdjustedDiscount, //涨价或减价
            OrderTotal: dataObj.OrderTotal, //订单实收款
            OrderAmount: dataObj.OrderAmount, //商品金额
            LineItems:
              dataObj.Suppliers.length > 0 ? dataObj.Suppliers[0].LineItems : [] //商品明细
          };
          console.log("shopList", this.shopList);
        });
    },
    // 保存
    handleUpdateSave() {
      const url = `https://www.daogoujingling.com/api/wechatApplet.ashx?customId=1079&action=EditOrder`;

      console.log(this.shopList);

      let paramsObj = {
        orderId: 202210247831060,
        AdjustedFreight: this.shopList.Freight, //运费
        AdjustedDiscount: this.shopList.AdjustedDiscount //涨价或减价
      };
      console.log("paramsObj", paramsObj);

      Dialog.confirm({
        title: "标题",
        message: "是否保存修改？"
      })
        .then(() => {
          console.log("on confirm");
          this.$axios
            .get(url, {
              params: paramsObj
            })
            .then(res => {
              console.log("保存", res);
              Toast.success(res.data.Message || "保存成功!");
              this.loadData();
            })
            .catch(() => {
              Toast.fail(res.data.Message || "保存失败!");
              this.loadData();
            });
        })
        .catch(() => {
          console.log(" on cancel");
        });
    },
    // 裁剪url参数
    getUrlParam(key) {
      let searchString = window.location.hash;
      searchString = searchString.replace("#/?", "");

      // console.log(window.location);
      // alert(searchString);
      const pathArr = searchString.split("&");
      console.log("pathArr", pathArr);

      for (let i of pathArr) {
        const kv = i.split("=");
        console.log("kv", kv);
        if (kv[0] == key) {
          return kv[1];
        }
      }
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>
<style lang="scss" scoped>
#limeiPagesTow {
}

.topBox-sty {
  height: calc(100vh - 148px);
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
  width: 80px;
  height: 100px;
  border: 1px solid #c0c0c0;
}

.detail_textBox {
  display: flex;
  flex-direction: column;
}
.detail_text {
  display: flex;
  align-items: center;

  /* margin-left: 10px;
  font-size: 12px; */
}
.detail_text p {
  margin: 0;
}
.detail_text p:nth-child(1) {
  width: 80px;
  margin-left: 10px;
}

.shopNumBox {
  position: fixed;
  bottom: 40px;
  left: 0;
  right: 0;
  font-size: 16px;
  border: 2px solid #c0c0c0;
}

.saveBtn_sty {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  color: #fff;
  background-color: aquamarine;
  text-align: center;
  line-height: 40px;
}
</style>
