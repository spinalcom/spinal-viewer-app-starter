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

<script lang="ts">
import { ViewerManager, EventManager } from "./manager";
import { Vue, Component } from "vue-property-decorator";

@Component
class viewerApp extends Vue {
  stopEventListener: () => void;

  async mounted() {
    const div = <HTMLElement>this.$refs.viewerDiv;
    const view = await ViewerManager.getInstance().initViewer(div);
    this.stopEventListener = await EventManager.getInstance().listenAllEvents(
      view
    );
  }

  beforeDestroy() {
    if (this.stopEventListener) this.stopEventListener();
  }
}

export default viewerApp;
export { viewerApp };
</script>

<template>
  <div ref="viewerDiv" class="viewer-div-container"></div>
</template>

<style>
.viewer-div-container > .adsk-viewing-viewer {
  background: none !important;
  position: relative;
}

.adsk-viewing-viewer .canvas-wrap div {
  pointer-events: auto;
}

/* #guiviewer3d-toolbar {
  display: none;
} */
</style>
