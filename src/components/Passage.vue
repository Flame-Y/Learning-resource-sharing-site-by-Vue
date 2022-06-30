<template>
  <div>
    <Table border :columns="columns12" :data="passageData">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="getPassageResource(row.id), (modal1 = true)"
          >查看详情</Button
        >
      </template>
    </Table>
    <Page
      :total="listTotal * 10"
      size="small"
      show-elevator
      @on-change="change"
      class="page"
    />
    <Modal v-model="modal1" class="dialog" :styles="{ top: '0px' }" fullscreen>
      <h2>{{ passageResource[0].title }}</h2>
      <Divider orientation="left">内容</Divider>
      <p>{{ passageResource[0].content }}</p>
      <Divider orientation="left">评论</Divider>
      <List>
        <p v-if="passageResource[3].length === 0" class="noComment">暂无评论</p>
        <ListItem v-for="(user, index) in passageResource[3]" :key="index"
          >{{ user.name }} {{ user.content }}</ListItem
        >
        <div style="min-height: 100px" class="send">
          <Input
            v-model="inputValue"
            type="textarea"
            :autosize="{ minRows: 3 }"
            class="textarea"
          />
          <i-button type="error" @click="addComment(passageResource[0].id)"
            >发表评论</i-button
          >
        </div>
        <div class="showPicture">
          <Divider orientation="left">展示图片</Divider>
          <p v-if="!url.length">暂无图片</p>
          <!-- <img :src="url" alt="" /> -->
          <img v-for="(data, index) in url" :src="data" alt="" :key="index" />
        </div>

        <Divider orientation="left">下载</Divider>
        <p
          v-if="
            (passageResource[1].length === 1 &&
              passageResource[1][0].address == '暂无') || //接口多此一举地返回了一个暂无地址......
            passageResource[1].length === 0
          "
          class="noComment"
        >
          暂无下载链接
        </p>
        <div v-if="passageResource[1][0].address != '暂无'">
          <ListItem v-for="(user, index) in passageResource[1]" :key="index"
            >{{ user.address }}
            <Button @click="uploadResource(user)">下载</Button>
          </ListItem>
        </div>
      </List>

      <p class="time">发布时间：{{ passageResource[0].time }}</p>
    </Modal>
  </div>
</template>
<script>
import {
  apiGetPassage,
  apiGetPassageResource,
  apiCreateComment,
  apiDownResource,
} from "@/request/api/passage.js";
export default {
  data() {
    return {
      columns12: [
        {
          title: "标题",
          key: "title",
          ellipsis: true,
        },
        {
          title: "内容",
          key: "content",
          ellipsis: true,
        },
        {
          title: "发布时间",
          key: "time",
          width: 300,
          sortable: true,
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
      passageData: [],
      pageNo: 1,
      pageSize: 10,
      listTotal: 0,
      modal1: false,
      passageResource: [
        { content: "", title: "", time: "", id: 0 },
        [{ address: "" }],
        {},
        [],
      ],
      inputValue: "",
      url: "",
    };
  },
  methods: {
    getPassage() {
      let me = this;
      apiGetPassage({ pageNo: this.pageNo, pageSize: this.pageSize })
        .then(function (response) {
          me.listTotal = response.data.总页数;
          for (let i = 0; i < response.data.passageItem.length; i++) {
            me.passageData.push(response.data.passageItem[i]);
          }
        })
        .catch((error) => {
          console.log("请求失败", error);
          me.getPassage();
        });
    },
    getPassageResource(id) {
      let me = this;
      // console.log(id);
      apiGetPassageResource({ passageID: id })
        .then(function (response) {
          // console.log(Object.keys(response.data[2])[0]);
          me.passageResource = response.data;
          if (me.passageResource[1][0] == undefined) {
            me.passageResource[1] = [{ address: "暂无" }];
          }
          me.passageTitle = me.passageResource[0].title;
          me.passageContent = me.passageResource[0].content;
          let tag = Object.keys(response.data[2]);
          let Imgbase = [];
          for (let i = 0; i < tag.length; i++) {
            Imgbase[i] = "data:image/jpeg;base64," + response.data[2][tag[i]];
          }
          // let Imgbase = "data:image/jpeg;base64," + response.data[2][tag];
          me.url = Imgbase;
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          // this.getPassageResource(id);
        });
    },
    change(page) {
      this.pageNo = page;
      this.passageData.length = 0;
      this.getPassage();
      // 切换页数
    },
    addComment(id) {
      let me = this;
      if (this.inputValue == "") {
        me.$Message.error("发送内容不能为空");
        return;
      }
      apiCreateComment({
        content: this.inputValue,
        passageID: id,
        userID: 1,
      })
        .then(function (response) {
          if (response.data.code == 401) {
            me.$Message.error("发送内容不能为空");
          } else {
            me.$Message.success("发送成功");
          }
          me.inputValue = "";
          me.getPassageResource(id);
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
    uploadResource(user) {
      let me = this;
      let data = new FormData();
      data.append("filePath", user.address);
      apiDownResource(data)
        .then(function (res) {
          console.log(res);
          const { data, headers } = res;
          if (headers["content-disposition"] != null) {
            var fileName = headers["content-disposition"].replace(
              /\w+;filename=(.*)/,
              "$1"
            );
          }
          const blob = new Blob([data], { type: headers["content-type"] });
          let dom = document.createElement("a");
          let url = window.URL.createObjectURL(blob);
          dom.href = url;
          dom.download = decodeURI(fileName);
          dom.style.display = "none";
          document.body.appendChild(dom);
          dom.click();
          dom.parentNode.removeChild(dom);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
  },
  created() {
    this.getPassage();
  },
};
</script>
<style scoped>
.noComment {
  margin-bottom: 10px;
}
.dialog button {
  float: right;
}
.showPicture img {
  /* height: 360px; */
  width: 360px;
  margin-right: 30px;
}
.time {
  float: right;
}
.dialog .ivu-list-item {
  display: block;
}
.dialog /deep/ .ivu-modal-footer {
  margin-top: 10px;
}
.page {
  text-align: center;
}
.send .textarea {
  margin-bottom: 15px;
}
p {
  display: inline;
}
</style>
