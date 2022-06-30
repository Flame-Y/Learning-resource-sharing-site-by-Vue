<template>
  <div class="demo-split">
    <Split v-model="split" min="400px" max="400px">
      <Card slot="left" class="demo-split-pane left">
        <Table
          border
          :columns="columns"
          :data="userData"
          highlight-row
          @on-row-click="onclick"
          :loading="loading()"
        >
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row }}</strong>
          </template>
        </Table>
        <Page
          :total="listTotal * 10"
          size="small"
          show-elevator
          @on-change="change"
          class="page"
        />
      </Card>
      <Card slot="right" class="demo-split-pane right">
        <Input
          search
          enter-button
          placeholder="输入需要查询的用户名"
          v-model="search"
          @on-search="searchUser"
        />
        <Divider />
        <h1>ID: {{ userId }}</h1>
        <Divider />
        <h1>用户名: {{ userName }}</h1>
        <Divider />
        <h1>密码: {{ userPassword }}</h1>
      </Card>
    </Split>
  </div>
</template>
<script>
import { apiGetUser, apiSearchUser } from "@/request/api/admin.js";
export default {
  data() {
    return {
      columns: [
        {
          title: "ID",
          key: "userId",
          ellipsis: true,
          sortable: true,
        },
        {
          title: "用户名",
          key: "username",
          ellipsis: true,
        },
        {
          title: "密码",
          key: "password",
        },
      ],
      userData: [],
      userId: "",
      userName: "",
      userPassword: "",
      split: 0.5,
      //   split2: 0.5,
      pageNo: 1,
      pageSize: 10,
      listTotal: 0,
      search: "",
    };
  },
  methods: {
    loading() {
      if (this.userData.length == 0) {
        return true;
      } else {
        return false;
      }
    },
    change(page) {
      this.pageNo = page;
      //   this.passageData.length = 0;
      this.getUser();
      // 切换页数
    },
    getUser() {
      let me = this;
      apiGetUser({ pageNo: this.pageNo, pageSize: this.pageSize })
        .then(function (response) {
          //   console.log(response.data[1].match(/\d+(.\d+)?/g)[0]);
          me.listTotal = response.data[1].match(/\d+(.\d+)?/g)[0] - 0; //经典接口返回多此一举的值
          me.userData = response.data[0];
        })
        .catch((error) => {
          console.log("请求失败", error);
        });
    },
    onclick(data, b) {
      this.userId = data.userId;
      this.userName = data.username;
      this.userPassword = data.password;
    },
    searchUser() {
      let me = this;
      apiSearchUser({ name: this.search })
        .then(function (response) {
          if (response.data == "") {
            me.$Message.error("用户不存在");
          } else if (me.search == "") {
            me.$Message.error("输入不能为空");
          } else {
            me.userId = response.data.userId;
            me.userName = response.data.username;
            me.userPassword = response.data.password;
            me.search = "";
          }
        })
        .catch((error) => {
          console.log("请求失败", error);
        });
    },
  },
  created() {
    this.getUser();
  },
};
</script>
<style>
.demo-split {
  height: calc(100vh - 59px);
  border: 1px solid #dcdee2;
}
.demo-split-pane {
  padding: 10px;
}
.left,
.right {
  height: calc(100vh - 59px);
}
</style>
