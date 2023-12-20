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

// import SpriteManager from "../manager/spriteManager";
// const baseURL = require("../assets/circle.svg");




// export async function createSprite(viewer: Autodesk.Viewing.Viewer3D, data: ISpriteData[]) {

//    const DataVizCore = Autodesk.DataVisualization.Core;
//    const viewableType = DataVizCore.ViewableType.SPRITE;

//    const viewableData = new DataVizCore.ViewableData();
//    viewableData.spriteSize = 20;

//    data.forEach((item) => {
//       const spriteColor = new THREE.Color(item.color);
//       const style = new DataVizCore.ViewableStyle(viewableType, spriteColor, baseURL);
//       console.log(spriteColor, item.position, item.dbId)
      
//       const viewable = new DataVizCore.SpriteViewable(item.position, style, item.dbId);
//       viewableData.addViewable(viewable);
//    })
   
//    await viewableData.finish();
//    SpriteManager.getInstance().dataVizExtn.addViewables(viewableData);
// }