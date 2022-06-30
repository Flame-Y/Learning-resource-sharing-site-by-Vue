<template>
  <div>
    <List border size="large" :loading="loading()">
      <h3>公 告 栏</h3>
      <Divider></Divider>

      <ListItem v-for="(user, index) in noticeData" :key="index">{{
        user.content
      }}</ListItem>
    </List>
  </div>
</template>

<script>
import { apiGetNotice } from "@/request/api/notice.js";

export default {
  data() {
    return { noticeData: [] };
  },
  methods: {
    loading() {
      if (this.noticeData.length == 0) {
        return true;
      } else {
        return false;
      }
    },
    getNotice() {
      let me = this;
      apiGetNotice()
        .then(function (response) {
          me.noticeData = response.data;
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          // this.getNotice();
        });
    },
  },
  created() {
    this.getNotice();
  },
};
</script>
<style scoped>
.ivu-divider {
  margin: 0;
  top: 0%;
}
h3 {
  height: 40px;
  text-align: center;
  margin: auto;
  font-size: 20px;
  padding-top: 5px;
}
</style>