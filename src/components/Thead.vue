<template>
  <div class="head">
    <div v-show="isback" class="head_back" @click="back()">
      <icon name="Back" class="icon_back" />
      返回
    </div>
    <div class="head_titie">
      {{ title }}
    </div>
    <div v-if="showRight" class="head_right" @click="link">
      <icon v-if="icon" :name="icon" class="icon_right" :style="{'color':iconColor}" />
      <p>{{ rightTitle }}</p>
    </div>
  </div>
</template>

<script lang="js">

export default ({
  props: {
    title: {
      type: String,
      required: true
    },
    isback: {
      type: Boolean,
      default: true
    },
    name: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    showRight: {
      type: Boolean,
      default: false
    },
    rightTitle: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: '#AFAFAF'
    }
  },
  methods: {
    back () {
      if (window.history.length <= 1) {
        this.$router.replace({ path: '/' })
        return false
      } else {
        this.$router.go(-1)
      }
    },
    link () {
      this.$emit('headlink')
    }
  }
})
</script>

<style lang="less" scoped>
.head{
  position: relative;
  padding: 0 22/@rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 88/@rem;
  background: #fff;
  border-bottom: 2/@rem solid @font_col4;
  .head_back{
    position:absolute;
    left: 22/@rem;
    top: 26/@rem;
    display: flex;
    align-items: center;
    color: #FFA431;
    font-size: @font_title;
    .icon_back{
      margin-right: 10/@rem;
      width: 25/@rem;
      height: 25/@rem;
      color: #FFA431;
    }
  }
  .head_titie{
    font-size: @font_title3;
    color: #333333;
  }
  .head_right{
    position: absolute;
    right: 20/@rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: @font_col3;
    font-size: @font_text1;
    .icon_right{
      width: 30/@rem;
      height: 35/@rem;
    }
  }
}
</style>
