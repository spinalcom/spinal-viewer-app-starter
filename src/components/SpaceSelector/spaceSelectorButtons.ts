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

import { IButton } from "../../interfaces/IConfig";
import { ActionTypes } from "../../interfaces/vuexStoreTypes";
import { config } from "../../config";

const spaceSelectorButtons: { [key: string]: IButton } = {
  load: {
    title: "charger",
    icon: "mdi-video-3d",
    onclickEvent: ActionTypes.OPEN_VIEWER,
    isShownTypes: ["geographicFloor"],
  },

  load_plus: {
    title: "charger en plus",
    icon: "mdi-rotate-3d",
    onclickEvent: <any>"OPEN_VIEWER_PLUS",
    isShownTypes: ["geographicFloor"],
  },

  unload: {
    title: "decharger",
    icon: "mdi-video-3d-off",
    onclickEvent: ActionTypes.UNLOAD_MODEL,
    isShownTypes: ["geographicFloor"],
  },

  fitToView: {
    title: "Zoomer",
    icon: "mdi-fit-to-screen-outline",
    onclickEvent: ActionTypes.FIT_TO_VIEW_ITEMS,
    isShownTypes: ["geographicRoom"],
  },

  select: {
    title: "selectionner",
    icon: "mdi-selection",
    onclickEvent: ActionTypes.SELECT_ITEMS,
    isShownTypes: ["geographicRoom"],
  },
  isolate: {
    title: "isoler",
    icon: "mdi-target",
    onclickEvent: ActionTypes.ISOLATE_ITEMS,
    isShownTypes: ["geographicRoom"],
  },
};

export const ViewerButtons: { [key: string]: IButton[] } = {
  base: [
    spaceSelectorButtons.load,
    spaceSelectorButtons.unload,
    spaceSelectorButtons.isolate,
  ],
  advanced: Object.values(spaceSelectorButtons),
};
