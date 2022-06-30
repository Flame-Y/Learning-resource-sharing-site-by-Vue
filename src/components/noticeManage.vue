<template>
  <div>
    <Card :padding="0" class="table" :bordered="false">
      <Table
        border
        :columns="columns"
        :data="noticeData"
        no-data-text="暂无数据"
      >
        <template slot-scope="{ row }" slot="content">
          <p>{{ row.content }}</p>
        </template>
      </Table>
    </Card>
    <Card :style="{ 'margin-top': '2rem', padding: '8px' }" class="content">
      <div style="min-height: 200px" class="send">
        <h2>有什么新鲜事告诉大家</h2>
        <Input
          v-model="noticeContent"
          type="textarea"
          :autosize="{ minRows: 5 }"
          class="textarea"
        />
        <i-button type="error" @click="updateComment">更新公告</i-button>
      </div>
    </Card>
  </div>
</template>
<script>
import { apiGetNotice, apiUpdateComment } from "@/request/api/notice.js";

export default {
  data() {
    return {
      columns: [
        {
          title: "内容",
          slot: "content",
          align: "center",
        },
      ],
      noticeData: [],
      noticeContent: "",
    };
  },
  methods: {
    getNotice() {
      let me = this;
      apiGetNotice()
        .then(function (response) {
          me.noticeData = response.data;
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          this.getNotice();
        });
    },
    updateComment() {
      let me = this;
      let data = new URLSearchParams();
      data.append("content", this.noticeContent);
      apiUpdateComment(data)
        .then(function (response) {
          console.log(response);
          me.$Message.success("更新成功");
          me.getNotice();
          me.noticeContent = "";
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          me.updateComment();
        });
    },
  },
  created() {
    this.getNotice();
  },
};
</script>

<style scoped>
.table {
  margin: auto;
  text-align: center;
  width: 50%;
}
.content {
  margin: auto;
  text-align: center;
  width: 50%;
}
.content h2 {
  margin-bottom: 16px;
}
.content .textarea {
  margin-bottom: 15px;
}
.textarea /deep/ .ivu-input {
  font-size: 1.3rem;
}
</style>