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

import { EViewerSetCamera, IDbIdModelAggregate, IStartLoadModel, SceneAlignMethod } from "spinal-viewer-event-manager";
import { IloadModelTask } from "../interfaces/ILoadModelTask";
import { load1stThenAll } from "./load1stThenAll";
import { getGlobalOffset } from "./getGlobalOffset";
import { addOffsetFromAEC } from "./addOffsetFromAEC";
import { getAPINormalisePath } from "./getAPINormalisePath";
import { ModelManager } from "../manager/modelManager";
import { IViewerColorData } from "../interfaces/IViewerColorData";
import { getPosition } from "./getObjectPos";
import SpriteManager from "../manager/spriteManager";
import Vue from "vue";

export class ViewerUtils {
	private static _instance: ViewerUtils;
	private _isFirstModel: boolean = true;
	public waitBeforeDisplaySprites: boolean = true;

	private constructor() {}

	public static getInstance(): ViewerUtils {
		if (!this._instance) this._instance = new ViewerUtils();

		return this._instance;
	}

	setWaitBeforeDisplaySprites(value: boolean) {
		this.waitBeforeDisplaySprites = value;
		if (!value) {
			setTimeout(() => {
				this.waitBeforeDisplaySprites = true;
			}, 1000);
		}
	}

	public async load3DModels(viewer: Autodesk.Viewing.Viewer3D, data: IStartLoadModel): Promise<Autodesk.Viewing.Model[]> {
		const tasks: IloadModelTask[] = [];
		for (const d of data.models) {
			tasks.push({
				bimFileId: d.bimFileId,
				path: this._addSlash(d.path),
				dbids: d.dbids,
				aecPath: this._addSlash(d.aecPath),
				id: d.id,
				name: d.name,
			});
		}

		this.setWaitBeforeDisplaySprites(true);

		return load1stThenAll(
			tasks,
			async (d: IloadModelTask): Promise<Autodesk.Viewing.Model> => {
				// return this._loadBimFile(viewer, d.path, data.loadingType as any, d.id, d.dbids, d.aecPath, data.buildingId);
				return this._loadBimFile(viewer, d.path, data.loadingType as any, d.id, d.dbids, d.aecPath, data.buildingId);
			},
			this._isFirstModel
		).then((result) => {
			ModelManager.getInstance().addNewModel((data as any).item?.dynamicId, result);
			this.setWaitBeforeDisplaySprites(false);

			this.setCamera(viewer, EViewerSetCamera.top);
			return result;
		});
	}

	public async unloadModel(viewer: Autodesk.Viewing.Viewer3D, arg_modelIds: string[]) {
		if (!arg_modelIds || arg_modelIds.length === 0) return;
		await SpriteManager.getInstance().removeSprites();

		const instance = ModelManager.getInstance();

		for (const id of arg_modelIds) {
			const models = instance.getModelById(id);
			if (models) {
				for (const model of models) {
					(viewer.impl as any).unloadModel(model);
				}
				instance.deleteModel(id);
			}
		}

		// const models = (viewer.impl as any).modelQueue()?.getModels() || [];
		// for (let i = 0; i < models.length; i++) {
		//   const model = models[i];
		//   if (arg_modelIds.has(model.id)) {
		//     (viewer.impl as any).unloadModel(model);
		//     i--;
		//   }
		// }
	}

	public clearSelect(viewer: Autodesk.Viewing.Viewer3D): void {
		viewer.clearSelection();
	}

	public viewerSelect(viewer: Autodesk.Viewing.Viewer3D, data: IDbIdModelAggregate[]): void {
		this.clearSelect(viewer);

		const datas = this._classifyDbIdsByModel(data);

		for (const { model, dbIds } of datas) {
			model.selector.setSelection(dbIds, "selectOnly");
		}

		// if (data.length === 1) {
		//   const d = data[0];
		//   const model = ModelManager.getInstance().getModelById(d.modelId)
		//   model[0].selector.setSelection(d.dbIds, "selectOnly")
		//   // viewer.select(d.dbIds, model[0]);
		// } else {
		//   for (const d of data) {
		//     const models = ModelManager.getInstance().getModelById(d.modelId);
		//     const ids = typeof d.dbIds === 'number' ? [d.dbIds] : d.dbIds;

		//     for (const model of models) {
		//       // @ts-ignore
		//       model.selector.setSelection(ids,"selectOnly");
		//     }
		//   }
		//   try {
		//     this._fireAggregateSelectionChangedEvent(viewer);
		//   } catch (e) {
		//     console.error(
		//       'error while trying to fire AggregateSelectionChanged Event'
		//     );
		//   }
		// }
	}

	public viewerIsolation(viewer: Autodesk.Viewing.Viewer3D, data: (IDbIdModelAggregate & { bimFileId: string })[]): void {
		this.setWaitBeforeDisplaySprites(true);

		const datas = this._classifyDbIdsByModel(data);

		for (const { model, dbIds } of datas) {
			if (dbIds.length > 0) {
				if (model.visibilityManager) viewer.isolate(dbIds, model);
			} else {
				isolateAll(model);
			}
		}

		this.setWaitBeforeDisplaySprites(false);

		this.viewerFitToView(viewer, data);

		function isolateAll(m: Autodesk.Viewing.Model) {
			let rootId = m.getRootId();
			m.getObjectTree((tree) => {
				let dbidRoot = tree.nodeAccess.dbIdToIndex[rootId];
				viewer.isolate([dbidRoot], m);
			});
		}
	}

	public showAllObject(viewer: Autodesk.Viewing.Viewer3D) {
		this.setWaitBeforeDisplaySprites(true);
		const aggregateIsolation = viewer.getAggregateIsolation();

		for (const d of aggregateIsolation) {
			viewer.isolate(0, d.model);
		}

		const hiddenModels = viewer.getHiddenModels();

		for (const model of hiddenModels) {
			viewer.showModel(model.id, false);
		}

		this.setWaitBeforeDisplaySprites(false);

		viewer.fitToView();
	}

	public viewerFitToView(viewer: Autodesk.Viewing.Viewer3D, data: IDbIdModelAggregate[]): void {
		const datas = this._classifyDbIdsByModel(data as any);
		const arrayToFit: { model: Autodesk.Viewing.Model; selection: number[] }[] = datas.map(({ dbIds, model }) => ({ model, selection: dbIds }));
		viewer.fitToView(arrayToFit as any);
	}

	public setCamera(viewer: Autodesk.Viewing.Viewer3D, data: EViewerSetCamera | EViewerSetCamera[] = EViewerSetCamera["top,front"]) {
		if (!Array.isArray(data)) data = [data];

		const dataFormatted: string[] = data.map((el: any) => {
			if (!isNaN(el)) el = EViewerSetCamera[el];

			return `[${el.replace(",", "/")}]`;
		});

		const viewcuiext = viewer.getExtension("Autodesk.ViewCubeUi");
		if (viewcuiext) viewcuiext.setViewCube(dataFormatted.join(", "));

		// viewcuiext.setViewCube(display);
	}

	public async setObjColor(viewer: Autodesk.Viewing.Viewer3D, data: IViewerColorData[]) {
		await this._waitModelIsLoading();
		for (const item of data) {
			const viewData = item.data;
			for (const d of viewData) {
				const model = this._getModel(item.modelId, d.bimFileId);
				if (!model) continue;

				const rgbColor = convertHexColorToRGB(item.color);
				let realColor = rgbColor ? new THREE.Vector4(rgbColor.r / 255, rgbColor.g / 255, rgbColor.b / 255, 0.7) : new THREE.Vector4(1, 0, 0, 0);
				for (const id of d.dbIds) {
					viewer.setThemingColor(id, realColor, model);
				}
			}
		}
	}

	public async addSprite(viewer: Autodesk.Viewing.Viewer3D, data: any) {
		await this._waitModelIsLoading();

		const promises = data.map(async (item) => {
			const data = item.data.map(({ bimFileId, dbIds }) => ({ dbIds, model: this._getModel(item.modelId, bimFileId) }));

			return {
				modelId: item.modelId,
				color: item.color,
				value: item.value,
				models: data,
				dbId: data[0]?.dbIds[0],
				position: item.position || (await getPosition(data)),
				// position: await getPosition(data),
				data: item.parent,
				component: item.component,
			};
		});

		Promise.all(promises).then((result) => {
			SpriteManager.getInstance().createSprite(viewer, result);
		});
	}

	public async addComponentAsSprite(viewer: Autodesk.Viewing.Viewer3D, data: any) {
		await this._waitModelIsLoading();

		const promises = data.map(async (item) => {
			const data = item.data.map(({ bimFileId, dbIds }) => ({ dbIds, model: this._getModel(item.modelId, bimFileId) }));

			return {
				modelId: item.modelId,
				color: item.color,
				value: item.value,
				models: data,
				dbId: data[0]?.dbIds[0],
				position: item.position || (await getPosition(data)),
				// position: await getPosition(data),
				data: item.parent,
				component: item.component,
			};
		});

		Promise.all(promises).then((result) => {
			SpriteManager.getInstance().addComponentAsSprite(viewer, result);
		});
	}

	// public removeSprite(viewer: Autodesk.Viewing.Viewer3D, data: any) { }

	// public removeAllSprites(viewer: Autodesk.Viewing.Viewer3D) { }

	// public moveSprite(viewer: Autodesk.Viewing.Viewer3D, data: any) { }

	// public addLine(viewer: Autodesk.Viewing.Viewer3D, data: any) { }

	// public removeLine(viewer: Autodesk.Viewing.Viewer3D, data: any) { }

	// public moveLine(viewer: Autodesk.Viewing.Viewer3D, data: any) { }

	// public addSphere(viewer: Autodesk.Viewing.Viewer3D, data: any) {   }

	// public removeSphere(viewer: Autodesk.Viewing.Viewer3D, data: any) { }

	// public moveSphere(viewer: Autodesk.Viewing.Viewer3D, data: any) { }

	///////////////////////////////////////////////////////////////////
	//                            PRIVATE                            //
	///////////////////////////////////////////////////////////////////

	private async _loadBimFile(viewer: Autodesk.Viewing.Viewer3D, urlpath: string, sceneAlignMethod: SceneAlignMethod, modelId: string, dbids?: number[], aecPath?: string, buildingId?: string): Promise<Autodesk.Viewing.Model> {
		try {
			const option: { globalOffset?: THREE.Vector3; applyRefPoint?: boolean; ids?: number[]; headlessViewer: boolean; theme?: string } = {
				headlessViewer: true,
			};

			if (dbids) {
				option.ids = dbids;
			}

			if (sceneAlignMethod === SceneAlignMethod.OriginToOrigin) {
				option.globalOffset = await getGlobalOffset(viewer, buildingId);
			} else if (sceneAlignMethod === SceneAlignMethod.ShareCoordinates && aecPath) {
				option.applyRefPoint = true;
				option.globalOffset = await addOffsetFromAEC(getAPINormalisePath(aecPath, buildingId), viewer, buildingId);
			}

			const path = getAPINormalisePath(urlpath, buildingId);
			const model = await this._loadModel(modelId, viewer, path, option, this._isFirstModel);
			if (this._isFirstModel) this._isFirstModel = false;

			return model;
		} catch (error) {}
	}

	private _addSlash(path: string): string {
		if (path) return path[0] === "/" ? path : "/" + path;
		return "";
	}

	private _loadModel(modelId: string, viewer: Autodesk.Viewing.Viewer3D, path: string, option: any = {}, start: boolean = false): Promise<Autodesk.Viewing.Model> {
		return new Promise((resolve, reject) => {
			let m: Autodesk.Viewing.Model = undefined;
			const fn = (e: any) => {
				if (m && e.model.id === m.id) {
					viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, fn);
					resolve(m);
				}
			};

			viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, fn);

			let fct = start ? viewer.start : viewer.loadModel;
			fct.call(
				viewer,
				path,
				option,
				(model: Autodesk.Viewing.Model): void => {
					// ModelManager.getInstance().addNewModel(modelId, model);
					m = model;
				},
				reject
			);

			if (start) {
				viewer.loadExtension("Autodesk.ViewCubeUi", viewer.config);
				SpriteManager.getInstance().loadDataVisualizationExtension(viewer);
				// change viewer background
				viewer.impl.renderer().setClearAlpha(0);
				viewer.impl.glrenderer().setClearColor(0xffffff, 0);
				viewer.impl.invalidate(true);
			}
		});
	}

	private _fireAggregateSelectionChangedEvent(viewer: Autodesk.Viewing.Viewer3D) {
		var perModel: any[] = [];
		for (const [, models] of ModelManager.getInstance().getModelList()) {
			for (const model of models) {
				var dbIdArray: number[] = [];
				var fragIdsArray: any[] = [];
				// @ts-ignore
				var sset = model.selector.selectedObjectIds;
				// @ts-ignore
				var instanceTree = model.selector.getInstanceTree();
				for (var p in sset) {
					if (sset[p]) {
						var dbId = parseInt(p);
						if (dbId) {
							dbIdArray.push(dbId);

							if (instanceTree) {
								instanceTree.enumNodeFragments(
									dbId,
									function (fragId) {
										fragIdsArray.push(fragId);
									},
									false
								);
							}
						}
					}
				}

				if (dbIdArray.length) {
					perModel.push({
						fragIdsArray: fragIdsArray,
						dbIdArray: dbIdArray,
						nodeArray: dbIdArray,
						model: model,
					});
				}
			}
		}

		var event = {
			type: Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
			selections: perModel,
		};
		// @ts-ignore
		viewer.impl.api.dispatchEvent(event);
	}

	private _isSameData(data1: IDbIdModelAggregate[], data2: { ids: number[]; model: Autodesk.Viewing.Model }[]): boolean {
		if (data1.length !== data2.length) return false;
		for (const d1 of data1) {
			const models = ModelManager.getInstance().getModelById(d1.modelId);
			if (!models) return false;
			let found: any = [];
			for (const d2 of data2) {
				if (models.find((el) => el.id === d2.model.id)) {
					if (checkdbIds(d1.dbIds, d2.ids) === false) return false;
					found.push(d2);
					if (found.length === models.length) return true;
					break;
				}
			}
			if (found.length !== models.length) return false;
		}
		return true;
	}

	private async _waitModelIsLoading(): Promise<boolean> {
		const _self = this;
		return new Promise((resolve, reject) => {
			wait();

			function wait() {
				if (_self.waitBeforeDisplaySprites && !_self._allModelsAreLoaded()) {
					setTimeout(() => {
						wait();
					}, 500);
				} else {
					resolve(true);
					_self.setWaitBeforeDisplaySprites(true);
				}
			}
		});
	}

	private _classifyDbIdsByModel(data: (IDbIdModelAggregate & { bimFileId: string })[]) {
		// return data.reduce((list: {model: any, dbIds: number[]}[], el) => {
		//   const models = ModelManager.getInstance().getModelById(el.modelId);
		//   if (!models) return list;

		//   const model = models.find(m => (m as any).bimFileId === el.bimFileId);
		//   if (!model) return list;

		//   list.push({model, dbIds: el.dbIds})
		//   return list;
		// }, [])

		const obj = data.reduce((o, { bimFileId, dbIds }) => {
			o[bimFileId] = dbIds;
			return o;
		}, {});

		const modelList = ModelManager.getInstance().getModelList();
		const list: { model: Autodesk.Viewing.Model; dbIds: number[] }[] = [];

		for (const [modelId, models] of modelList) {
			for (const model of models) {
				const value = { model, dbIds: obj[(model as any).bimFileId] || [] };
				list.push(value);
			}
		}

		return list;
	}

	private _getModel(modelId: string | number, bimFileId: string): Autodesk.Viewing.Model | void {
		const models = ModelManager.getInstance().getModelById(modelId.toString());
		if (!models) return;

		return models.find((model) => (model as any).bimFileId === bimFileId);
	}

	private _allModelsAreLoaded() {
		return ModelManager.getInstance().allModelAreLoaded();
	}
}

function checkdbIds(dbid1: number[], dbid2: number[]): boolean {
	if (dbid1.length !== dbid2.length) return false;
	for (const d1 of dbid1) {
		let found = false;
		for (const d2 of dbid2) {
			if (d1 === d2) {
				found = true;
				break;
			}
		}
		if (found === false) return false;
	}
	return true;
}

function convertHexColorToRGB(hex: string) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
}
