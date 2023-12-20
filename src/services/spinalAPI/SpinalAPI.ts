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

import axios from 'axios';

export class SpinalAPI {
  axiosInstance = axios.create({ baseURL: this.apiUrl });
  get apiUrl() {
    return `${this._apiUrl}${this._apiUrl.endsWith('/') ? '' : '/'}`;
  }

  private constructor(public readonly _apiUrl: string = '') {
    this.axiosInstance.interceptors.request.use((request) => {
      const t = localStorage.getItem('token');
      // @ts-ignore
      if (t) request.headers.common.Authorization = `Bearer ${t}`;
      return request;
    });
  }

  static #instance: SpinalAPI;
  /**
   * @static
   * @param {string} [apiUrl] mandatory on 1st call after it's not needed
   * @return {*}  {SpinalAPI}
   * @memberof SpinalAPI
   */
  public static getInstance(apiUrl?: string): SpinalAPI {
    if (SpinalAPI.#instance) return SpinalAPI.#instance;
    SpinalAPI.#instance = new SpinalAPI(apiUrl);

    return SpinalAPI.#instance;
  }

  public createUrl(ApiRoute: string): string {
    if (ApiRoute.startsWith('/')) ApiRoute = ApiRoute.substring(1);
    return this.apiUrl + ApiRoute;
  }

  public createUrlWithPlatformId(buildingId: string, ApiRoute: string): string {
    if (!ApiRoute.startsWith('/')) ApiRoute = '/' + ApiRoute;
    return `${this.apiUrl}api/v2/building/${buildingId}${ApiRoute}`;
  }

  get = this.axiosInstance.get;
  post = this.axiosInstance.post;

  async *createIteratorCall<K extends (...args) => any>(
    fct: K,
    ...args: Parameters<K>
  ): AsyncGenerator<Awaited<ReturnType<K>>> {
    const res = await fct(...args);
    while (true) {
      yield res;
    }
  }
}
