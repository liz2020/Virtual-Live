const state = {
  paramGroupName: "",
  onParamUpdate: 0,
  onParamReset: 0
};

const mutations = {
  setParamGroupName(state, paramGroupName) {
    state.paramGroupName = paramGroupName;
  },
  incrementParamUpdateCounter(state) {
    state.onParamUpdate++;
  },
  incrementParamResetCounter(state) {
    state.onParamReset++;
  }
};

const actions = {
  storeParamByGroup({ commit }, paramGroupName) {
    commit("setParamGroupName", paramGroupName);
    commit("incrementParamUpdateCounter");
  },
  resetParamByGroup({ commit }, paramGroupName) {
    commit("setParamGroupName", paramGroupName);
    commit("incrementParamResetCounter");
  }
};

export default {
  state,
  mutations,
  actions
};
