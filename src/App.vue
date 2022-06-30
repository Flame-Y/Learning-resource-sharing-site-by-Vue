<template>
  <div>
    <Layout>
      <Header>
        <navigationbar />
      </Header>
      <Content>
        <router-view></router-view>
      </Content>
      <Footer class="layout-footer-center">2022-2022 &copy; TalkingData</Footer>
    </Layout>
  </div>
</template>

<script>
import navigationbar from "@/components/navigationbar";
import displayPanel from "@/components/displayPanel";

export default {
  name: "App",
  components: { navigationbar, displayPanel },
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
.layout-footer-center {
  text-align: center;
}
.ivu-layout-header {
  padding: 0;
  height: 60px;
}
</style>