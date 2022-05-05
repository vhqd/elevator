import { createStore } from "vuex";

const store = createStore({
  state() {
    return { num: 1000 };
  },
});

export default store;
