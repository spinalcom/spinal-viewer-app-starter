/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
import Vue from 'vue';
import Vuex, { Store as VuexStore, CommitOptions, DispatchOptions } from 'vuex';
import { StateAppData, state } from './appDataStore/state';
import { MutationsAppData, mutations } from './appDataStore/mutations';
import { Actions, actions } from './appDataStore/actions';
Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    appDataStore: {
      state,
      mutations,
      actions,
      getters: {},
    },
  },
});

export interface IStoreModules {
  appDataStore: StateAppData;
}

// export type Store =
export type Store = Omit<VuexStore<IStoreModules>, 'commit' | 'dispatch'> & {
  commit<
    K extends keyof MutationsAppData,
    P extends Parameters<MutationsAppData[K]>[1]
  >(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<MutationsAppData[K]>;
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
};
