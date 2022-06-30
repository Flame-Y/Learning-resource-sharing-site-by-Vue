<template>
  <div>
    <Row>
      <Col
        span="6"
        :gutter="16"
        v-for="(user, index) in passageData"
        :key="index"
        class="bigbox"
      >
        <div class="box" @click="getPassageResource(user.id), (modal1 = true)">
          <h3>{{ user.title }}</h3>
          <p>{{ user.content }}</p>
        </div>
      </Col>
      <router-link to="/passage">查看更多文章</router-link>
    </Row>
    <Modal
      v-model="modal1"
      class="dialog"
      cancel-text=""
      :styles="{ top: '20px' }"
      width="800"
    >
      <h2>{{ passageResource[0].title }}</h2>
      <Divider orientation="left">内容</Divider>
      <p>{{ passageResource[0].content }}</p>
      <Divider orientation="left">评论</Divider>
      <List>
        <p v-if="passageResource[3].length === 0" class="noComment">暂无评论</p>
        <ListItem v-for="(user, index) in passageResource[3]" :key="index"
          >{{ user.name }} {{ user.content }}</ListItem
        >
      </List>
      <Divider orientation="left">下载</Divider>
      <p>下载地址：{{ passageResource[1][0].address }}</p>
      <p class="test">发布时间：{{ passageResource[0].time }}</p>
    </Modal>
  </div>
</template>
<script>
import { apiGetPassage, apiGetPassageResource } from "@/request/api/passage.js";

export default {
  name: "Software",
  data() {
    return {
      pageNo: 1,
      pageSize: 8,
      passageData: [],
      modal1: false,
      passageResource: [
        { content: "", title: "", time: "", id: 0 },
        [{ address: "" }],
        {},
        [],
      ],
    };
  },
  methods: {
    getPassage() {
      let me = this;
      apiGetPassage({ pageNo: this.pageNo, pageSize: this.pageSize })
        .then(function (response) {
          me.passageData = response.data.passageItem;
        })
        .catch((error) => {
          console.log("请求失败", error);
          me.getPassage();
        });
    },
    getPassageResource(id) {
      let me = this;
      apiGetPassageResource({ passageID: id })
        .then(function (response) {
          me.passageResource = response.data;
          if (me.passageResource[1][0] == undefined) {
            me.passageResource[1] = [{ address: "暂无" }];
          }
          me.passageTitle = me.passageResource[0].title;
          me.passageContent = me.passageResource[0].content;
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          this.getPassageResource(id);
        });
    },
  },
  created() {
    this.getPassage();
  },
};
</script>
<style scoped>
.bigbox {
  /* background-color: #f1f1f1; */
  cursor: hand;
}
.box {
  margin: 10px;
  height: 100px;
  background-color: #f1f1f1;
  text-align: center;

  /* transition: 0.5s; */
}
.bigbox :hover {
  background-color: #c1c1c1;
  transition: 0.7s;
  cursor: pointer;
}
.box a {
  color: #000;
}
.box h3 {
  margin-bottom: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.box p {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
a {
  color: #000;
  font-size: 16px;
  padding-left: 20px;
}
a:hover {
  color: pink;
}
.noComment {
  margin-bottom: 10px;
  /* text-align: center; */
}
.test {
  float: right;
  /* padding-bottom: 5px; */
  /* margin: 5px; */
}
.dialog /deep/ .ivu-modal-footer {
  margin-top: 10px;
}
</style>
