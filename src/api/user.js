import api from "@/utils/api";

/**
 * 根据authId获取用户数据
 * @param  params {authId: string} 授权Id
 * @return 用户列表数据
 */
export async function getList() {
  const path = "/getJoke?page=1&count=5&type=video";
  let data = await api.get(path);
  return data;
}

export async function login(params) {
  const path = "/management/auth/login";
  let data = await api.post(path, params);
  return data;
}

export const getList1 = async () => {
  const path = "/rand.qinghua?format=json";
  let data = await api.get(path);
  return data;
};
