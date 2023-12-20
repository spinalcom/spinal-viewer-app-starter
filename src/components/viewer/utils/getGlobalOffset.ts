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

import { getDefaultOrFirstScene } from "../requests/GeographicContext/getViewInfo";
import { getAecModelData } from "./getAecModelData";

let globalOffset: THREE.Vector3;

export async function getGlobalOffset(viewer: Autodesk.Viewing.Viewer3D, buildingId: string): Promise<THREE.Vector3> {
	if (!globalOffset) {
		const scene = await getDefaultOrFirstScene(buildingId);
		const firstBim = (scene?.scenesItems || [])[0];

		if (!firstBim || !firstBim.aecPath) {
			globalOffset = viewer.model?.getData().globalOffset;
			return globalOffset;
		}

		const aecModelData = await getAecModelData(firstBim.aecPath);
		if (!aecModelData) {
			globalOffset = viewer.model?.getData().globalOffset;
			return globalOffset;
		}

		const tf = aecModelData && aecModelData.refPointTransformation;
		globalOffset = tf ? new THREE.Vector3(tf[9], tf[10], 0) : new THREE.Vector3(0, 0, 0);
	}

	return globalOffset;
}
