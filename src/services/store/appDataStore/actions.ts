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

import { getBuildings, getBuildingById } from "../../spinalAPI/GeographicContext/getBuildings";
import { IGetAllBuildingsRes } from "../../../interfaces/IGetAllBuildingsRes";
import { SpinalAPI } from "../../spinalAPI/SpinalAPI";
import { MutationTypes } from "./mutations";
import { getEquipments, getFloors, getRooms } from "../../spinalAPI/GeographicContext/geographicContext";
import type { IEquipmentItem, IZoneItem } from "../../../components/SpaceSelector";
import { IViewInfoItemRes } from "../../spinalAPI/GeographicContext/getViewInfo";
import { ActionTypes, ApiIteratorStoreRecordNumberType, ApiIteratorStoreRecordStringType, ApiIteratorStoreType, AugmentedActionContextAppData } from "../../../interfaces/vuexStoreTypes";
import SpriteManager from "../../../components/viewer/manager/spriteManager";
import ViewerManager from "../../../components/viewer/manager/viewerManager";
import { IConfig } from "../../../interfaces/IConfig";
import { classifyItemByBimFileId } from "./utils/openViewer";

const ApiIteratorStore: ApiIteratorStoreType & ApiIteratorStoreRecordStringType & ApiIteratorStoreRecordNumberType = {};

export const actions = {
	async [ActionTypes.GET_BUILDINGS]({ commit, state }: AugmentedActionContextAppData, { patrimoineId, forceUpdate }): Promise<IGetAllBuildingsRes[]> {
		const spinalAPI = SpinalAPI.getInstance();
		if (typeof ApiIteratorStore[ActionTypes.GET_BUILDINGS] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_BUILDINGS] = {};
		}

		if (typeof ApiIteratorStore[ActionTypes.GET_BUILDINGS][patrimoineId] === "undefined" || forceUpdate === true) {
			ApiIteratorStore[ActionTypes.GET_BUILDINGS][patrimoineId] = spinalAPI.createIteratorCall(getBuildings, patrimoineId);
		}

		const buildings = await ApiIteratorStore[ActionTypes.GET_BUILDINGS][patrimoineId]!.next();
		commit(MutationTypes.SET_BUILDINGS, buildings.value);
		return buildings.value;
	},

	async [ActionTypes.GET_BUILDING_BY_ID]({ commit, state }: AugmentedActionContextAppData, { buildingId, forceUpdate }): Promise<IGetAllBuildingsRes> {
		const spinalAPI = SpinalAPI.getInstance();
		if (typeof ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID] = {};
		}

		if (typeof ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID][buildingId] === "undefined" || forceUpdate === true) {
			ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID][buildingId] = spinalAPI.createIteratorCall(getBuildingById, buildingId);
		}

		const building = await ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID][buildingId]!.next();
		return building.value;
	},

	async [ActionTypes.GET_FLOORS]({ commit }: AugmentedActionContextAppData, { buildingId, patrimoineId, forceUpdate }): Promise<IZoneItem[]> {
		const spinalAPI = SpinalAPI.getInstance();
		if (typeof ApiIteratorStore[ActionTypes.GET_FLOORS] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_FLOORS] = {};
		}

		const floorObjStore = ApiIteratorStore[ActionTypes.GET_FLOORS]!;
		if (typeof floorObjStore[buildingId] === "undefined" || forceUpdate === true) {
			floorObjStore[buildingId] = spinalAPI.createIteratorCall(getFloors, patrimoineId, buildingId);
		}

		const floors = await floorObjStore[buildingId].next();
		commit(MutationTypes.SET_FLOORS, { id: buildingId, items: floors.value });
		return floors.value;
	},

	async [ActionTypes.GET_ROOMS]({ commit }: AugmentedActionContextAppData, { buildingId, patrimoineId, floorId, id, forceUpdate }: any): Promise<IZoneItem[]> {
		const spinalAPI = SpinalAPI.getInstance();
		if (typeof ApiIteratorStore[ActionTypes.GET_ROOMS] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_ROOMS] = {};
		}
		const floorObjStore = ApiIteratorStore[ActionTypes.GET_ROOMS]!;

		if (typeof floorObjStore[id] === "undefined" || forceUpdate === true) {
			floorObjStore[id] = spinalAPI.createIteratorCall(getRooms, patrimoineId, buildingId, floorId, id);
		}
		const floors = await floorObjStore[id].next();
		commit(MutationTypes.SET_ROOMS, { id: id, items: floors.value });
		return floors.value;
	},

	async [ActionTypes.GET_EQUIPMENTS]({ commit }: AugmentedActionContextAppData, { floorId, roomId, patrimoineId, buildingId, id, forceUpdate }: any): Promise<IEquipmentItem[]> {
		const spinalAPI = SpinalAPI.getInstance();

		if (typeof ApiIteratorStore[ActionTypes.GET_EQUIPMENTS] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_EQUIPMENTS] = {};
		}

		const roomObjStore = ApiIteratorStore[ActionTypes.GET_EQUIPMENTS]!;

		if (typeof roomObjStore[id] === "undefined" || forceUpdate === true) {
			roomObjStore[id] = spinalAPI.createIteratorCall(getEquipments, patrimoineId, buildingId, floorId, roomId, id);
		}

		const equipments = await roomObjStore[id].next();
		commit(MutationTypes.SET_EQUIPMENTS, { id: id, items: equipments.value });
		return equipments.value;
	},

	////////////////////////////////////////////////////////
	//                VIEWER
	////////////////////////////////////////////////////////

	async [ActionTypes.OPEN_VIEWER]({ commit, dispatch, state }: AugmentedActionContextAppData, playload: { onlyThisModel: boolean; config: IConfig; item: any }): Promise<void> {
		try {
			const viewerInfo = playload.config.viewerInfo;
			const body = {
				dynamicId: [playload.item.dynamicId],
				roomRef: viewerInfo.roomRef,
				floorRef: viewerInfo.floorRef,
				equipements: false,
				dbIdsToAdd: [],
			};

			if (viewerInfo.equipments === "all") {
				body.equipements = true;
				body.dbIdsToAdd = [];
			} else if (viewerInfo.equipments === "groupItem") {
				body.equipements = false;
				const map = await dispatch(ActionTypes.GET_GROUPS_ITEMS, { config: playload.config, buildingId: playload.item.buildingId });
				body.dbIdsToAdd = classifyItemByBimFileId(map, playload.item.dynamicId, playload.item.type);
			}

			await ViewerManager.getInstance().loadInViewer(playload.item, playload.onlyThisModel, body);

			if (playload.onlyThisModel) state.viewerStartedList = {};

			commit(MutationTypes.ADD_VIEWER_LOADED, { id: playload.item.dynamicId });
		} catch (error) {
			console.log("errror", error);
		}
	},

	async [ActionTypes.GET_VIEWER_INFO]({ commit, state }: AugmentedActionContextAppData, playload): Promise<IViewInfoItemRes[]> {
		return ViewerManager.getInstance().getViewerInfoMerged(playload);
	},

	[ActionTypes.SELECT_ITEMS]({ commit, dispatch, state }, playload: any) {
		ViewerManager.getInstance().select(playload);
	},

	[ActionTypes.ISOLATE_ITEMS]({ commit, dispatch, state }, playload: any) {
		ViewerManager.getInstance().isolate(playload);
	},

	[ActionTypes.FIT_TO_VIEW_ITEMS]({ commit, dispatch, state }, playload: any) {
		ViewerManager.getInstance().fitToView(playload);
	},

	async [ActionTypes.UNLOAD_MODEL]({ commit, dispatch, state }, playload: any) {
		await ViewerManager.getInstance().unload(playload);

		if (!Array.isArray(playload)) playload = [playload];

		for (const item of playload) {
			commit(MutationTypes.REMOVE_VIEWER_LOADED, { id: item.dynamicId });
		}
	},

	[ActionTypes.COLOR_ITEMS]({ commit, dispatch, state }, { items, buildingId }: any) {
		return ViewerManager.getInstance().colorItems(items, buildingId);
	},

	[ActionTypes.ADD_SPRITES]({ commit, dispatch, state }, { items, buildingId }: any) {
		return ViewerManager.getInstance().addSprites(items, buildingId);
	},

	[ActionTypes.ADD_COMPONENT_AS_SPRITES]({ commit, dispatch, state }, { items, buildingId, component }: any) {
		return ViewerManager.getInstance().addComponentAsSprites(items, buildingId, component);
	},

	[ActionTypes.REMOVE_ALL_SPRITES]({ commit, dispatch, state }) {
		return SpriteManager.getInstance().removeSprites();
	},
};
