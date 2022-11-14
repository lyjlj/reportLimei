// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import axios from "axios";

// 引入组件
// import "vant/lib/index.css";
import { Tab, Tabs } from "vant";
import { Button } from "vant";
import { Search } from "vant";
import { Toast } from "vant";
import { Col, Row } from "vant";
import { Calendar } from "vant";
import { Cell, CellGroup } from "vant";
import { Picker } from "vant";
import { DropdownMenu, DropdownItem } from "vant";
import { Sticky } from "vant";
import { List } from "vant";
import { Empty } from "vant";
import { Popup } from "vant";
import { Field } from "vant";
import { Icon } from "vant";
import { Dialog } from "vant";
import {CheckboxGroup } from "vant"
import {Checkbox} from "vant"

// 全局注册
Vue.use(Dialog);
Vue.use(Icon);
Vue.use(Field);
Vue.use(Popup);
Vue.use(Empty);
Vue.use(List);
Vue.use(Sticky);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Picker);
Vue.use(Toast);
Vue.use(Search);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Button);
Vue.use(Col);
Vue.use(Row);
Vue.use(Calendar);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(CheckboxGroup)
Vue.use(Checkbox);

Vue.config.productionTip = false;

Vue.prototype.$axios = axios; //把axios挂载到vue上

/* eslint-disable no-new */
new Vue({
  el: "#app",
  axios,
  router,
  components: { App },
  template: "<App/>"
});
