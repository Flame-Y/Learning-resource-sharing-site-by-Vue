<template >
  <Menu
    mode="horizontal"
    theme="light"
    :active-name="activeName"
    ref="side_menu"
  >
    <router-link to="/homepage">
      <div class="layout-logo">
        <img src="@/images/asoul.png" alt="" />
      </div>
    </router-link>
    <div class="layout-nav">
      <MenuItem name="Homepage" to="/homepage">
        <Icon type="ios-home" />
        首页
      </MenuItem>
      <MenuItem name="Passage" to="/passage">
        <Icon type="ios-paper" />
        文章
      </MenuItem>
      <Submenu name="Background" v-if="isAdmin()">
        <template slot="title">
          <Icon type="ios-settings" />
          后台管理界面
        </template>
        <MenuGroup title="内容管理">
          <MenuItem name="noticeManage" to="/noticeManage">公告管理</MenuItem>
          <MenuItem name="commentManage" to="/commentManage">留言管理</MenuItem>
          <MenuItem name="passageManage" to="/passageManage">文章管理</MenuItem>
        </MenuGroup>
        <MenuGroup title="用户管理">
          <MenuItem name="userManage" to="/userManage">用户查询</MenuItem>
        </MenuGroup>
      </Submenu>
    </div>
    <div class="layout-login">
      <router-link to="/login" v-if="!haveToken()">登录</router-link>
      <router-link to="/register" v-if="!haveToken()">注册</router-link>
      <Dropdown>
        <div class="demo-avatar">
          <Avatar
            :src="require('@/images/嘉然头像.png')"
            v-if="haveToken() && !isAdmin()"
          />
          <Avatar
            :src="require('@/images/羊驼头像.png')"
            v-if="haveToken() && isAdmin()"
          />
          <Avatar icon="ios-person" v-if="!haveToken()" />
        </div>
        <DropdownMenu slot="list">
          <p v-if="haveToken()" class="name">{{ loginUsername }}</p>
          <DropdownItem v-if="haveToken()" @click.native="exit()"
            ><Icon type="ios-log-out" /> 退出</DropdownItem
          >
          <DropdownItem v-if="!haveToken()" @click.native="toLogin()"
            >登录</DropdownItem
          >
          <DropdownItem v-if="!haveToken()" @click.native="toRegister()"
            >注册</DropdownItem
          >
        </DropdownMenu>
      </Dropdown>
    </div>
  </Menu>
</template>

<script>
export default {
  name: "navigationbar",
  data() {
    return {
      activeName: "home",
      loginUsername: window.sessionStorage.getItem("username"),
    };
  },
  methods: {
    haveToken() {
      if (window.sessionStorage.getItem("token")) {
        return true;
      } else {
        return false;
      }
    },
    isAdmin() {
      // 通过vuex来获取用户id来判断是否是管理员账号
      if (this.loginUsername === "admin") {
        return true;
      } else {
        return false;
      }
    },
    exit() {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("userID");
      this.$store.commit("removeToken");
      this.$router.push("/homepage");
      window.location.reload();
    },
    toLogin() {
      this.$router.push("/login");
    },
    toRegister() {
      this.$router.push("/register");
    },
  },
  computed: {
    thisRouter() {
      return this.$store.state.thisRouter; //返回vuex的state里的router数据
    },
  },
  watch: {
    thisRouter: {
      handler(nval, oval) {
        this.activeName = nval;
      },
      deep: true, // 深度监听
      immediate: true, //立即执行
    },
  },
};
</script>

<style scoped>
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 5px;
  left: 20px;
}
.layout-logo img {
  height: 50px;
  margin: auto;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 100px;
  float: left;
  padding-left: 50px;
}
.layout-login {
  float: right;
  font-size: 14px;
  padding-right: 50px;
}
.layout-login a {
  padding-right: 15px;
}
.demo-avatar {
  display: inline-block;
}
.name {
  font-weight: 700;
  margin: auto;
  text-align: center;
}
</style>