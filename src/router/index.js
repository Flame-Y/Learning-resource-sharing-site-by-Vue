import Vue from "vue";
import Router from "vue-router";
import Homepage from "@/components/HomePage";
import Login from "@/components/Login";
import Register from "@/components/Register";
import Passage from "@/components/Passage";
import noticeManage from "@/components/noticeManage";
import commentManage from "@/components/commentManage";
import passageManage from "@/components/passageManage";
import userManage from "@/components/userManage";
import store from "../store";

Vue.use(Router);
export const constantRouterMap = [
  {
    path: "/",
    redirect: "homepage"
  },
  {
    path: "/homepage",
    name: "Homepage",
    component: Homepage,
    meta: {
      roles: ["admin", "user", "vistor"]
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      roles: ["admin", "user", "vistor"]
    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      roles: ["admin", "user", "vistor"]
    }
  },
  {
    path: "/passage",
    name: "Passage",
    component: Passage,
    meta: {
      roles: ["admin", "user"]
    }
  },
  {
    path: "/noticemanage",
    name: "noticeManage",
    component: noticeManage,
    meta: {
      roles: ["admin"]
    }
  },
  {
    path: "/commentmanage",
    name: "commentManage",
    meta: {
      roles: ["admin"]
    },
    component: commentManage
  },
  {
    path: "/passagemanage",
    name: "passageManage",
    component: passageManage,
    meta: {
      roles: ["admin"]
    }
  },
  {
    path: "/usermanage",
    name: "userManage",
    component: userManage,
    meta: {
      roles: ["admin"]
    }
  }
];
const router = new Router({
  routes: constantRouterMap
});
export default router;

const VueRouterPush = Router.prototype.push;
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err);
};
router.beforeEach((to, from, next) => {
  var token = window.sessionStorage.getItem("token");
  if (window.sessionStorage.getItem("token")) {
    store.commit("updateToken", token);
  }

  if (window.sessionStorage.getItem("userID") == 1) {
    var role = "admin";
  } else if (window.sessionStorage.getItem("userID") > 1) {
    var role = "user";
  } else {
    var role = "vistor";
  }
  store.commit("getRouter", to.name);

  if (to.meta.roles.includes(role)) {
    next(); //放行
  } else if (role == "vistor") {
    next({ path: "/login" });
  } else {
    store.commit("getRouter", homepage);

    next({ path: "/homepage" });
  }
});
