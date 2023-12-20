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

import {
  IDbIdModelAggregate,
  IContextMenuGroup,
  EmitterViewerHandler,
  // AGGREGATE_SELECTION_CHANGED_EVENT,
  VIEWER_CONTEXT_MENU_CLICK,
  VIEWER_OBJ_FIT_TO_VIEW,
  VIEWER_OBJ_ISOLATE,
} from 'spinal-viewer-event-manager';

export function setUpContextMenu(emitter: EmitterViewerHandler) {
  // emitter.on(
  //   AGGREGATE_SELECTION_CHANGED_EVENT,
  //   (newSelect?: IDbIdModelAggregate[]) => {
  //     if (!newSelect || newSelect.length === 0) {
  //       emitter.emit('viewer set contextmenu', []);
  //     } else {
  //       const viewerAction: IContextMenuGroup = {
  //         label: '3D action',
  //         opened: false,
  //         icon: 'mdi-floor-plan',
  //         children: [
  //           {
  //             label: 'isolate',
  //             icon: 'mdi-select-all',
  //           },
  //           {
  //             label: 'fit to view',
  //             icon: 'mdi-magnify-plus-outline',
  //           },
  //         ],
  //       };

  //       emitter.emit('viewer set contextmenu', [viewerAction]);
  //     }
  //   }
  // );
  emitter.on(VIEWER_CONTEXT_MENU_CLICK, (data) => {
    switch (data?.button.label) {
      case 'isolate':
        emitter.emit(VIEWER_OBJ_ISOLATE, data.selection);
        break;
      case 'fit to view':
        emitter.emit(VIEWER_OBJ_FIT_TO_VIEW, data.selection);
        break;
    }
  });
}
