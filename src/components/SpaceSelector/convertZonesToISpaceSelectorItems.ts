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

import type { TGeoItem } from './interfaces/IBuildingItem';
import type { ISpaceSelectorItem } from './interfaces/ISpaceSelectorItem';

export function convertZonesToISpaceSelectorItems(arr: TGeoItem[], parent?: ISpaceSelectorItem): ISpaceSelectorItem[] {
  let drawLink = parent?.drawLink.map((x) => x + 1) || [];
  if (parent?.isLastInGrp === true) drawLink.unshift(1);
  const res = arr.map((item) => {
    let buildingId, patrimoineId;
    const level = parent ? parent.level + 1 : 0;
    const parents = parent ? parent.parents.concat(parent?.staticId) : [];
    if (item.type === 'patrimoine') {
      patrimoineId = parent?.staticId || '';
      buildingId = '';
    } else if (item.type === 'building') {
      patrimoineId = parent?.staticId || '';
      buildingId = item.staticId;
    } else {
      patrimoineId = parent?.patrimoineId || '';
      buildingId = parent?.buildingId || '';
    }
    return createISpaceselectorItem(
      item,
      buildingId,
      patrimoineId,
      level,
      parents,
      drawLink
    );
  });
  if (res.length > 0) {
    if (parent) {
      parent.haveChildren = true;
    }
    res[res.length - 1].isLastInGrp = true;
  }
  return res;
}

export function createISpaceselectorItem(
  item: TGeoItem,
  buildingId: string,
  patrimoineId: string,
  level: number,
  parents: string[],
  drawLink: number[]
): ISpaceSelectorItem {
  return {
    ...item,
    staticId: item.staticId!,
    name: item.name!,
    buildingId,
    patrimoineId,
    level,
    isOpen: false,
    parents,
    categories: item.categories,
    color: item.color,
    dynamicId: item.dynamicId!,
    type: item.type!,
    loading: false,
    isLastInGrp: false,
    drawLink,
    haveChildren: false,
  };
}
