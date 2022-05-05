<template>
  <div class="index">
    <div class="index-main">
      <div
        class="
          index-container
          ivu-row-flex ivu-row-flex-middle ivu-row-flex-center
        "
      >
        <div class="ivu-col ivu-col-span-24">
          <div class="tilte">电梯维保</div>
          <div class="index-content">一套高效率的</div>
          <div class="index-content">电梯维修 监测 上报系统</div>
          <div class="index-actions">
            <el-row>
              <el-col :span="12">
                <el-button class="btn" type="warning" size="large">
                  Default
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button class="btn" type="primary" size="large">
                  Primary
                </el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-button class="btn btn2" type="success" size="large">
                  Success
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button
                  class="btn btn2"
                  @click="removeToken"
                  type="info"
                  size="large"
                >
                  removeToken
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { removeToken } from "@/utils/auth";
</script>

<style scoped>
.tilte {
  margin-top: 50px;
  font-size: 50px;
  font-weight: bold;
}
.btn {
  width: 70%;
  height: 160px;
  margin-top: 40px;
}
.btn2 {
  margin-top: 100px;
}
.index {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;
  background-image: url(https://file.iviewui.com/weapp/dist/831d58b4f85bb27a39d977fab6cac3dc.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  overflow: hidden;
}

.index-main {
  width: 50%;
  height: 100%;
}

.index-logo {
  height: 50px;
  margin-top: 16px;
  margin-left: 10%;
}

.index-container {
  height: 100%;
  padding-left: 10%;
}

.index-title {
  height: 100px;
}

.index-content {
  font-size: 24px;
  margin-top: 10px;
  padding-left: 16px;
}

.index-actions {
  margin-top: 80px;
  margin-bottom: 90px;
  margin-left: 16px;
}

.index-btn {
  min-width: 120px;
  margin-right: 16px;
}

.index-code {
  height: 150px;
  margin: 0 auto;
}

.index-version .ivu-badge-count {
  box-shadow: none;
  right: 0;
  top: -3px;
  color: #f50;
  background: transparent;
}
</style>