import { ElNotification } from "element-plus";

export function ElNotificationFn(message) {
  ElNotification({
    title: "Success",
    message,
    type: "success",
  });
}

export function ElNotificationFnError(msg) {
  ElNotification({
    title: "Error",
    message: msg,
    type: "error",
  });
}
