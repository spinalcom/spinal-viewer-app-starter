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

import { IConfig, ITemporality, calculTypes } from "./interfaces/IConfig";

export const config: IConfig = {
	// entryPoint: { context: "Contexte équipement capteur", category: "Ubigreen", group: "All" },
	// source: { name: "Ubigreen", profileName: "Ubigreen", type: "controlPoint", objectType: "equipments", unit : "" },
	entryPoint: {
		context: "Intégration équipements communicants",
		category: "Multicapteurs",
		group: "Avec convention de nommage",
	},
	source: {
		name: "Température",
		profileName: "KPI",
		type: "controlPoint",
		objectType: "equipments",
		unit: "°C",
	},

	viewButtons: "base",
	title: "Le titre de mon app",
	calculs: [calculTypes.Maximum, calculTypes.Minimum, calculTypes.Moyenne, calculTypes.Somme, calculTypes.MoyennePercent],
	sprites: true,
	viewerInfo: { roomRef: true, floorRef: true, equipments: "none" },
	legend: {
		min: { value: 0, color: "#0074FF" },
		median: { value: 15, color: "#FFFF00" },
		max: { value: 30, color: "#FF004B" },
	},
	regroupement: ["rooms", "floors"],
	temporality: [ITemporality.currentValue, ITemporality.day, ITemporality.week, ITemporality.month, ITemporality.year],
};

// export const config: IConfig = {
//    viewButtons: "base",
//    title: "Le titre de mon app",
//    calculs : [calculTypes.Maximum, calculTypes.Minimum, calculTypes.Moyenne, calculTypes.Somme],
//    sprites: true,
//    legend: {
//       min: { value: 15, color: "#0074FF" },
//       median: { value: 27.5, color: "#FFFF00" },
//       max: {value: 40, color: "#FF004B"}
//    },
// 	  temporality: [ITemporality.currentValue, ITemporality.day, ITemporality.week, ITemporality.month, ITemporality.year],

//    //////////////////////////////
//    source: { name: "Température", profileName: "Multicapteurs", type: "controlPoint", objectType: "equipments", unit : "°C" },
//    entryPoint: { context : "Gestion des équipements", category : "Typologie", group: "Multicapteurs" },
//    regroupement: { context: "Gestion des équipements", category: "Typologie" },
//    viewerInfo: {roomRef: true, floorRef: true, equipments: "none"},

//    // source: { name: "Température", profileName: "Control Point", type: "controlPoint", objectType: "equipments", unit : "°C" },
//    // entryPoint: { context : "Gestion des espaces", category : "Typologie", group: "Bureaux" },
//    // regroupement: {context: "Gestion des espaces", category : "Affectation par service"}

// }
