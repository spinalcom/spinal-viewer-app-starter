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

import { SpinalAPI } from '../SpinalAPI';
import { getSceneList, sceneDefaut } from '../BIM/sceneDefault';
import { getBIMFileContext } from '../BIM/BIMFileContext';
import { IPlayload } from '../../interfaces/IPlayload';
export interface IViewInfoBody {
  dynamicId: number | number[];
  floorRef?: boolean;
  roomRef?: boolean;
  equipements?: boolean;
}

export interface IViewInfoRes {
  dynamicId: number;
  data: IViewInfoItemRes[];
}

export interface IViewInfoItemRes {
  bimFileId: string;
  dbIds: number[];
}
export interface IViewInfoTmpRes {
  bimFileId: string;
  dbIds: Set<number>;
}

const buildingDefaultScenes = {};

export async function getViewInfo(buildingId: string, options: IViewInfoBody): Promise<IViewInfoRes[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, 'api/v1/geographicContext/viewInfo');
  let result = await spinalAPI.post<IViewInfoRes[]>(url, options);
  return result.data;
}

export function mergeIViewInfoTmpRes(resBody: IViewInfoTmpRes[], bimFileId: string, dbId: number ): void {
  let found = false;
  for (const item of resBody) {
    if (item.bimFileId === bimFileId) {
      found = true;
      item.dbIds.add(dbId);
      break;
    }
  }

  if (found === false) {
    resBody.push({
      bimFileId,
      dbIds: new Set([dbId]),
    });
  }
}

export function mergeIViewInfo(resBody: IViewInfoTmpRes[], sources: IViewInfoItemRes[] ): void {
  for (const source of sources) {
    for (const dbIds of source.dbIds) {
      mergeIViewInfoTmpRes(resBody, source.bimFileId, dbIds);
    }
  }
}


export async function getViewInfoFormatted(buildingId: string, res: IViewInfoTmpRes[], floor: IPlayload) {
  const defaultScene = await getDefaultOrFirstScene(buildingId);

  const models = await getAndFormatModels(buildingId, res, floor.dynamicId as any);
  const data = {
    item: floor,
    buildingId: buildingId,
    loadingType: defaultScene.sceneAlignMethod,
    models
  }

  return data;
}


export async function getAndFormatModels(buildingId: string, res : IViewInfoTmpRes[], floorId: string) {
  const obj = convertViewerInfoToObj(res);
  const bimFiles = await getBIMFileContext(buildingId);
  
  return bimFiles.reduce((list, itm) => {
    const dbids = obj[itm.staticId];
    if (dbids) {
      list.push({
        bimFileId: itm.staticId,
        id: floorId,
        name: itm.name,
        path: getPath(itm),
        aecPath: getAecPath(itm),
        dbids
      })
    }

    return list;
    
  }, [])
}

export async function getDefaultOrFirstScene(buildingId: string) {

  if (!buildingDefaultScenes[buildingId]) {
    const spinalAPi = SpinalAPI.getInstance();
    let def = await sceneDefaut(spinalAPi,buildingId);
    if(!def || Object.keys(def || {}).length === 0) def = await getFirstScene(spinalAPi, buildingId);

    buildingDefaultScenes[buildingId] = def;
  }
    
    return buildingDefaultScenes[buildingId]; 
}


async function getFirstScene(spinalAPi: SpinalAPI, buildingId: string) {
  const sceneList = await getSceneList(spinalAPi, buildingId);
  return sceneList?.scenes[0];
}

// export async function getAndFormatModels(res: IViewInfoTmpRes[]) {
//   return res.map((it: IViewInfoTmpRes) => {
//     console.log(it);
//     return {
//       id: it.bimFileId,
//       dbIds: Array.from(it.dbIds),
//     };
//   });
// }

export function convertViewerInfoToObj(res: IViewInfoTmpRes[]) {
  return res.reduce((obj, item) => {
    obj[item.bimFileId] = item.dbIds;
    return obj;
  }, {})
}

function getPath(itm: any) {
  const path : string = itm.items[0]?.path || "";

  return path.replace("/html/viewerForgeFiles", "");
}

function getAecPath(itm: any) {
  const path : string = itm.items[0]?.aecPath || "";

  return path.replace("/html/viewerForgeFiles", "");
}