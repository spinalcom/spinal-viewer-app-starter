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

import { ModelManager } from "./modelManager";
import { getViewInfo, getViewInfoFormatted, IViewInfoBody, IViewInfoItemRes, IViewInfoTmpRes, mergeIViewInfo } from "../requests/GeographicContext/getViewInfo";
import { IPlayload, IPlayloadWithComponent } from "../interfaces/IPlayload";
import { EmitterViewerHandler, VIEWER_ADD_SPRITE, VIEWER_INITIALIZED, VIEWER_OBJ_COLOR, VIEWER_OBJ_FIT_TO_VIEW, VIEWER_OBJ_ISOLATE, VIEWER_OBJ_SELECT, VIEWER_START_LOAD_MODEL, ViewerEventWithData } from "spinal-viewer-event-manager";
import { VIEWER_EVENTS } from "../events";
import Vue from "vue";

export class ViewerManager {
	private static _instance: ViewerManager;
	public viewer: Autodesk.Viewing.Viewer3D;
	public modelManager: ModelManager = ModelManager.getInstance();
	private _buildingInfo: any = {};
	private _viewerStores = {};
	private _viewerStartedList: { [key: string]: Set<string> } = {};

	private constructor() {}

	public static getInstance(): ViewerManager {
		if (!this._instance) this._instance = new ViewerManager();
		return this._instance;
	}

	/////////////////////////////////////////////////////////////////////////
	//                           Viewer                                    //
	/////////////////////////////////////////////////////////////////////////

	public initViewer(viewerDiv: HTMLElement): Promise<Autodesk.Viewing.Viewer3D> {
		Autodesk.Viewing.Private.InitParametersSetting.alpha = true;

		return new Promise((resolve) => {
			const options = {
				env: "Local",
				docid: "",
				useADP: false,
			};
			const _self = this;
			Autodesk.Viewing.Initializer(options, function () {
				if (viewerDiv) {
					const customProfileSettings = Autodesk.Viewing.DefaultSettings;
					// customProfileSettings.lightPreset = 7;
					customProfileSettings.ghosting = false;

					// const viewer: Autodesk.Viewing.Viewer3D = new Autodesk.Viewing.GuiViewer3D(viewerDiv, customProfileSettings);
					const viewer: Autodesk.Viewing.Viewer3D = new Autodesk.Viewing.Viewer3D(viewerDiv, customProfileSettings);
					_self.viewer = viewer;
					resolve(viewer);
				}
			});
		});
	}

	public async loadInViewer(item: IPlayload, loadOnlyThisModel: boolean = true, body?: IViewInfoBody & { dbIdsToAdd?: { bimFileId: string; dbIds: number[] }[] }) {
		// if (this._viewerStartedList[item.staticId]) return;
		if (this._viewerStartedList[item.dynamicId]) {
			this.showAllObjects();
			return;
		}

		if (loadOnlyThisModel) {
			const items = Object.keys(this._viewerStartedList);
			await this.unload(items);
		}

		const emitter = EmitterViewerHandler.getInstance();

		emitter.once(VIEWER_INITIALIZED, async () => {
			const buildingId = item.buildingId;
			const dynamicId = item.dynamicId;
			if (!body) body = { dynamicId: [dynamicId], floorRef: true, roomRef: true, equipements: false };

			const res = await this.getViewerInfoMerged(item, body);

			emitter.once(<any>VIEWER_EVENTS.LOADED, (data) => {
				this._addViewLoaded(data.id, data.models);
			});

			const viewerInfo = await getViewInfoFormatted(buildingId, res, item);
			emitter.emit(VIEWER_START_LOAD_MODEL, viewerInfo);
		});
	}

	public async getViewerInfoMerged(argItem: IPlayload | IPlayload[], body?: IViewInfoBody & { dbIdsToAdd?: { bimFileId: string; dbIds: number[] }[] }): Promise<IViewInfoItemRes[]> {
		const datas = await this.getViewerInfo(argItem, undefined, body);
		const res = [];

		for (const _item of datas) {
			mergeIViewInfo(res, _item.data);
		}

		mergeIViewInfo(res, body?.dbIdsToAdd || []);

		return res.map((it: IViewInfoTmpRes): IViewInfoItemRes => {
			return { bimFileId: it.bimFileId, dbIds: Array.from(it.dbIds) };
		});
	}

	public async getViewerInfo(argItem: IPlayload | IPlayload[], argBuildingId?: string, body?: IViewInfoBody): Promise<any[]> {
		if (typeof this._viewerStores["GET_VIEWER_INFO"] === "undefined") {
			this._viewerStores["GET_VIEWER_INFO"] = {};
		}

		const items = Array.isArray(argItem) ? argItem : [argItem];
		const buildingId = argBuildingId || items[0].buildingId;
		const ids = items.map((el) => el.dynamicId);
		const res: any[] = [];
		const nodeTofetech: number[] = [];

		for (const dynId of ids) {
			if (this._viewerStores["GET_VIEWER_INFO"][dynId]) {
				const itemData = (await this._viewerStores["GET_VIEWER_INFO"][dynId].next())?.value;
				if (itemData) res.push(itemData);
			} else {
				nodeTofetech.push(dynId);
			}
		}

		if (nodeTofetech.length > 0) {
			if (!body) body = { dynamicId: nodeTofetech, floorRef: true, roomRef: true, equipements: false };
			const datas = await getViewInfo(buildingId, body);

			for (const _item of datas) {
				this._viewerStores["GET_VIEWER_INFO"][_item.dynamicId] = generator(_item);
				res.push(_item);
			}
		}

		return res;

		async function* generator(data): AsyncGenerator<Awaited<any>> {
			while (true) {
				yield data;
			}
		}
	}

	public select(item: IPlayload) {
		return this._fctViewerIteract(VIEWER_OBJ_SELECT, item);
	}

	public isolate(item: IPlayload) {
		return this._fctViewerIteract(VIEWER_OBJ_ISOLATE, item);
	}

	public showAllObjects() {
		const emitter = EmitterViewerHandler.getInstance();
		emitter.emit(VIEWER_OBJ_ISOLATE as any);
	}

	public fitToView(item: IPlayload) {
		return this._fctViewerIteract(VIEWER_OBJ_FIT_TO_VIEW, item);
	}

	public unload(item: (IPlayload | string) | (IPlayload | string)[]) {
		return this._fctViewerIteract(VIEWER_EVENTS.UNLOAD as any, item);
	}

	public async colorItems(item: IPlayload | IPlayload[], buildingId?: string) {
		const formatted = await this._getAndFormatViewerInfos(item, buildingId);
		const emitter = EmitterViewerHandler.getInstance();
		emitter.emit(VIEWER_OBJ_COLOR, formatted as any);
	}

	public async addSprites(item: IPlayload | IPlayload[], buildingId?: string) {
		const formatted = await this._getAndFormatViewerInfos(item, buildingId);
		const emitter = EmitterViewerHandler.getInstance();
		emitter.emit(VIEWER_ADD_SPRITE, formatted as any);
	}

	public async addComponentAsSprites(item: IPlayloadWithComponent | IPlayloadWithComponent[], buildingId: string, component?: Vue) {
		const formatted = await this._getAndFormatViewerInfos(item, buildingId, component);
		const emitter = EmitterViewerHandler.getInstance();
		emitter.emit(<any>VIEWER_EVENTS.VIEWER_ADD_COMPONENT_SPRITE, formatted as any);
	}

	//////////////////////////////////////////////////////////////////////////////

	private async _getAndFormatViewerInfos(item: IPlayloadWithComponent | IPlayloadWithComponent[], buildingId?: string, component?: Vue) {
		item = Array.isArray(item) ? item : [item];
		const data = await this.getViewerInfo(item, buildingId);

		const obj = convertToObj(data);

		return item.map((i) => ({
			// dbIds: obj[i.dynamicId]?.dbIds ||[],
			// bimFileId: obj[i.dynamicId]?.bimFileId,
			data: obj[i.dynamicId],
			color: i.color,
			value: i.displayValue,
			modelId: (i as IPlayload).floorId || (i as IPlayload).id || (i as IPlayload).dynamicId,
			parent: Object.assign({}, i),
			position: (i as any).position,
			component: i.component || component,
		}));
	}

	private async _fctViewerIteract(eventName: keyof ViewerEventWithData, playload: (IPlayload | string) | (IPlayload | string)[]): Promise<any> {
		const emitter = EmitterViewerHandler.getInstance();
		if (eventName === (VIEWER_EVENTS.UNLOAD as any)) {
			playload = Array.isArray(playload) ? playload : [playload];
			const obj = {};

			const modelIds = playload.map((item) => {
				return typeof item === "string" || typeof item === "number" ? item : item?.dynamicId;
			});

			emitter.emit(eventName, modelIds as any);

			playload.forEach((item) => {
				const _tempId = typeof item === "string" || typeof item === "number" ? item : item?.dynamicId;
				this._removeViewLoaded(_tempId);
			});

			return;
		}

		const data: IViewInfoItemRes[] = await this.getViewerInfoMerged(playload as IPlayload);
		const res = data.map((it) => {
			return {
				dbIds: it.dbIds,
				bimFileId: it.bimFileId,
				modelId: (playload as IPlayload).floorId || (playload as IPlayload).id || (playload as IPlayload).dynamicId,
			};
		});

		emitter.emit(eventName, res);
	}

	private _addViewLoaded(nodeId: string, models: any[]) {
		if (!this._viewerStartedList[nodeId]) this._viewerStartedList[nodeId] = new Set([]);
		for (const model of models) {
			this._viewerStartedList[nodeId].add(model.id);
		}
	}

	private _removeViewLoaded(nodeId: string | number) {
		delete this._viewerStartedList[nodeId];
	}

	private _removeToolbarControl() {
		this.viewer;
	}
}

function convertToObj(arr) {
	return arr.reduce((obj, item) => {
		obj[item.dynamicId] = item.data;
		// obj[item.dynamicId] = item.data.reduce((obj2, el) => {
		//    obj2.dbIds.push(...el.dbIds);
		//    obj2.bimFileId = el.bimFileId;
		//    return obj2;
		// }, { dbIds: [], bimFileId: undefined });

		return obj;
	}, {});
}

export default ViewerManager;
