<!--
 * @Author: your name
 * @Date: 2021-01-18 09:41:14
 * @LastEditTime: 2021-12-23 16:52:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
-->
<template>
  <div class="ve_404">
    <!-- partial:index.partial.html -->
    <div class="moon"></div>
    <div class="moon__crater moon__crater1"></div>
    <div class="moon__crater moon__crater2"></div>
    <div class="moon__crater moon__crater3"></div>
    <div class="star star1">⭐</div>
    <div class="star star2">⭐</div>
    <div class="star star3">⭐</div>
    <div class="star star4">⭐</div>
    <div class="star star5">⭐</div>
    <div class="star star6">⭐</div>
    <div class="star star7">⭐</div>
    <div class="star star8">⭐</div>
    <slot>
      <div class="error">
        <div class="error__title">404</div>
        <div class="error__subtitle">🐱🐱🐱(⓿_⓿)🐱🐱🐱</div>
        <div class="error__description">看来你是迷路了......</div>
        <router-link to="/">
          <button class="error__button error__button--active">回到首页</button>
        </router-link>
      </div>
    </slot>
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
.ve_404 {
  height: calc(100vh - 5px);
  width: calc(100vw - 5px);
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #2f3640 23%, #181b20 100%);
}
.moon {
  background: linear-gradient(90deg, #d0d0d0 48%, #919191 100%);
  position: absolute;
  top: -30vh;
  left: -80vh;
  width: 160vh;
  height: 160%;
  content: "";
  border-radius: 50%;
  box-shadow: 0px 0px 30px -4px rgba(0, 0, 0, 0.5);
}

.moon__crater {
  position: absolute;
  content: "";
  border-radius: 100%;
  background: linear-gradient(90deg, #7a7a7a 38%, #c3c3c3 100%);
  opacity: 0.6;
}

.moon__crater1 {
  top: 250px;
  left: 500px;
  width: 60px;
  height: 180px;
}

.moon__crater2 {
  top: 650px;
  left: 340px;
  width: 40px;
  height: 80px;
  transform: rotate(55deg);
}

.moon__crater3 {
  top: -20px;
  left: 40px;
  width: 65px;
  height: 120px;
  transform: rotate(250deg);
}

.star {
  color: grey;
  position: absolute;
  width: 10px;
  height: 10px;
  content: "";
  border-radius: 100%;
  transform: rotate(250deg);
  opacity: 0.4;
  animation-name: shimmer;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes shimmer {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.7;
  }
}

.star1 {
  top: 40%;
  left: 50%;
  animation-delay: 1s;
}

.star2 {
  top: 60%;
  left: 90%;
  animation-delay: 3s;
}

.star3 {
  top: 10%;
  left: 70%;
  animation-delay: 2s;
}

.star4 {
  top: 90%;
  left: 40%;
}

.star5 {
  top: 20%;
  left: 30%;
  animation-delay: 0.5s;
}

.star6 {
  top: 30%;
  left: 70%;
  animation-delay: 1.5s;
}

.star7 {
  top: 80%;
  left: 20%;
  animation-delay: 0.5s;
}

.star8 {
  top: 70%;
  left: 80%;
  animation-delay: 3.5s;
}

.astronaut {
  position: absolute;
  width: 60vw;
  height: 100vh;
  top: 0;
  right: 0;
  z-index: 0;
}

.error {
  position: absolute;
  left: 100px;
  top: 400px;
  transform: translateY(-60%);
  font-family: "Righteous", cursive;
  color: #363e49;
  z-index: 1;
}

.error__title {
  font-size: 10em;
  font-weight: bold;
  color: #d0d0d0;
  text-shadow: -5px -5px 0 rgba(0, 0, 0, 0.7);
  background-image: linear-gradient(90deg, #d0d0d0 48%, #919191 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.error__subtitle {
  font-size: 2em;
}

.error__description {
  opacity: 0.5;
}

.error__button {
  min-width: 7em;
  margin-top: 3em;
  margin-right: 0.5em;
  padding: 0.5em 2em;
  outline: none;
  border: 2px solid #2f3640;
  background-color: transparent;
  border-radius: 8em;
  color: #576375;
  cursor: pointer;
  transition-duration: 0.2s;
  font-size: 0.75em;
  font-family: "Righteous", cursive;
}

.error__button:hover {
  color: #21252c;
}

.error__button--active {
  background-color: red;
  border: 2px solid red;
  color: white;
}

.error__button--active:hover {
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.5);
  color: white;
}
</style>
