<template>
  <div
    class="sprite_container"
    :style="{ background: data.color }"
    @click="onClick"
  ></div>

  <!-- <div>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="indigo" dark v-bind="attrs" v-on="on">
          Menu as Popover
        </v-btn>
      </template>

      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>

          hello world

          <v-btn text @click="menu = false"> Cancel </v-btn>
          <v-btn color="primary" text @click="menu = false"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div> -->
</template> 





<script>
export default {
  props: {
    data: {},
  },
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true,
  }),
  mounted() {},
  methods: {
    onClick() {
      console.log(this.data);
    },
  },
};
</script>

<style scoped>
.sprite_container {
  width: 15px;
  height: 15px;
  border-radius: 100%;
  z-index: 99999;
}
/* 
.sprite_container:hover {
  cursor: pointer;
} */
</style>