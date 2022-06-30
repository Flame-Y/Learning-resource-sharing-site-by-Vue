<template>
  <div>
    <Card :padding="0" class="table" :bordered="false">
      <Table
        border
        :columns="columns"
        :data="listData"
        no-data-text="暂无数据"
        :loading="loading()"
      >
        <template slot-scope="{ row }" slot="content">
          <p>{{ row.content }}</p>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="error" size="small" @click="remove(row.id)"
            >Delete</Button
          >
        </template>
      </Table>
      <Page
        :total="listTotal * 10"
        size="small"
        show-elevator
        @on-change="change"
      />
    </Card>
  </div>
</template>
<script>
import { apiGetComment, apiRemoveComment } from "@/request/api/hall.js";

export default {
  data() {
    return {
      columns: [
        {
          title: "内容",
          slot: "content",
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
      listData: [],
      listFooter: 0,
      listTotal: 0,
      pageNo: 1,
      pageSize: 10,
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
    remove(id) {
      // this.listData.splice(index, 1);
      console.log(id);
      this.removeComment(id);
      this.getComment();
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
          me.getComment();
        });
    },
    removeComment(id) {
      let me = this;
      let data = new URLSearchParams();
      data.append("ID", id);
      apiRemoveComment(data)
        .then(function (response) {
          console.log(response);
          me.$Message.success("删除成功");
          me.getComment();
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          me.removeComment(id);
        });
    },
  },
  created() {
    this.getComment();
  },
};
</script>

<style scoped>
.table {
  /* padding-left: 20%; */
  margin: auto;
  text-align: center;
  width: 80%;
}
</style>