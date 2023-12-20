<!--
Copyright 2023 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
   <div class="dataView" :id="item.dynamicId" :class="{'subItem': !isTitle, 'isSelected' : isSelected()}" @click="clickEvent">
      <div class="value_div">
         <div class="color" :style="{background: color}"></div>
         <div class="value" style="margin-right: 1px;">{{ item.displayValue | round }}</div>
         <div>{{ unit }}</div>
      </div>
      <div class="name">{{ item.name }}</div>
   </div>
</template>

<script>

export default {
   name: "dataView",
   props: {
      item: {},
      isTitle: { type: Boolean, default: () => false },
      color: {type: String, default: () => ""},
      unit: {type: String, default: () => ""},
   },
   filters: {
      round(value) {
         try {
            if (typeof value === "string" && value.length === 0) return "";
            var num = Number(value);
            var rounded = num.toFixed(2);
            return Number(rounded)
         } catch (error) {
            console.error(error);
            return ""
         }
      }
   },
   methods: {
      clickEvent() {
         this.$emit("onClick")
      },

      isSelected() {
         const itemSelected = this.$store.state.appDataStore.itemSelected;
         return itemSelected && itemSelected.dynamicId == this.item.dynamicId
      }
   },
}
</script>

<style>
   .dataView {
      width: 100%;
      height: 20px;
      margin-bottom: 3px;
      display: flex;
      align-items: flex-end;
      font-size: 12px;
      font-weight: 520;
      color: #798e98;
      border-radius: 5px;
   }

   .dataView.subItem {
      background-color: #eaeef0;
   }

   .dataView.subItem:hover {
      cursor: pointer;
   }

   .dataView.subItem.isSelected {
      border: 2px solid rgb(0, 116, 255);
      /* background-color: rgb(0, 116, 255) */
   }

   .dataView .value_div {
      width: 25%;
      height: 100%;
      display: flex;
      padding: 0 10px;
      align-items: center;
   }

   .dataView .value_div .color {
      width: 7px;
      height: 70%;
      margin-right: 4px;
      border-radius: 3px;
   }


   .dataView .name {
      width: 75%;
      max-width: 75%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
   }
   

   
</style>