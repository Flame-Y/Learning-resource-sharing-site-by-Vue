<template>
  <div>
    <Table border :columns="columns" :data="passageData" :loading="loading()">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="getPassageResource(row.id), (modal1 = true)"
          >详情/修改</Button
        >
        <Button type="error" size="small" @click="removePassage(row.id)"
          >删除</Button
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
    <Button type="primary" long @click="modal2 = true" class="create"
      >创建新文章</Button
    >
    <Modal
      v-model="modal1"
      @on-ok="ok(passageResource[0].id)"
      class="dialog"
      :styles="{ top: '0px' }"
      fullscreen
    >
      <Divider orientation="left">标题</Divider>

      <Input v-model="passageTitle" class="title"></Input>
      <Divider orientation="left">内容</Divider>
      <Input
        v-model="passageContent"
        type="textarea"
        :autosize="{ minRows: 3 }"
        >{{ passageResource[0].content }}</Input
      >
      <Divider orientation="left">评论</Divider>
      <List>
        <p v-if="passageResource[3].length === 0" class="noComment">暂无评论</p>
        <ListItem
          v-for="(user, index) in passageResource[3]"
          :key="index"
          class="comment"
          >{{ user.content }}
          <Button type="error" @click="removeComment(user)"
            >删除</Button
          ></ListItem
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
          <!-- <img v-for="(data, index) in url" :src="data" alt="" :key="index" /> -->
          <div v-if="passageResource[1][0].address != '暂无'">
            <div v-for="(data, index) in url" :key="index">
              <img :src="data.url" alt="" />
              <Button type="error" @click="removeImg(data)">删除</Button>
            </div>
          </div>
          <Upload action="123" :before-upload="handleUpload2" class="upload">
            <Button icon="ios-cloud-upload-outline">上传文章图片</Button>
          </Upload>
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
            >{{ user.address
            }}<Button type="error" @click="removeResoruce(user)">删除</Button>
          </ListItem>
        </div>
      </List>
      <Divider />
      <Upload action="123" :before-upload="handleUpload" class="upload">
        <Button icon="ios-cloud-upload-outline">上传文件</Button>
      </Upload>

      <Divider />

      <p class="time">发布时间：{{ passageResource[0].time }}</p>
    </Modal>

    <Modal
      v-model="modal2"
      @on-ok="createPassage()"
      class="dialog"
      :styles="{ top: '0px' }"
      width="800"
    >
      <Divider orientation="left">标题</Divider>

      <Input v-model="passageTitle" class="title"></Input>
      <Divider orientation="left">内容</Divider>
      <Input
        v-model="passageContent"
        type="textarea"
        :autosize="{ minRows: 3 }"
      ></Input>
    </Modal>
  </div>
</template>
<script>
import {
  apiGetPassage,
  apiGetPassageResource,
  apiCreatePassage,
  apiCreateComment,
  apiUpdatePassage,
  apiUploadResource,
  apiUploadImg,
  apiRemoveImg,
  apiRemoveComment,
  apiRemovePassage,
  apiRemoveResource,
} from "@/request/api/passage.js";

export default {
  data() {
    return {
      columns: [
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
          width: 200,
          align: "center",
        },
      ],
      passageData: [],
      pageNo: 1,
      pageSize: 10,
      listTotal: 0,
      modal1: false,
      modal2: false,
      passageResource: [
        { content: "", title: "", time: "", id: 0 },
        [{ address: "" }],
        {},
        [],
      ],
      inputValue: "",
      passageTitle: "",
      passageContent: "",
      url: "",
      thisPID: "",
    };
  },
  methods: {
    loading() {
      if (this.passageData.length == 0) {
        return true;
      } else {
        return false;
      }
    },
    handleUpload(file) {
      let data = new FormData();
      let me = this;
      data.append("file", file);
      data.append("passageID", this.passageResource[0].id);
      // console.log(data.get("file")); 获取formdata数据类型中的数据
      apiUploadResource(data)
        .then(function (response) {
          me.$Message.success("上传成功");
          me.getPassageResource(me.passageResource[0].id);
        })
        .catch((error) => {
          console.log("请求失败", error);
        });
      return false; //拦截组件默认的请求
    },

    handleUpload2(file) {
      let data = new FormData();
      let me = this;
      data.append("file", file);
      data.append("passageID", this.passageResource[0].id);
      // console.log(data.get("file")); 获取formdata数据类型中的数据
      apiUploadImg(data)
        .then(function (response) {
          console.log(response);
          me.$Message.success("上传成功");
          me.getPassageResource(me.passageResource[0].id);
        })
        .catch((error) => {
          console.log("请求失败", error);
        });
      return false; //拦截组件默认的请求
    },
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
      me.thisPID = id;
      apiGetPassageResource({ passageID: id })
        .then(function (response) {
          me.passageResource = response.data;
          if (me.passageResource[1][0] == undefined) {
            me.passageResource[1] = [{ address: "暂无" }];
          }
          me.passageTitle = me.passageResource[0].title;
          me.passageContent = me.passageResource[0].content;
          let tag = Object.keys(response.data[2]);
          let Imgbase = [];
          for (let i = 0; i < tag.length; i++) {
            Imgbase[i] = { id: "", url: "" };
          }
          for (let i = 0; i < tag.length; i++) {
            Imgbase[i].id = tag[i].slice(6);
          }
          for (let i = 0; i < tag.length; i++) {
            Imgbase[i].url =
              "data:image/jpeg;base64," + response.data[2][tag[i]];
          }
          // let Imgbase = "data:image/jpeg;base64," + response.data[2][tag];
          me.url = Imgbase;
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          // this.getPassageResource(id);
        });
    },
    updatePassage(id) {
      let me = this;
      apiUpdatePassage({
        content: this.passageContent,
        passageID: id,
        title: this.passageTitle,
      })
        .then(function (response) {
          console.log(response);
          me.$Message.success("更新成功");
        })
        .catch((error) => {
          console.log("请求失败", error.message);
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
    removeComment(user) {
      let me = this;
      let data = new URLSearchParams();
      data.append("commentID", user.commentID);
      apiRemoveComment(data)
        .then(function (response) {
          me.$Message.success("删除成功");
          me.getPassageResource(user.passageID);
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
    removeImg(user) {
      let me = this;
      let data = new URLSearchParams();
      data.append("imgID", user.id);
      apiRemoveImg(data)
        .then(function (response) {
          console.log(response);
          me.$Message.success("删除成功");
          me.getPassageResource(me.thisPID);
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
    ok(id) {
      this.updatePassage(id);
      // console.log(id);
      this.passageTitle = "";
      this.passageContent = "";
    },
    removePassage(id) {
      let me = this;
      let data = new URLSearchParams();
      data.append("passageID", id);
      apiRemovePassage(data)
        .then(function (response) {
          me.$Message.success("删除成功");
          me.passageData.length = 0;
          me.getPassage();
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          me.removeComment(id);
        });
    },
    createPassage() {
      let me = this;
      apiCreatePassage({
        content: this.passageContent,
        title: this.passageTitle,
      })
        .then(function (response) {
          me.getPassage();
          if (response.data.code == 401) {
          } else {
            me.$Message.success("发送成功");
            me.passageTitle = "";
            me.passageContent = "";
          }
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
      this.passageData.length = 0;
    },
    removeResoruce(user) {
      let me = this;
      let data = new URLSearchParams();
      data.append("resourcesID", user.id);
      apiRemoveResource(data)
        .then(function (response) {
          console.log(response);
          me.$Message.success("删除成功");
          me.getPassageResource(user.passageID);
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          me.removeComment(id);
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
.time {
  float: right;
}
.dialog /deep/ .ivu-modal-footer {
  margin-top: 10px;
}
.dialog .ivu-list-item {
  display: block;
}
.dialog button {
  float: right;
}
.showPicture img {
  width: 360px;
  margin-right: 30px;
}
.comment button {
  margin-bottom: 5px;
}
.page {
  text-align: center;
}
.title /deep/ .ivu-input {
  font-size: 20px;
  font-weight: 700;
  height: 40px;
  width: 50%;
}
.send .textarea {
  margin-bottom: 15px;
}
.upload {
  margin-top: 5px;
  float: right;
}
.create {
  margin-top: 20px;
}
</style>
