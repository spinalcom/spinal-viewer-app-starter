/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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

// const asset2 = require("../../assets/sprites/icon.svg");
// const asset = require("../../assets/sprites/circle.svg");
// const asset3 = require("../../assets/sprites/fan_coil.svg");
// const asset4 = require("../../assets/sprites/icon.png");
// const assetText = require("../../assets/sprites/textv2.svg");
const thermo = require("../assets/thermo2.jpg")


import { EventBus } from "../events";

export async function createSprite(viewer: Autodesk.Viewing.Viewer3D ,position: THREE.Vector3, data : {text: string, color: string}) {

  await viewer.loadExtension('Autodesk.Edit3D');

  let txt = data.text.toString();

  const label = new Autodesk.Edit3D.Label3D(viewer, position, txt);
  let img = document.createElement("img");

  ////////////////////////// STYLES /////////////////////
  label.container.childNodes[0].style.borderStyle = "solid";
  label.container.childNodes[0].style.borderWidth = "3px";
  label.container.childNodes[0].style.backgroundColor = "#f9f9f9";
  label.container.childNodes[0].style.borderColor = "#f9f9f9";
  label.container.childNodes[0].style.borderRadius = "100px";
  label.container.childNodes[0].style.color = "#14202C";
  // label.container.childNodes[0].style.color = data.color;

  label.container.childNodes[0].style["z-index"] = 1;
  label.container.style.display = "flex";
  label.container.style.pointerEvents = 'auto';
  label.container.style.background = 'none';
  label.container.style.alignItems = 'center';
  label.container.style.height = 'fit-content';
  label.container.style.padding = '0px';
  label.container.style.color = 'transparent';
  label.container.style["box-shadow"] = 'none';

  img.style.height = "20px";
  img.style.width = "20px";
  img.style.borderStyle = "solid";
  img.style.borderWidth = "3px";
  img.style.backgroundColor = data.color;
  img.style.borderColor = "#f9f9f9";

  img.style["z-index"] = 2;
  img.style["-moz-border-radius"] = "75px";
  img.style["-webkit-border-radius"] = "75px";
  img.style["border-radius"] = "75px";


  label.container.childNodes[0].style.marginLeft = "-15px";
  label.container.childNodes[0].style.paddingLeft = "15px";
  label.container.childNodes[0].style.paddingRight = "5px";
  label.container.childNodes[0].style.marginRight = "0px";
  label.container.childNodes[0].style.height = "15px";
  label.container.childNodes[0].style.fontSize = "15px";
  img.style["margin-left"] = "5px;"
  label.container.childNodes[0].style.display = (typeof data.text == "boolean" || typeof data.text == "string") ? "none":"";


  label.container.insertBefore(img, label.container.childNodes[0]);

  // EventBus.$on("sprite-clicked", (res) => {
  //   if (data.node == res) {
  //     if (data.text.type == "boolean" || data.text.type == "string") {
  //       label.container.childNodes[0].style.boxShadow = "0px 0px 15px 3px #00A2FF";
  //     }
  //     else {
  //       label.container.childNodes[0].style.border = "3px solid #00A2FF";
  //       label.container.childNodes[1].style.border = "3px solid #00A2FF";
  //       label.container.childNodes[1].style.boxShadow = "0px 0px 15px 3px #00A2FF";
  //     }
  //   }
  //   else {
  //     if (data.text.type == "boolean" || data.text.type == "string") {
  //       label.container.childNodes[0].style.boxShadow = "";
  //     }
  //     else {
  //       label.container.childNodes[0].style.borderColor = "#f9f9f9";
  //       label.container.childNodes[1].style.borderColor = "#f9f9f9";
  //       label.container.childNodes[1].style.boxShadow = "";
  //     }
  //   }
  // });
  // EventBus.$on("remove-sprites", () => {
  //   label.dtor();
  //   return true;
  // });
  // EventBus.$on("update-sprite", res => {
  //   if (res.node == data.node) {
  //     label.container.childNodes[0].style.backgroundColor = res.color;
  //     if (res.text.type == "boolean" || res.text.type == "string") {
  //       label.container.childNodes[1].style.display = "none";
  //     }
  //     else {
  //       label.textDiv.textContent = res.text.value;
  //       // label.container.childNodes[0].style.backgroundColor = res.color;
  //       label.container.childNodes[1].style.display = "";
  //     }
  //   }
  // })
  // label.container.addEventListener('click', async (res) => {
  //   EventBus.$emit("sprite-clicked", data.node);
  //   viewer.clearSelection()
  //   // res.stopPropagation();

  // });
}