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
  <v-card elevation="4" class="cardContainer">
    <div class="dataContainer" v-if="pageSate === PAGE_STATES.loaded">
      <h1>My app will be here !</h1>
    </div>

    <div class="centered" v-else-if="pageSate === PAGE_STATES.loading">
      <v-progress-circular
        :size="70"
        :width="3"
        color="purple"
        indeterminate
      ></v-progress-circular>
    </div>

    <div class="centered" v-else-if="pageSate === PAGE_STATES.error">
      <div>
        <v-icon color="red" style="font-size: 5em"
          >mdi-alert-circle-outline</v-icon
        >
      </div>
      <div color="red">
        Quelque chose s'est mal passé ! Veuillez
        <v-btn small outlined color="red" @click="retry">réessayer </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Prop, Vue } from "vue-property-decorator";
import { PAGE_STATES } from "../../interfaces/pageStates";
import GroupDataView from "./groupDataView.vue";
import Component from "vue-class-component";
import { IConfig } from "../../interfaces/IConfig";
import { ISpaceSelectorItem } from "global-components";

@Component({
  components: {
    GroupDataView,
  },
})
class InsightApp extends Vue {
  @Prop() config!: IConfig;
  @Prop() selectedZone: ISpaceSelectorItem;
  @Prop() data: any[];

  PAGE_STATES: typeof PAGE_STATES = PAGE_STATES;
  pageSate: PAGE_STATES = PAGE_STATES.loading;
  isBuildingSelected: boolean = true;

  async mounted() {
    this.pageSate = PAGE_STATES.loaded;
  }

  retry() {}
}

export { InsightApp };
export default InsightApp;
</script>
<style lang="scss">
.cardContainer {
  width: 100%;
  height: 100%;

  $titleDateHeight: 40px;
  $gradientContentHeight: 40px;
  $calculContentHeight: 50px;
  $selectionHeight: 60px;

  .dataContainer {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    padding: 10px;
    .detail_header {
      width: 100%;
      height: #{$titleDateHeight + $gradientContentHeight + $calculContentHeight +
        $selectionHeight};
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title_date {
        width: 100%;
        height: $titleDateHeight;
        display: flex;
        align-items: center;
        justify-content: space-between;
        ._title {
          max-width: 50%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-transform: uppercase;
          font-size: 0.8em;
        }

        .date {
        }
      }

      .source_regroupement_select {
        width: 100%;
        height: $selectionHeight;
        display: flex;
        align-items: center;
      }

      .gradient_content {
        width: 100%;
        height: $gradientContentHeight;
        .gradient_bar {
          width: 100%;
          height: 15px;
          border-radius: 5px;
        }

        .indicators {
          width: 100%;
          height: 15px;
          font-size: 11px;
          display: flex;
          justify-content: space-between;
        }
      }

      .calcul_content {
        width: 100%;
        height: $calculContentHeight;
        .calcul {
          width: 100%;
          height: 30px;
          display: flex;
          .select {
            width: 35%;
            min-height: unset;
            margin-right: 50px;
          }

          .calculResult {
            display: flex;
            align-items: center;
            font-size: 13px;
            .value {
              margin-right: 1px;
              font-weight: 900;
            }

            .text {
              margin-left: 2px;
            }
          }
        }

        .color {
          width: 8px;
          height: 15px;
          margin-right: 5px;
          border-radius: 3px;
        }
      }
    }

    .detail_container {
      width: 100%;
      height: calc(
        100% - #{$titleDateHeight + $gradientContentHeight +
          $calculContentHeight + $selectionHeight}
      );
      overflow: auto;
      scroll-behavior: smooth;
    }
  }

  .centered {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}
</style>