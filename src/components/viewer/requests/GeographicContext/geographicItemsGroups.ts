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

import { INodeItem } from "../../../../interfaces/INodeItem";
import { SpinalAPI } from "../SpinalAPI";

const types = ["geographicFloor", "geographicRoom", "BIMObject"];

export async function getGeographicItemsGroups(buildingId: string): Promise<{ [key: string]: INodeItem }> {
	const contexts = await getAllGeographicGroups(buildingId);
	const trees = contexts.map(async ({ dynamicId, type }) => ({ type: type.replace("GroupContext", ""), data: await getGroupTree(buildingId, dynamicId) }));

	return Promise.all(trees).then((result) => {
		return {};
	});
}

async function getAllGeographicGroups(buildingId: string): Promise<INodeItem[]> {
	const spinalAPI = SpinalAPI.getInstance();
	const url = spinalAPI.createUrlWithPlatformId(buildingId, "/api/v1/groupContext/list");
	let result = await spinalAPI.get<INodeItem[]>(url);
	return result.data.filter((el) => {
		const found = types.find((type) => `${type}GroupContext` === el.type);
		return found ? true : false;
	});
}

async function getGroupTree(buildingId: string, dynamicId: number): Promise<{ any }> {
	const spinalAPI = SpinalAPI.getInstance();
	const url = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/groupContext/${dynamicId}/tree`);
	let result = await spinalAPI.get<{ [key: string]: any[] }>(url);
	const categories = result.data.children || [];
	const groups = categories.reduce((liste, categorie) => {
		liste.push(...(categorie.children || []));
		return liste;
	}, []);

	return groups.reduce((obj, group) => {
		obj[group.staticId] = {
			...group,
			children: group.children.reduce((temObj, child) => {
				temObj[child.staticId] = child;
				return temObj;
			}, {}),
		};

		return obj;
	}, {});
}
