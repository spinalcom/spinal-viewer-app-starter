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

import type { IEquipmentItem, IZoneItem } from "../../../components/SpaceSelector";
import type { IViewInfoItemRes } from "../../../services/spinalAPI/GeographicContext/getViewInfo";
import type { IGetAllBuildingsRes } from "../../../interfaces/IGetAllBuildingsRes";
import { defaultTemporalitySelected, defaultZoneSelected } from "./utils/defaultZoneSelected";
import { INodeItemTree } from "../../../interfaces/INodeItem";

export type StateAppData = typeof state;
export const state = {
	buildings: [] as IGetAllBuildingsRes[],
	zoneSelected: defaultZoneSelected(),
	temporalitySelected: defaultTemporalitySelected(),
	floors: {} as Record<string, IZoneItem[]>,
	rooms: {} as Record<number, IZoneItem[]>,
	roomBimObj: {} as Record<number, IEquipmentItem[]>,
	buildingInfo: {} as Record<number, IViewInfoItemRes[]>,
	viewerStartedList: {} as { [key: string]: string },
	itemSelected: undefined,
	dataVizExtn: undefined,
	data: undefined as any,
};
