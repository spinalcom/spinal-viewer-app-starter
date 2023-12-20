/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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

import { ActionContext } from "vuex";
import { MutationsAppData } from "../services/store/appDataStore/mutations";
import type { StateAppData } from "../services/store/appDataStore/state";
import { INodeItem } from "../interfaces/INodeItem";

export type AugmentedActionContextAppData = {
	commit<K extends keyof MutationsAppData>(key: K, payload: Parameters<MutationsAppData[K]>[1]): ReturnType<MutationsAppData[K]>;
} & Omit<ActionContext<StateAppData, StateAppData>, "commit">;

export enum ActionTypes {
	GET_BUILDINGS = "GET_BUILDINGS",
	GET_BUILDING_BY_ID = "GET_BUILDING_BY_ID",
	OPEN_VIEWER = "OPEN_VIEWER",
	GET_VIEWER_INFO = "GET_VIEWER_INFO",
	SELECT_ITEMS = "SELECT_ITEMS",
	FIT_TO_VIEW_ITEMS = "FIT_TO_VIEW_ITEMS",
	ISOLATE_ITEMS = "ISOLATE_ITEMS",
	UNLOAD_MODEL = "UNLOAD_MODEL",
	GET_FLOORS = "GET_FLOORS",
	GET_ROOMS = "GET_ROOMS",
	GET_EQUIPMENTS = "GET_EQUIPMENTS",
	GET_GROUPS_ITEMS = "GET_GROUPS_ITEMS",
	GET_CATEGORIES_TREE = "GET_CATEGORIES_TREE",
	GET_GROUPS_ITEMS_BY_GEOITEM = "GET_GROUPS_ITEMS_BY_GEOITEM",
	GET_ITEM_CONTROL_POINT = "GET_ITEM_CONTROL_POINT",
	COLOR_ITEMS = "COLOR_ITEMS",
	ADD_SPRITES = "ADD_SPRITES",
	ADD_COMPONENT_AS_SPRITES = "ADD_COMPONENT_AS_SPRITES",
	REGROUP_ITEMS = "REGROUP_ITEMS",
	REMOVE_ALL_SPRITES = "REMOVE_ALL_SPRITES",
}

export type TFctViewerIteract = (stateContext: AugmentedActionContextAppData, payload: { buildingId: string; id: number | number[] }) => Promise<void>;
export type TFctGeoAPICall<Payload, FctReturn> = (stateContext: AugmentedActionContextAppData, payload: Payload) => Promise<FctReturn>;

export interface IFctGeoCallPayload {
	platformId: string;
	id: number;
	forceUpdate?: boolean;
}

/*
export interface Actions {
  [ActionTypes.GET_BUILDINGS]({ commit, state }: AugmentedActionContextAppData, playload: {patrimoineId: string ,forceUpdate?: boolean }): Promise<IGetAllBuildingsRes[]>;
  
  [ActionTypes.GET_BUILDING_BY_ID]({ commit, state }: AugmentedActionContextAppData, playload: { buildingId: string, forceUpdate?: boolean }): Promise<IGetAllBuildingsRes>;
  
  [ActionTypes.GET_FLOORS]: TFctGeoAPICall<{ patrimoineId: string; buildingId: string; forceUpdate?: boolean }, IZoneItem[]>;

  [ActionTypes.GET_ROOMS]: TFctGeoAPICall<IFctGeoCallPayload, IZoneItem[]>;
  
  [ActionTypes.GET_EQUIPMENTS]: TFctGeoAPICall<IFctGeoCallPayload, IEquipmentItem[]>;

  [ActionTypes.OPEN_VIEWER]({ commit, state }: AugmentedActionContextAppData, payload: { onlyThisModel: boolean; item: ISpaceSelectorItem }): Promise<void>;

  [ActionTypes.GET_VIEWER_INFO]( { commit, state }: AugmentedActionContextAppData, payload: { item: ISpaceSelectorItem; forceUpdate?: boolean; }): Promise<IViewInfoItemRes[]>;
  
  [ActionTypes.GET_GEOGRAPHIC_ITEMS_GROUPS]({ commit, state }: AugmentedActionContextAppData, playload: { forceUpdate?: boolean;  buildingId: string}): Promise<{ [key: string]: INodeItem }>;
  

  [ActionTypes.SELECT_ITEMS]({commit, dispatch, state}: AugmentedActionContextAppData, playload: any) : void;
  [ActionTypes.FIT_TO_VIEW_ITEMS]({commit, dispatch, state}: AugmentedActionContextAppData, playload: any) : void;
  [ActionTypes.ISOLATE_ITEMS]({commit, dispatch, state}: AugmentedActionContextAppData, playload: any) : void;
}
*/

type asyncGen = { [ActionIt in ActionTypes]?: AsyncGenerator<Awaited<ReturnType<ActionIt>>> };

export type ApiIteratorStoreType = asyncGen | { [key: string]: asyncGen };

export type ApiIteratorStoreRecordStringType = {
	[ActionIt in ActionTypes]?: Record<string, AsyncGenerator<Awaited<ReturnType<Actions[ActionIt]>>>>;
};

export type ApiIteratorStoreRecordNumberType = { [ActionIt in ActionTypes]?: Record<number, AsyncGenerator<Awaited<ReturnType<Actions[ActionIt]>>>> };
