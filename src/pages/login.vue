<template>
  <common>
    <div class="ve_container">
      <el-card :body-style="{ background: 'rgba(0,0,0,0.15)' }">
        <h1>后台管理系统</h1>
        <transition name="el-fade-in-linear">
          <el-form
            :model="form"
            :rules="rules"
            v-show="!success"
            class="ve_form"
            ref="ref_form"
            :inline="false"
            @keyup.enter="onSubmit"
          >
            <wxlogin
              appid="wx36f5a4b92474e229"
              scope="'snsapi_login'"
              :theme="'black'"
              :redirect_uri="encodeURIComponent('http://test.euse.vip/')"
              rel="external nofollow"
            >
            </wxlogin>
            <el-form-item prop="name">
              <el-input v-model.trim="name" placeholder="用户名">
                <template #prepend>
                  <el-icon :size="20"><Avatar /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model.trim="password"
                show-password
                placeholder="密码"
              >
                <template #prepend>
                  <el-icon :size="20"><Key /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="ve_submit" type="primary" @click="onSubmit">
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </transition>
      </el-card>
    </div>
  </common>
</template>

<script setup>
import wxlogin from "vue-wxlogin"; // 先引入，后注册
import common from "./common.vue";
import { ref, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/api/user";
import { ElNotificationFnError } from "@/common";
import { getToken, setToken, removeToken } from "@/utils/auth";

const rules = {
  name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
const form = reactive({
  name: "",
  password: "",
});
const { name, password } = toRefs(form);
const ref_form = ref(null);
const success = ref(false);
const router = useRouter();
const onSubmit = () => {
  ref_form.value.validate(async (valid) => {
    if (valid) {
      setToken("test");
      router.replace("/");
      /* const data = await login(form);
      if (data.code === 200) {
        if (data.data.code && data.data.code != 200) {
          ElNotificationFnError(data.data.message);
          return;
        }
        setToken(data.data.token);
        localStorage.setItem("token", data.data.token);
        router.replace("/");
      } */
    } else {
      return;
    }
  });
};
</script>

<style lang="less" scoped>
.ve_container {
  position: absolute;
  z-index: 1;
  width: 400px;
  top: 50%;
  left: 100px;
  transform: translateY(-50%);
  transition: all 1s;
  min-height: 273px;
  text-align: center;
  h1 {
    font-size: 24px;
    transition: all 1s;
    font-weight: bold;
    margin-bottom: 36px;
  }
  .ve_form {
    .ve_submit {
      width: 100%;
    }
  }
}
</style>
