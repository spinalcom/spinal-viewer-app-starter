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

import { getAecModelData } from './getAecModelData';
import { getGlobalOffset } from './getGlobalOffset';

export async function addOffsetFromAEC(aecPath: string, viewer: Autodesk.Viewing.Viewer3D, buildingId: string): Promise<THREE.Vector3> {
  const globalOffset = await getGlobalOffset(viewer, buildingId);
  const aecModelData = await getAecModelData(aecPath);  // recuperer l'aecData de la première maquette de la scene 1 (scene par default)
  if (aecModelData) {
    const tf = aecModelData && aecModelData.refPointTransformation;
    const refPoint = tf ? { x: tf[9], y: tf[10], z: 0 } : { x: 0, y: 0, z: 0 };
    const MaxDistSqr = 4.0e6;
    const distSqr =
      globalOffset &&
      THREE.Vector3.prototype.distanceToSquared.call(refPoint, globalOffset);
    if (distSqr && (!globalOffset || distSqr > MaxDistSqr)) {
      // @ts-ignore
      return new THREE.Vector3().copy(refPoint);
    }
  }
  
  return globalOffset;
}
