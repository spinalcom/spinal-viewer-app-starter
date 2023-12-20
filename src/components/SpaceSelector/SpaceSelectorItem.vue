<!--
Copyright 2022 SpinalCom - www.spinalcom.com

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
  <v-list-item
    class="space-selector-list-item card-hover fade"
    :class="{ ['space-selector-list-item-level-' + item.level]: true, 'space-selector-list-item-isopen': item.isOpen && item.haveChildren, 'space-selector-list-item-isSelected': isSelected }"
    :style="{'margin-left': '' + ((item.level - 1) * 20 + 30) + 'px', }"
    @click.stop="onSelect"
  >
    <!-- link to parent template -->
    <template v-if="item.level > 0">
      <div class="space-selector-list-item-angle"></div>
      <div class="space-selector-list-item-angle-extend"></div>
      <div
        class="parent-link"
        v-for="depth in item.level - 1"
        :key="depth"
        v-show="drawParentLink(depth)"
        :style="{ 'margin-left': '-' + (depth * 20 + 11) + 'px' }"
      ></div>
    </template>

    <div class="color-square" :style="{ 'background-color': color }"></div>
    <v-list-item-content style="margin-left: 21px">
      <v-list-item-title v-tooltip="item.name"
        >{{ item.name }}
      </v-list-item-title>
    </v-list-item-content>

    <v-list-item-action class="actionsDiv">

      <v-btn v-if="viewButtonsType === 'advanced'" 
        v-for="(button,index) in spaceSelectorItemButtons" 
        :key="index"
        x-small
        elevation="0" fab
        icon
        style="color: #bfbfbf"
        dark
        :loading="item.loading" 
        :title="button.title"
        @click.stop="onActionClick(button)"
        v-show="display(button)" 
        :disabled="disableBtn(button)">
        <v-icon>{{ button.icon }}</v-icon>
      </v-btn>

      <v-btn
        elevation="0"
        fab
        icon
        style="color: #bfbfbf"
        dark
        :loading="item.loading"
        :disabled="item.loading"
        @click.stop="onOpenClose"
        v-show="item.level != maxDepth"
      >
        <v-icon dark> {{ icon }} </v-icon>
      </v-btn>

    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import { ActionTypes } from "../../interfaces/vuexStoreTypes";
import { Vue, Component, Prop } from 'vue-property-decorator';
import { IButton } from './interfaces/IBuildingItem';
import { ISpaceSelectorItem } from './interfaces/ISpaceSelectorItem';

@Component
class SpaceSelectorItem extends Vue {
  @Prop({ type: Object, required: true }) item: ISpaceSelectorItem;
  @Prop({ type: Number, required: true }) maxDepth: number;
  @Prop({ type: Object, required: true }) selected: ISpaceSelectorItem;
  @Prop({ type: Array<IButton>, required: false, default: () => [] }) spaceSelectorItemButtons!: IButton[];
  @Prop({ type: String, required: false }) viewButtonsType!: string;

  public get isSelected(): boolean {
    return (
      this.item.patrimoineId === this.selected.patrimoineId &&
      this.item.platformId === this.selected.platformId && (this.item.staticId === this.selected?.staticId ||
        this.selected?.parents?.includes(this.item.staticId))
    );
  }


  public get color(): string {
    if (this.item.type === "geographicFloor" && this.isLoaded(this.item)) return "#008000";

    return this.item.color as string
  }

  
  public get icon(): string {
    return this.item?.isOpen ? 'mdi-chevron-down' : 'mdi-chevron-up';
  }

  public isLoaded(item: ISpaceSelectorItem): boolean {
    const id = item.type === "geographicFloor" ? item.dynamicId : (item as any).floorId;
    return !id ? false : this.$store.state.appDataStore.viewerStartedList[id] ? true : false;
  }

  onSelect() {
    if (this.viewButtonsType === 'base') {
      const button = this.getButton();
      if(button) this.$emit("onActionClick", { button, item: this.item });
    }
    this.$emit('onSelect');
  }

  onActionClick(button: IButton) {
    this.$emit("onActionClick", { button, item: this.item });
  }

  display(button: IButton) {
    return !button.isShownTypes || button.isShownTypes.indexOf(this.item.type) !== -1
  }

  onOpenClose() {
    this.$emit('onOpenClose');
  }

  drawParentLink(depth: number) {
    return !this.item.drawLink.includes(depth);
  }

  disableBtn(button: IButton) {
    switch (button.onclickEvent) {
      case ActionTypes.OPEN_VIEWER:
      case ActionTypes.OPEN_VIEWER:
      case ActionTypes.OPEN_VIEWER:
      case "OPEN_VIEWER_PLUS":
        return this.isLoaded(this.item);
    
      case ActionTypes.UNLOAD_MODEL:
      case ActionTypes.FIT_TO_VIEW_ITEMS:
      case ActionTypes.SELECT_ITEMS:
      case ActionTypes.ISOLATE_ITEMS:
        return !this.isLoaded(this.item);
    }
  }

  getButton() {
    if (this.item.type === "building") return;

    if (this.item.type === "geographicFloor")
      return this.spaceSelectorItemButtons.find(el => el.onclickEvent === ActionTypes.OPEN_VIEWER);

    return this.spaceSelectorItemButtons.find(el => el.onclickEvent === ActionTypes.ISOLATE_ITEMS);
  }
}
export default SpaceSelectorItem;
</script>

<style scoped>
.space-selector-list-item {
  display: flex !important;
  margin-right: 10px;
  height: 50px;
  background-color: #14202c;
  border: 1px solid #bfbfbf;
  border-radius: 6px;
  margin-bottom: 0px;
  padding: 0;
  color: rgb(191, 191, 191) !important;
  margin-top: 6px;
}

.space-selector-list-item-angle {
  margin-left: -11px;
  height: 24px;
  background-color: transparent;
  border: 1px solid #4b6079;
  margin-top: -23px;
  width: 10px;
  border-right: none;
  border-top: none;
  position: absolute;
  border-radius: 0 0 0 6px;
  pointer-events: none;
}
.space-selector-list-item.space-selector-list-item-level-0
  + .space-selector-list-item-level-1,
.space-selector-list-item.space-selector-list-item-level-1
  + .space-selector-list-item-level-2,
.space-selector-list-item.space-selector-list-item-level-2
  + .space-selector-list-item-level-3,
.space-selector-list-item.space-selector-list-item-level-3
  + .space-selector-list-item-level-4,
.space-selector-list-item.space-selector-list-item-level-4
  + .space-selector-list-item-level-5,
.space-selector-list-item.space-selector-list-item-level-5
  + .space-selector-list-item-level-6,
.space-selector-list-item.space-selector-list-item-level-6
  + .space-selector-list-item-level-7,
.space-selector-list-item.space-selector-list-item-level-7
  + .space-selector-list-item-level-8 {
  margin-top: -1px;
}

.space-selector-list-item-angle-extend {
  margin-left: -11px;
  height: 50px;
  background-color: transparent;
  border: 1px solid #4b6079;
  border-radius: 6px;
  margin-top: -75px;
  width: 10px;
  border-right: none;
  border-bottom: none;
  border-top: none;
  position: absolute;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 0;
  pointer-events: none;
}

.parent-link {
  height: 65px;
  background-color: transparent;
  border: 1px solid #4b6079;
  border-radius: 6px;
  margin-top: -45px;
  width: 10px;
  border-right: none;
  border-bottom: none;
  border-top: none;
  position: absolute;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 0;
  pointer-events: none;
}
.color-square {
  margin-left: 8px;
  border-radius: 2px;
  display: inline-block;
  position: absolute;
  height: 16px;
  width: 6px;
}

.space-selector-list-item-isSelected {
  background-color: #444;
}

.actionsDiv {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.space-selector-list-item.space-selector-list-item-isopen
  + .space-selector-list-item
  .space-selector-list-item-angle-extend {
  display: none;
}
</style>
