<template>
  <Card :bordered="false" :padding="0" class="body">
    <div class="middle">
      <div class="form">
        <Form ref="formValidate" :model="formValidate" :rules="ruleInline">
          <FormItem prop="username">
            <Input
              type="text"
              v-model="formValidate.username"
              placeholder="请输入用户名"
            >
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input
              type="password"
              password
              v-model="formValidate.password"
              placeholder="请输入密码"
            >
            </Input>
          </FormItem>
          <FormItem prop="againPassword">
            <Input
              type="password"
              password
              v-model="formValidate.againPassword"
              placeholder="请再次输入密码"
            >
            </Input>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              @click="handleSubmit('formValidate')"
              shape="circle"
              >注册</Button
            >
            <Button
              @click="handleReset('formValidate')"
              style="margin-left: 8px"
              shape="circle"
              >重置</Button
            >
          </FormItem>
          <p>已有账号？</p>
          <router-link to="/login">登录</router-link>
        </Form>
      </div>
    </div>
  </Card>
</template>
<script>
import { apiRegister } from "@/request/api/user.js";

export default {
  data() {
    const validatePassCheck = (rule, value, callback) => {
      if (value !== this.formValidate.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      formValidate: {
        username: "",
        password: "",
        againPassword: "",
      },
      ruleInline: {
        username: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
          {
            type: "string",
            min: 6,
            message: "密码不能少于六位数",
            trigger: "blur",
          },
        ],
        againPassword: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
          {
            type: "string",
            min: 6,
            message: "密码不能少于六位数",
            trigger: "blur",
          },
          { validator: validatePassCheck, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success("Success!");
          this.toRegister();
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    toRegister() {
      var me = this;
      var data = new URLSearchParams();
      data.append("password", this.formValidate.password);
      data.append("username", this.formValidate.username);
      apiRegister(data)
        .then(function (response) {
          console.log(response.data);
          if (response.data === false) {
            console.log("该用户名已存在");
          } else {
            console.log("注册成功");
            me.$store.commit("getNewUsername", me.formValidate.username);
            me.$store.commit("getNewPassword", me.formValidate.password);
            console.log(me.$store.state.newUsername);
            me.$router.push("/Login");
          }
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
  },
};
</script>
<style scoped>
.body {
  background-image: url("~@/images/风景.png");
  background-repeat: no-repeat;
  background-size: 100%;
  /* height: calc(100%-100px); */
  height: calc(100vh - 129px);
  margin: auto;
  /* padding-top: 50px; */
}
.middle {
  background: rgba(255, 255, 255, 0.2);
  height: calc(100vh - 129px);
}
Form {
  padding-top: 130px;

  width: 300px;
  text-align: center;
  margin: auto;
}
.form {
  height: calc(100vh - 200px);
  width: 700px;
  background-color: #515a6e;
  margin: auto;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
p {
  display: inline-block;
  color: #ffffff;
}
</style>