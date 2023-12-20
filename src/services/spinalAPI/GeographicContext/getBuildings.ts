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
import { IGetAllBuildingsRes } from '../../../interfaces/IGetAllBuildingsRes';

export async function getBuildings(patrimoineId: string): Promise<IGetAllBuildingsRes[]> {
  const spinalAPI = SpinalAPI.getInstance();
  // const url = spinalAPI.createUrl(`api/v1/pam/get_all_buildings`);
  const url = spinalAPI.createUrl(`api/v1/pam/get_all_buildings_from_portofolio/${patrimoineId}`);
  const res = await spinalAPI.get<IGetAllBuildingsRes[]>(url);
  
  return res.data;
}


export async function getBuildingById(buildingId: string): Promise<IGetAllBuildingsRes> {
  const spinalAPI = SpinalAPI.getInstance();
  // const url = spinalAPI.createUrl(`api/v1/pam/get_all_buildings`);
  const url = spinalAPI.createUrl(`api/v1/pam/get_building/${buildingId}`);
  const res = await spinalAPI.get<IGetAllBuildingsRes>(url);
  return res.data;
}


