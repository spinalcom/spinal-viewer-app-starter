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

export interface ISceneDefaultRes {
  dynamicId: number;
  staticId: string;
  name: string;
  description: string;
  type: string;
  autoLoad?: boolean;
  useAllDT?: boolean;
  sceneAlignMethod?: number;
  options?: IOptionsItem[];
  scenesItems: IScenesItemsItem[];
}
export interface IScenesItemsItem {
  name: string;
  dynamicId: number;
  staticId: string;
  item: string;
  aecPath?: string;
}
export interface IOptionsItem {
  urn: string;
  dbIds?: number[];
  loadOption?: ILoadOption;
}
export interface ILoadOption {
  globalOffset: IGlobalOffset;
}
export interface IGlobalOffset {
  x: number;
  y: number;
  z: number;
}
