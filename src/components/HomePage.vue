<template>
  <div class="layout">
    <Layout :style="{ padding: '0 50px' }">
      <Card>
        <displayPanel />
      </Card>
      <Divider />
      <!-- <div style="min-height: 200px">软件</div> -->
      <Row style="padding: 20px">
        <Col span="18">
          <Card :bordered="false" class="passage">
            <Software v-if="haveToken()" />
            <div class="needLogin" v-if="!haveToken()">
              <router-link to="/login">登录</router-link>
              <h2>后即可查看</h2>
            </div>
          </Card>
        </Col>
        <Col span="5" offset="1">
          <Card :padding="0" class="board" :bordered="false">
            <noticeBoard />
          </Card>
        </Col>
      </Row>
      <Divider />
      <Card :style="{ 'margin-bottom': '1.5rem', padding: '8px' }">
        <div style="min-height: 200px" class="send">
          <h2>有什么新鲜事告诉大家</h2>
          <Input
            v-model="inputValue"
            type="textarea"
            :autosize="{ minRows: 5 }"
            class="textarea"
            :disabled="!haveToken()"
          />
          <i-button type="error" @click="addComment">发射犇犇！</i-button>
        </div>
      </Card>
      <Card :padding="0" class="board" :bordered="false">
        <List :footer="listFooter" border size="large" :loading="loading()">
          <h1>留 言 板</h1>
          <Divider></Divider>

          <ListItem v-for="(user, index) in listData" :key="index">{{
            user.content
          }}</ListItem>
          <Page
            :total="listTotal * 10"
            size="small"
            show-elevator
            @on-change="change"
          />
        </List>
      </Card>
    </Layout>
  </div>
</template>

<script>
import navigationbar from "@/components/navigationbar";
import displayPanel from "@/components/displayPanel";
import Software from "@/components/Software";
import noticeBoard from "@/components/noticeBoard";
import { apiGetComment, apiAddComment } from "@/request/api/hall.js";

export default {
  components: { navigationbar, displayPanel, Software, noticeBoard },
  data() {
    return {
      thisRouter: "",
      pageNo: 1,
      pageSize: 10,
      inputValue: "",
      listData: [],
      listFooter: "",
      listTotal: 0,
    };
  },
  methods: {
    loading() {
      if (this.listData.length == 0) {
        return true;
      } else {
        return false;
      }
    },
    haveToken() {
      if (window.sessionStorage.getItem("token")) {
        return true;
      } else {
        return false;
      }
    },
    change(page) {
      this.pageNo = page;
      this.getComment();
      // 切换页数
    },
    getComment() {
      let me = this;
      let data = new URLSearchParams();
      data.append("pageNo", this.pageNo);
      data.append("pageSize", this.pageSize);
      apiGetComment(data)
        .then(function (response) {
          me.listData = response.data[0];
          me.listFooter = response.data[2];
          var numArr = me.listFooter.match(/\d+/g);
          me.listTotal = numArr[0] - 0;
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          this.getComment();
        });
    },
    addComment() {
      let me = this;
      if (this.inputValue == "") {
        me.$Message.error("发送内容不能为空");

        return;
      }
      apiAddComment(this.inputValue)
        .then(function (response) {
          if (response.data == "insertSuccessfully!") {
            me.$Message.success("发送成功");
            me.inputValue = "";
            me.getComment();
          }
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          this.addComment();
        });
    },
  },
  created() {
    // this.getPassage();
    // this.getNotice();
    this.getComment();
    this.$store.commit("getNewUsername", "");
    this.$store.commit("getNewPassword", "");
  },
};
</script>

<style scoped>
.layout {
  /* border: 1px solid #d7dde4; */
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.needLogin {
  text-align: center;
  padding-top: 60px;
  height: 200px;
}
.passage h2 {
  display: inline-block;
}
.passage a {
  display: inline-block;
  font-size: 21px;
  font-weight: 700;
}
.send h2 {
  margin-bottom: 16px;
}
.send .textarea {
  margin-bottom: 15px;
}
.textarea /deep/ .ivu-input {
  font-size: 1.3rem;
}
.board {
  text-align: center;
}
.board .ivu-divider {
  margin: 0;
  top: 0%;
}
.board h1 {
  padding-top: 10px;
  height: 70px;
  text-align: center;
  margin: auto;
  font-size: 40px;
}
</style>