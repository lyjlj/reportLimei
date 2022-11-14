<template>
  <div id="promotion">
    <!-- 搜素栏 -->
    <van-sticky>
      <div style="background-color: white;">
        <!-- 筛选 -->
        <van-row type="flex" justify="center" align="center">
          <van-col
            span="5"
            style="border: 0;font-size: 15px;background-color: #fff;"
            >筛选：</van-col
          >
          <van-col span="19">
            <van-dropdown-menu>
              <van-dropdown-item title="用户名" ref="merchantRef">
                <van-search
                  style="padding:2px 0px;margin-right: 5px;"
                  v-model="value"
                  show-action
                  left-icon=""
                  placeholder="请输入搜索关键词"
                >
                  <template #action>
                    <div @click="onSearch(value)">搜索</div>
                  </template>
                </van-search>
              </van-dropdown-item>

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
      <div v-if="serviceList.length > 0">
        <div
          class="listBox"
          v-for="(citem, cindex) in serviceList"
          :key="cindex"
        >
          <div class="detail_text">
            <div class="detail_textbb">
              <div>
                <p align="left">用户名:{{ citem.UserName }}</p>
                <p align="left">下单量:{{ citem.OrderNumber }}</p>
                <p align="left">累计消费:{{ citem.SaleTotalStr }}</p>
                <p align="left">申请时间:{{ citem.RequetDate }}</p>
              </div>
            </div>

            <div class="detail_textbb" style="margin-right: 10px;">
              <van-button
                style="color: white;background-color:#00437C ;"
                size="small"
                @click="hanleCheck(citem)"
                >审核</van-button
              >
            </div>
          </div>
        </div>
      </div>
      <!-- 空数据占位图 -->
      <div v-else>
        <van-empty style="padding: 32px 0px 0px 0px;" />
      </div>
    </van-list>

    <!-- 右侧弹出层 -->
    <van-popup
      v-model="popupShow"
      :style="{
        height: '420px',
        width: '300px',
        'text-align': 'left',
        'border-radius': '10px',
        padding: '10px'
      }"
      closeable
    >
      <div>
        <div v-for="(item, index) in formData" :key="index">
          <p>{{ item }}</p>
        </div>

        <div style="display:flex;flex-wrap: nowrap;height: 100px;">
          <div style="width:60px ;">备注：</div>
          <van-field
            style="border: 1px solid #d8d8d8;"
            v-model="refusalReason"
            autosize
            border
            type="textarea"
            placeholder="拒绝时请填写拒绝原因"
          />
        </div>

        <div
          style="display:flex ;justify-content: space-between;;bottom: 0;text-align: center;color: #fff;"
        >
          <div
            style="width:100px;height: 40px;line-height: 40px;background-color: #0091ea;margin: 10px;"
            @click="hanlePass()"
          >
            通过
          </div>
          <div
            style="width:100px;height: 40px;line-height: 40px;background-color: #f44336;margin: 10px;"
            @click="hanleRefuse()"
          >
            拒绝
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";

export default {
  name: "web",
  data() {
    return {
      chosedOptinOne: "UserName", //，默认 '客户名称'
      merchantTitle: "请选择商户",
      active: "",
      value: "",
      date: "",
      dateScope: [],
      show: false,
      error: false,
      loading: false,
      finished: false,
      popupShow: false,
      refusalReason: "", //原因描述
      UserId: "",
      formData: {},
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      selectList: [
        {
          label: "用户名",
          value: "UserName"
        }
      ],
      serviceList: [],
      page: {
        current: 1,
        pageSize: 5
      }
    };
  },
  methods: {
    // 搜索
    async onSearch(val) {
      console.log(val);
      this.loading = true;
      this.finished = false;
      this.serviceList = [];

      let params = {
        [this.chosedOptinOne]: val
      };

      // 查询数据
      await this.handleOnload(params);
    },

    // 审核
    hanleCheck(val) {
      // console.log("val", val);

      this.popupShow = true;
      let strArr = val.RequetReason.replaceAll("<br />", ",").split(",");
      strArr.unshift(`用户名:${val.UserName}`);
      // console.log("strArr", strArr);

      this.formData = strArr;
      this.UserId = val.UserId;
      // console.log("formData", this.formData);
    },
    // 通过
    hanlePass() {
      const url = `https://www.daogoujingling.com/api/wechatapplet.ashx?action=AcceptRequest&CustomId=1079`;
      this.$axios
        .get(url, {
          params: {
            UserId: this.UserId
          }
        })
        .then(async res => {
          console.log("通过", res);
          Toast("通过成功！");
          this.popupShow = false;
          await this.handleOnload({ current: 1, pageSize: 5 });
        });
    },
    // 拒绝
    hanleRefuse() {
      if (!this.refusalReason) {
        return Toast("请填写拒绝原因!");
      }

      const url = `https://www.daogoujingling.com/api/wechatapplet.ashx?action=RefuseRequest&CustomId=1079`;

      this.$axios
        .get(url, {
          params: {
            UserId: this.UserId,
            refusalReason: this.refusalReason //原因描述
          }
        })
        .then(async res => {
          console.log("拒绝", res);
          Toast("拒绝了推广员的申请！");
          this.popupShow = false;
          await this.handleOnload({ current: 1, pageSize: 5 });
        });
    },

    // 加载数据
    async handleOnload(paramsObj = {}) {
      const url = `https://www.daogoujingling.com/api/wechatapplet.ashx?action=GetListReferralRequest&CustomId=1079`;

      await this.$axios
        .get(url, {
          params: {
            ...paramsObj
          }
        })
        .then(async res => {
          console.log(res);
          const { data, code } = res.data;

          if (code == 0) {
            this.serviceList = data.Data;
            console.log(this.serviceList);

            let current = this.page.current;
            this.page.current = ++current;

            // 加载状态结束
            this.loading = false;
            this.finished = true;

            // 数据全部加载完成
            // if (this.serviceList.length >= total) {
            //   this.finished = true;
            // }
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

      this.serviceList = [];
      this.date = "";

      let params = {
        current: 1,
        pageSize: 5,
        DateEnd: "",
        DateStart: ""
      };

      this.handleOnload(params);
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
      this.serviceList = [];

      let params = {
        DateStart: this.dateScope[0],
        DateEnd: this.dateScope[1]
      };

      this.handleOnload(params);

      this.$refs.dateRef.toggle(false); //隐藏菜单
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
    }
  }
};
</script>

<style lang="scss" scoped>
#promotion {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
  font-size: 14px;
}
.detail_textbb {
  display: flex;
}
.detail_text p {
  margin: 6px;
}

.footer_box {
  font-size: 12px;
  /* line-height: 32px; */
  margin-bottom: 5px;
}
</style>
