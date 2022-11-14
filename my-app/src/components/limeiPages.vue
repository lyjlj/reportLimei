<template>
  <div id="lmService">
    <div>111111111111111111111111</div>
    <!-- 搜素栏 -->
    <van-sticky>
      <div style="background-color: white;">
        <van-row type="flex" justify="center" align="center">
          <van-col
            span="20
          "
          >
            <div
              style="display: flex;margin-left: 5px;border:1px solid #c0c0c0;border-radius: 10px;padding: 2px;"
            >
              <!-- 下拉框 -->
              <select
                @change="onSelectChange"
                v-model="chosedOptinOne"
                style="width: 80px;border: 0px;outline:none;background: white;"
              >
                <option
                  :value="i.value"
                  v-for="i in selectList"
                  :key="i.value"
                  >{{ i.label }}</option
                >
              </select>

              <form action="/">
                <van-search
                  style="padding:2px 0px;margin-right: 5px;"
                  v-model="value"
                  show-action
                  left-icon=""
                  placeholder="请输入搜索关键词"
                >
                  <!-- @search="onSearch" -->
                  <template #action>
                    <div @click="onSearch(value)">搜索</div>
                  </template>
                </van-search>
              </form>
            </div>
          </van-col>
          <!-- <div style="background-color:#FCDE7E;"></div> -->
          <!-- <van-col span="5">
            <van-button
              style="color: #494949;background-color:#FCDE7E ;"
              size="small"
              @click="handleNewOrder"
              >新建订单</van-button
            >
          </van-col> -->

          <van-col span="3">
            <van-button
              style="color: white;background-color:#00437C ;"
              size="small"
              @click="handleRefresh"
              >刷新</van-button
            >
          </van-col>
        </van-row>

        <!-- 筛选 -->
        <van-row type="flex" justify="center" align="center">
          <van-col
            span="5"
            style="border: 0;font-size: 15px;background-color: #fff;"
            >筛选：</van-col
          >
          <van-col span="19">
            <van-dropdown-menu>
              <van-dropdown-item
                get-container="body"
                title="订单时间"
                ref="dateRef"
              >
                <!-- 订单时间 -->
                <van-cell
                  title="选择日期区间"
                  :value="date"
                  @click="show = true"
                />
                <van-calendar
                  v-model="show"
                  type="range"
                  :min-date="minDate"
                  :max-date="maxDate"
                  @confirm="onConfirm_date"
                  @unselect="onUnselect_date"
                />

                <div
                  style="padding: 5px 16px;display: flex;justify-content: space-between;"
                >
                  <van-button
                    style="width: 200px;"
                    type="danger"
                    size="small"
                    block
                    round
                    @click="handleDateEmpty"
                  >
                    置空
                  </van-button>
                  <van-button
                    style="width: 200px;margin-left: 10px;"
                    type="danger"
                    size="small"
                    block
                    round
                    @click="handleDateRange"
                  >
                    确认
                  </van-button>
                </div>
              </van-dropdown-item>

              <van-dropdown-item title="订单来源" ref="merchantRef">
                <!-- 合作商户 -->
                <van-picker
                  :title="merchantTitle"
                  show-toolbar
                  :columns="columns"
                  value-key="label"
                  cancel-button-text="置空"
                  @confirm="onConfirmPicker"
                  @cancel="onCancelPicker"
                  @change="onChangePicker"
                />
              </van-dropdown-item>
            </van-dropdown-menu>
          </van-col>
        </van-row>
      </div>
    </van-sticky>

    <!-- 盒子 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="handleOnload(page)"
      :error.sync="error"
      error-text="加载失败,请重试!"
    >
      <div v-if="orderList.length > 0">
        <div class="listBox" v-for="(citem, cindex) in orderList" :key="cindex">
          <div class="list_title">
            <p>订单号：{{ citem.orderid }}</p>
            <p style="margin-left: 10px;">会员名称：{{ citem.ordername }}</p>
          </div>

          <hr />

          <div class="detail_box">
            <div class="detail_img">
              <img
                style="width: 100%;height:100%;"
                :src="citem.userUploadImage1"
                mode="scaleToFill"
              />
            </div>

            <div class="detail_text">
              <p align="left">提交时间:{{ citem.ordertime }}</p>
              <p align="left">订单总计:{{ citem.ordertotal }}</p>
              <p align="left">备注:{{ citem.orderbz }}</p>
            </div>
          </div>

          <hr />

          <div class="footer_box">
            <van-row type="flex" justify="center" align="center">
              <van-col span="10" style="color:#00437C"
                >状态：{{ citem.orderState }}</van-col
              >
              <van-col span="14" type="flex" justify="space-between">
                <!-- <router-link to="/limeiPagesTow" active-class="active"
                  >修改价格</router-link
                > -->
                <van-button
                  style="color: white;background-color:#00437C ;margin-left: 5px;"
                  size="small"
                  @click="handleUpdate(citem)"
                  >修改价格</van-button
                >
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
      <!-- 空数据占位图 -->
      <div v-else>
        <van-empty style="padding: 32px 0px 0px 0px;" />
      </div>
    </van-list>

    <!-- 子路由 -->
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import { Toast } from "vant";

export default {
  name: "web",
  data() {
    return {
      chosedOptinOne: "realname", //，默认 '客户名称'
      merchantTitle: "请选择商户",
      active: "",
      value: "",
      date: "",
      dateScope: [],
      show: false,
      error: false,
      loading: false,
      finished: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      // columns: ["杭州", "宁波", "温州", "绍兴", "湖州", "嘉兴", "金华", "衢州"],
      columns: [
        { label: "PC端订单", value: "PC端订单" },
        { label: "淘宝订单", value: "淘宝订单" },
        { label: "微信订单", value: "微信订单" },
        { label: "微信订单", value: "微信订单" },
        { label: "触屏版订单", value: "触屏版订单" },
        {
          label: "生活号(原支付宝服务App订单)",
          value: "生活号(原支付宝服务App订单)"
        },
        { label: "京东订单", value: "京东订单" },
        { label: "微信小程序", value: "微信小程序" }
      ],
      // tabList: ["全部", "未接单", "维修中", "待打款", "未确认", "已完成"],
      tabList: [
        {
          label: "全部",
          value: ""
          // value: "全部"
        },
        {
          label: "未接单",
          value: 0
          // value: "待师傅确认"
        },
        {
          label: "维修中",
          value: 3
          // value: "维修中"
        },
        {
          label: "待验收",
          value: 4
          // value: "待验收"
        },
        {
          label: "待打款",
          value: 5
          // value: "待打款"
        },
        {
          label: "已完成",
          value: 6
          // value: "已完成"
        }
      ],
      selectList: [
        {
          label: "订单编号",
          value: "realname"
        },
        {
          label: "会员名称",
          value: "workername"
        },
        {
          label: "商品名称",
          value: "workername2"
        },
        {
          label: "收货人",
          value: "workername3"
        }
      ],
      orderList: [
        // {
        //   pono: 11111111,
        //   name: "真棒啊你",
        //   img:
        //     "https://uat-jewelry.oss-cn-shenzhen.aliyuncs.com//1078/Storage/master/product/images/1010300001.jpg?x-oss-process=image/resize,h_410,w_410",
        //   ss: 111,
        //   kz: 222,
        //   wxxm: 333,
        //   hhz: 444
        // },
        // {
        //   pono: 11111111,
        //   name: "真棒啊你",
        //   img:
        //     "https://uat-jewelry.oss-cn-shenzhen.aliyuncs.com//1078/Storage/master/product/images/1010300001.jpg?x-oss-process=image/resize,h_410,w_410",
        //   ss: 111,
        //   kz: 222,
        //   wxxm: 333,
        //   hhz: 444
        // }
      ],
      page: {
        current: 1,
        pageSize: 5,
        status: ""
      }
    };
  },
  methods: {
    // 下拉选择
    onSelectChange(val) {
      // console.log(this.chosedOptinOne);
    },
    // 搜索
    async onSearch(val) {
      // console.log(val);
      // console.log(this.chosedOptinOne);
      // Toast(val);

      this.loading = true;
      this.finished = false;
      this.orderList = [];

      this.page = {
        ...this.page,
        current: 1,
        pageSize: 5,
        [this.chosedOptinOne]: val
      };

      // 查询数据
      await this.handleOnload(this.page);
    },

    // 清理搜索栏
    // onCancel() {
    //   Toast("取消");
    // },

    // 新建订单
    handleNewOrder() {
      const workerid =
        this.getUrlParam("workerid") == undefined
          ? ""
          : this.getUrlParam("workerid");

      const url = `http://uatdev.unionalltech.com/preview.html?appId=0e970815-85a2-4f14-81d0-0cb49b6bafb3&pageId=0b4360d8-56b4-49e3-9271-a1a022e7b333&token=C882700339B1F816C8B8D508FE26095AFDFD27E9C811C2056DE708B9D08817AE&workerid=${workerid}`;
      window.location.href = url;
    },

    // 刷新
    handleRefresh() {
      this.orderList = [];
      const params = {
        current: 1,
        pageSize: 5,
        status: this.page.status
      };
      this.handleOnload(params);
    },

    // 上拉底部更新
    // onLoad(page) {
    //   console.log(page);
    //   return;
    //   this.handleOnload(this.page);
    // },

    // 加载数据
    async handleOnload(paramsObj = {}) {
      // console.log(paramsObj);

      // this.loading = true;

      const userid =
        this.getUrlParam("userid") == undefined
          ? ""
          : this.getUrlParam("userid");
      const workerid =
        this.getUrlParam("workerid") == undefined
          ? ""
          : this.getUrlParam("workerid");

      // const url =
      // "https://spapi.zhuanyegou.com/api/values?action=UserOrderShopServicesMain_WeiXin_GetList&returntype=childtables&userid=&customid=1079";

      // const url = `https://spapi.zhuanyegou.com/api/values?action=UserOrderShopServicesMain_GetList&customid=1079&userid=${userid}&workerid=${workerid}`;
      const url = `https://spapi.zhuanyegou.com/api/values?action=UserOrderShopServicesMain_WeiXin_GetList&customid=1079&returntype=tables&userid=${userid}&workerid=${workerid}`;

      await this.$axios
        .get(url, {
          params: {
            ...paramsObj
          }
        })
        .then(async res => {
          // console.log(res);
          const { data, code, total } = res.data;

          console.log("total", total);

          if (code == 0) {
            let current = this.page.current;
            this.page.current = ++current;

            // let dataList = await this.responseHandler(data.Result_0);
            let dataList = [
              {
                orderid: "202210113977145-1",
                ordertime: "2022-10-11 15:20:36",
                ordername: "YSC_0175049",
                ordertotal: "1件，0.00克,0.01 元",
                orderState: "等待买家付款",
                orderbz: "自动根据一级分类拆单,一级分类:对戒"
              },
              {
                orderid: "202210113977145-1",
                ordertime: "2022-10-11 15:20:36",
                ordername: "YSC_0175049",
                ordertotal: "1件，0.00克,0.01 元",
                orderState: "等待买家付款",
                orderbz: "自动根据一级分类拆单,一级分类:对戒"
              },
              {
                orderid: "202210113977145-1",
                ordertime: "2022-10-11 15:20:36",
                ordername: "YSC_0175049",
                ordertotal: "1件，0.00克,0.01 元",
                orderState: "等待买家付款",
                orderbz: "自动根据一级分类拆单,一级分类:对戒"
              }
            ];

            // console.log("dataList", dataList);

            if (dataList) {
              this.orderList.push(...dataList);
              // console.log("length", this.orderList.length);
              // console.log("finished", this.finished);
              // 加载状态结束
              this.loading = false;

              // 数据全部加载完成
              if (this.orderList.length >= total) {
                this.finished = true;
              }
            }
          }
        })
        .catch(err => {
          this.error = true;
          this.loading = false;
        });
    },

    // 格式化事件
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },

    //  选中日期区间
    onConfirm_date(date) {
      // console.log("确认选中", date);
      const [start, end] = date;
      this.show = false;
      this.dateScope = date.map(item => {
        return (item = this.formatDate(item));
      });
      this.date = `${this.formatDate(start)} / ${this.formatDate(end)}`;
    },

    // 取消选中日期
    onUnselect_date(date) {
      // console.log("取消选中", date);
      // const [start, end] = date;
      this.show = false;
      this.date = ``;
    },

    // 置空日期
    handleDateEmpty() {
      if (!this.date) {
        return Toast("数据已置空!");
      }

      this.orderList = [];
      this.date = "";

      this.page = {
        ...this.page,
        current: 1,
        pageSize: 5,
        createtime_start: "",
        createtime_end: ""
      };

      this.handleOnload(this.page);
    },

    // 确认日期区间事件
    handleDateRange() {
      // console.log("时间区间", this.date);
      // console.log("时间区间2", this.dateScope);
      if (!this.date) {
        return Toast("请选择时间范围！");
      }
      this.loading = true;
      this.finished = false;
      this.orderList = [];

      this.page = {
        ...this.page,
        current: 1,
        pageSize: 5,
        createtime_start: this.dateScope[0],
        createtime_end: this.dateScope[1]
      };

      this.handleOnload(this.page);

      this.$refs.dateRef.toggle(false); //隐藏菜单
    },

    // 选中合作商户
    onChangePicker(_, val) {
      // Toast(`当前值：${value}, 当前索引：${index}`);
      // console.log(val);
      Toast(`当前选中：${val.label}`);
      this.merchantTitle = val.label;
    },

    // 置空合作商户
    onCancelPicker() {
      Toast("置空选择！");

      this.merchantTitle = "请选择商户";

      this.page = {
        ...this.page,
        current: 1,
        pageSize: 5,
        membertypedesc: ""
      };

      this.$refs.merchantRef.toggle(false);
      this.handleOnload(this.page);
    },

    // 确认合作商户
    onConfirmPicker(val) {
      // console.log("val", val);
      // Toast(`当前值：${val.label}, 当前索引：${val.value}`);

      this.loading = true;
      this.finished = false;
      this.orderList = [];

      this.page = {
        ...this.page,
        current: 1,
        pageSize: 5,
        membertypedesc: val.value //合作商户
      };

      this.$refs.merchantRef.toggle(false);

      this.handleOnload(this.page);
    },

    // 按钮文字 处理
    handleBtnText({ statusid }) {
      // console.log("居然可以！", statusid);
      let btnText = "";
      switch (statusid) {
        case 0:
          btnText = "师傅评估";
          break;
        case 3:
          btnText = "维修完成";
          break;
        default:
          btnText = "操作订单";
      }
      return btnText;
    },

    // 修改订单
    hanleEditOrder(descno) {
      // console.log("descno", descno);

      const workerid =
        this.getUrlParam("workerid") == undefined
          ? ""
          : this.getUrlParam("workerid");

      // alert('用户标识' + this.getUrlParam("workerid"))

      const url = `http://uatdev.unionalltech.com/preview.html?appId=0e970815-85a2-4f14-81d0-0cb49b6bafb3&pageId=0b4360d8-56b4-49e3-9271-a1a022e7b333&token=C882700339B1F816C8B8D508FE26095AFDFD27E9C811C2056DE708B9D08817AE&descno=${descno}&workerid=${workerid}`; //新版本2

      window.location.href = url;
    },

    // 修改价格 -跳转页
    handleUpdate(dataObj) {
      console.log("dataObj", dataObj);

      this.$router.push({ path: "limeiPagesTow", query: dataObj });
    },

    // 裁剪url参数
    getUrlParam(key) {
      let searchString = window.location.hash;
      searchString = searchString.replace("#/?", "");
      // console.log(window.location);
      // alert(searchString);
      const pathArr = searchString.split("&");
      for (let i of pathArr) {
        const kv = i.split("=");
        if (kv[0] == key) {
          return kv[1];
        }
      }
    },

    // 时间格式化
    timeFormatSeconds(time) {
      var d = time ? new Date(time) : new Date();
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var hours = d.getHours();
      var min = d.getMinutes();
      var seconds = d.getSeconds();

      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      if (hours < 0) hours = "0" + hours;
      if (min < 10) min = "0" + min;
      if (seconds < 10) seconds = "0" + seconds;

      // return (year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + seconds);
      return year + "-" + month + "-" + day;
    },

    // 格式化数据
    responseHandler(data) {
      // console.log("格式化数据", data);

      let formatData = data.map(item => {
        let userImage = item.Child[0].userUploadImage1;
        let tmp = item.Child[0].productdesc
          ? JSON.parse(item.Child[0].productdesc)
          : {};
        let total = item.Child.reduce(
          (sum, aitem) => (sum += aitem.customerneedpay),
          0
        );

        let wxejStr = "";

        if (tmp.维修二级) {
          tmp.维修二级.forEach(citem => {
            let key = citem.name;
            let value = citem.count;
            let keyorvalue = `${key},数量：${value}|`;
            wxejStr += keyorvalue;
          });
        }

        return {
          detailStr: wxejStr || "暂无",
          shoushi: tmp.首饰成色 || "暂无",
          baoshizl: tmp.宝石种类 || "暂无",
          kezhong: tmp.克量 || "暂无",
          weixiuxm: tmp.维修项目 || "暂无",
          hanhouz: tmp.焊后重 || "暂无",
          userUploadImage1: userImage,
          wxCount: item.Child.length,
          wxPriceTotal: total,
          ...item
        };
      });

      // console.log("formatData", formatData);

      return formatData || [];
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
#lmService {
  left: 0;
  right: 0;
  /* height: 100vh; */
  text-align: center;
  margin-top: 5px;
}

.listBox {
  margin: 10px 20px;
  padding: 0;
  background-color: white;
  border: 2px solid #c0c0c0;
  border-radius: 10px;
}

/* .listBox_b {
  margin: 10px 10px;
  padding: 0;
  background-color: white;
  border: 2px solid #c0c0c0;
  border-radius: 10px;
} */

.list_title {
  display: flex;
  margin: 0px 10px;
  font-size: 12px;
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

.detail_text {
  flex: 3;
  margin-left: 10px;
  font-size: 12px;
}
.detail_text p {
  margin: 0;
}

.footer_box {
  font-size: 12px;
  /* line-height: 32px; */
  margin-bottom: 5px;
}
</style>
