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

import Vue from "vue";

// const vueInstance = new Vue({
//   render: (h) => h(Testbutton),
// });

// // Montez l'instance Vue sur #coucou
// vueInstance.$mount('#coucou');

export async function createSprite(viewer: Autodesk.Viewing.Viewer3D, position: { x: null; y: null; z: null }, data) {
	await viewer.loadExtension("Autodesk.Edit3D");

	// Créez une nouvelle instance de composant avec les données mises à jour
	const vueInstance = new Vue({
		render: (h) => h(Testbutton),
	});

	// Vérifiez si vueInstance.$el est un nœud DOM valide
	if (vueInstance.$el) {
		// Remplacez l'élément racine du composant existant par le nouveau
		vueInstance.$el.parentNode?.replaceChild(vueInstance.$mount().$el, vueInstance.$el);

		// Faites d'autres opérations avec le viewer ou le label selon vos besoins
		const label = new Autodesk.Edit3D.Label3D(viewer, position, data.text);

		// Si nécessaire, ajoutez le nouveau composant au conteneur du label
		// Notez que cela dépend de la structure interne de votre composant
		label.container.appendChild(vueInstance.$mount().$el);
	} else {
		console.error("Erreur : L'élément Vue n'est pas un nœud DOM valide.");
	}
}

import { EmitterViewerHandler, VIEWER_SPRITE_CLICK, VIEWER_SPRITE_MOUSEOVER } from "spinal-viewer-event-manager";

interface ISpriteData {
	color: string;
	position: THREE.Vector3;
	dbId: number;
	modelId: string | number;
	data: any;
	component?: Vue;
}

const baseURL = require("../assets/circle.svg");
const thermo = require("../assets/thermo.png");

export class SpriteManager {
	private DataVizCore;
	private static _instance: SpriteManager;
	private _dataVizExtn: any;
	private _viewableType;
	private dbIdToViewable: { [key: number | string]: any } = {};
	private labels = {};

	private constructor() {}

	public static getInstance(): SpriteManager {
		if (!this._instance) this._instance = new SpriteManager();
		return this._instance;
	}

	get dataVizExtn() {
		return this._dataVizExtn;
	}

	public async loadDataVisualizationExtension(viewer: Autodesk.Viewing.Viewer3D) {
		this._dataVizExtn = await viewer.loadExtension("Autodesk.DataVisualization");
		await viewer.loadExtension("Autodesk.Edit3D");

		// viewer.addEventListener(Autodesk.Viewing.AGGREGATE_ISOLATION_CHANGED_EVENT, (event) => {
		//    this._showOrHideSpritesOnIsolation(event.isolation);
		// })

		if (!this.DataVizCore) {
			this.DataVizCore = Autodesk.DataVisualization.Core;
			this._viewableType = this.DataVizCore.ViewableType.SPRITE;
		}

		viewer.addEventListener(this.DataVizCore.MOUSE_CLICK, this._onSpriteClicked.bind(this));
		viewer.addEventListener(this.DataVizCore.MOUSE_HOVERING, this._onSpriteHovering.bind(this));
	}

	public async addComponentAsSprite(viewer: Autodesk.Viewing.Viewer3D, data: ISpriteData | ISpriteData[]) {
		data = Array.isArray(data) ? data : [data];

		for (const d of data) {
			if (!d.component) continue;

			const VueComponent = Vue.extend(d.component);
			const vueInstance = new VueComponent({ propsData: d });
			const label = new Autodesk.Edit3D.Label3D(viewer, d.position, "");
			label.container.appendChild(vueInstance.$mount().$el);
			// if (vueInstance.$el) {
			// 	vueInstance.$el.parentNode?.replaceChild(vueInstance.$mount().$el, vueInstance.$el);
			// 	const label = new Autodesk.Edit3D.Label3D(viewer, d.position, d.data.displayValue);
			// 	label.container.appendChild(vueInstance.$mount().$el);
			// } else {
			// console.error("Erreur : L'élément Vue n'est pas un nœud DOM valide.");
			// }
		}
	}

	public async createSprite(viewer: Autodesk.Viewing.Viewer3D, data: ISpriteData | ISpriteData[]) {
		const viewableData = new this.DataVizCore.ViewableData();
		viewableData.spriteSize = 24;

		data = Array.isArray(data) ? data : [data];

		for (const item of data) {
			if (!item.position || (item.position.x == null && item.position.y == null && item.position.z == null)) continue;

			const spriteColor = new THREE.Color(item.color);
			const style = new this.DataVizCore.ViewableStyle(this._viewableType, spriteColor, baseURL);

			const viewable = new this.DataVizCore.SpriteViewable(item.position, style, item.dbId);
			viewable.contextData = item.data;

			this.dbIdToViewable[item.dbId] = viewableData;

			this._addSpriteToObject(item.dbId, item.dbId, viewable);
			viewableData.addViewable(viewable);
		}

		await viewableData.finish();
		this._dataVizExtn.addViewables(viewableData);
	}

	public removeSprites() {
		if (this._dataVizExtn) this.dataVizExtn.removeAllViewables();

		// for (const key in this.labels) {
		//    if (Object.prototype.hasOwnProperty.call(this.labels, key)) {
		//       const element = this.labels[key];
		//       element.setVisible(false)
		//    }
		// }
	}

	private _addSpriteToObject(modelId: string | number, dbId: number, viewable: any) {
		if (!this.dbIdToViewable[modelId]) this.dbIdToViewable[modelId] = {};

		this.dbIdToViewable[modelId][dbId] = viewable;
	}

	private _showOrHideSpritesOnIsolation(isolation: { model: Autodesk.Viewing.Model; ids: number[] }[]) {
		// // if(isolation.length === 0) return showAll()
		// const obj = this._converToObject(isolation);
		// for (const modelId in this.dbIdToViewable) {
		//    const element = this.dbIdToViewable[modelId];
		//    const ids = obj[modelId] || [];
		//    for (const dbId in element) {
		//       if (ids.indexOf(dbId as any) === -1) {
		//          console.log(element[dbId]);
		//       }
		//    }
		// }
	}

	private _converToObject(isolation: { model: Autodesk.Viewing.Model; ids: number[] }[]): { [key: string | number]: number[] } {
		return isolation.reduce((obj, { model, ids }) => {
			if (!obj[model.id]) obj[model.id] = [];
			obj[model.id].push(...ids);
			return obj;
		}, {});
	}

	private _onSpriteHovering(event) {
		this._sendSpriteEvent(event.dbId, VIEWER_SPRITE_MOUSEOVER);
	}

	private _onSpriteClicked(event) {
		this._sendSpriteEvent(event.dbId, VIEWER_SPRITE_CLICK);
	}

	private _sendSpriteEvent(dbId: number, eventName: any) {
		const dataviewable = this.dbIdToViewable[dbId];
		if (!dataviewable) return;

		const viewable = dataviewable.viewables.find((v) => v.dbId === dbId);
		if (viewable && viewable.contextData) {
			const emitter = EmitterViewerHandler.getInstance();
			emitter.emit(eventName, {
				pos: viewable.position,
				style: viewable.style,
				img: viewable.style?.url,
				node: viewable.contextData,
			} as any);
		}
	}
}

export default SpriteManager;
