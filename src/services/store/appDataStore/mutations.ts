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

import type { IEquipmentItem, IZoneItem, ISpaceSelectorItem } from "../../../components/SpaceSelector";
import type { IGetAllBuildingsRes } from "../../../interfaces/IGetAllBuildingsRes";
import { IViewInfoItemRes } from "../../../services/spinalAPI/GeographicContext/getViewInfo";
import type { MutationTree } from "vuex";
import type { StateAppData } from "./state";
import { stat } from "fs";
import { INodeItemTree } from "../../../interfaces/INodeItem";

export enum MutationTypes {
	SET_BUILDINGS = "SET_BUILDINGS",
	SET_SELECTED_ZONE = "SET_SELECTED_ZONE",
	SET_FLOORS = "SET_FLOORS",
	SET_ROOMS = "SET_ROOMS",
	SET_EQUIPMENTS = "SET_EQUIPMENTS",
	SET_VIEWINFO = "SET_VIEWINFO",
	SET_TEMPORALITY = "SET_TEMPORALITY",
	ADD_VIEWER_LOADED = "ADD_VIEWER_LOADED",
	REMOVE_VIEWER_LOADED = "REMOVE_VIEWER_LOADED",
	SET_ITEM_SELECTED = "SET_ITEM_SELECTED",
	SET_DATA = "SET_DATA",
}

export type MutationsAppData<S = StateAppData> = {
	[MutationTypes.SET_BUILDINGS](state: S, payload: IGetAllBuildingsRes[]): void;
	[MutationTypes.SET_SELECTED_ZONE](state: S, payload: ISpaceSelectorItem): void;
	[MutationTypes.SET_FLOORS](state: S, payload: { id: string; items: IZoneItem[] }): void;
	[MutationTypes.SET_ROOMS](state: S, payload: { id: number; items: IZoneItem[] }): void;
	[MutationTypes.SET_EQUIPMENTS](state: S, payload: { id: number; items: IEquipmentItem[] }): void;
	[MutationTypes.SET_VIEWINFO](state: S, payload: { id: number; items: IViewInfoItemRes[] }): void;
	[MutationTypes.ADD_VIEWER_LOADED](state: S, payload: { id: string }): void;
	[MutationTypes.REMOVE_VIEWER_LOADED](state: StateAppData, payload: { id: string }): void;
	[MutationTypes.SET_ITEM_SELECTED](state: StateAppData, item): void;
	[MutationTypes.SET_DATA](state: StateAppData, data: INodeItemTree[]): void;
};

export const mutations: MutationTree<StateAppData> & MutationsAppData = {
	[MutationTypes.SET_BUILDINGS](state: StateAppData, payload: IGetAllBuildingsRes[]): void {
		state.buildings = payload;
	},
	[MutationTypes.SET_SELECTED_ZONE](state: StateAppData, payload: ISpaceSelectorItem): void {
		state.zoneSelected = payload;
	},
	[MutationTypes.SET_FLOORS](state: StateAppData, { id, items }: { id: string; items: IZoneItem[] }): void {
		state.floors[id] = items;
	},
	[MutationTypes.SET_ROOMS](state: StateAppData, { id, items }: { id: number; items: IZoneItem[] }): void {
		state.rooms[id] = items;
	},
	[MutationTypes.SET_EQUIPMENTS](state: StateAppData, { id, items }: { id: number; items: IEquipmentItem[] }): void {
		state.roomBimObj[id] = items;
	},
	[MutationTypes.SET_VIEWINFO](state: StateAppData, { id, items }: { id: number; items: IViewInfoItemRes[] }): void {
		state.buildingInfo[id] = items;
	},

	[MutationTypes.SET_TEMPORALITY](state: StateAppData, payload: ISpaceSelectorItem) {
		state.temporalitySelected = payload;
	},

	[MutationTypes.ADD_VIEWER_LOADED](state: StateAppData, { id }): void {
		const copy = Object.assign({}, state.viewerStartedList);
		if (!copy[id]) copy[id] = id;

		state.viewerStartedList = copy;
	},

	[MutationTypes.REMOVE_VIEWER_LOADED](state: StateAppData, { id }): void {
		const copy = Object.assign({}, state.viewerStartedList);
		delete copy[id];

		state.viewerStartedList = copy;
	},

	[MutationTypes.SET_ITEM_SELECTED](state: StateAppData, item): void {
		state.itemSelected = item;
	},

	[MutationTypes.SET_DATA](state: StateAppData, data: INodeItemTree[]): void {
		state.data = data;
	},
};
