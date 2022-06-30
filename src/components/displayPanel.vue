<template>
  <Carousel autoplay v-model="value" loop>
    <CarouselItem>
      <div class="demo-carousel">
        <div class="img">
          <a href="https://space.bilibili.com/672346917">
            <img src="@/images/向晚.png" alt="" />
          </a>
        </div>
      </div>
    </CarouselItem>
    <CarouselItem>
      <div class="demo-carousel">
        <div class="img">
          <div class="img">
            <a href="https://space.bilibili.com/672353429">
              <img src="@/images/贝拉.png" alt="" />
            </a>
          </div>
        </div>
      </div>
    </CarouselItem>
    <CarouselItem>
      <div class="demo-carousel">
        <div class="img">
          <a href="https://space.bilibili.com/351609538">
            <img src="@/images/珈乐.png" alt="" />
          </a>
        </div>
      </div>
    </CarouselItem>
    <CarouselItem>
      <div class="demo-carousel">
        <div class="img">
          <a href="https://space.bilibili.com/672328094">
            <img src="@/images/嘉然.png" alt="" />
          </a>
        </div>
      </div>
    </CarouselItem>
    <CarouselItem>
      <div class="demo-carousel">
        <div class="img">
          <a href="https://space.bilibili.com/672342685">
            <img src="@/images/乃琳.png" alt="" />
          </a>
        </div>
      </div>
    </CarouselItem>
  </Carousel>
</template>
<script>
export default {
  name: "displayPanel",
  data() {
    return {
      value: 0,
    };
  },
};
</script>
<style scoped>
.img {
  height: 400px;
  text-align: center;
  background-color: #fff;
}
img {
  height: 400px;
}
</style>
