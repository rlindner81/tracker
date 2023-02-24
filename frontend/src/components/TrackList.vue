<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { useStepStore } from "@/store/step";
import { useCommonStore } from "@/store/common";
import { computed } from "vue";
// import { observeAuthChanges } from "@/firebase/auth";
// import { he } from "vuetify/locale";

const commonStore = useCommonStore();
const userStore = useUserStore();
const stepStore = useStepStore();

const headers = computed(() => {
  let headers: any = [];
  if (stepStore.stepsDisplayRows.length) {
    stepStore.stepsDisplayRows[0].values.forEach((column) => {
      const header = {
        title: column.label,
        align: "start",
        sortable: true,
        key: column.label,
      };
      headers.push(header);
    });
    headers.push({
      title: "Tracked By",
      align: "start",
      sortable: true,
      key: "postedBy",
    });
    headers.push({
      title: "Tracked On",
      align: "start",
      sortable: true,
      key: "postedAt",
    });
  }
  return headers;
});

const rows = computed(() => {
  let rows: any = [];
  if (stepStore.stepsDisplayRows.length) {
    for (const { values, meta } of stepStore.stepsDisplayRows) {
      const row = values.reduce((result, column) => {
        result[column.label] = column.value;
        return result;
      }, {});
      row["postedBy"] = userStore.emailById(meta.postedBy);
      row["postedAt"] = meta.postedAt;
      rows.push(row);
    }
  }
  return rows;
});
</script>

<template>
  <v-data-table
    :v-if="rows.length"
    items-per-page="20"
    :headers="headers"
    :items="rows"
    item-value="name"
    class="elevation-1"
  />

  <!--  <div class="component track-list steps" v-if="stepStore.stepsDisplayRows && stepStore.stepsDisplayRows.length > 0">-->
  <!--    <div class="step" v-for="({ values, meta }, rowIndex) in stepStore.stepsDisplayRows" :key="rowIndex">-->
  <!--      <div class="posted" :class="{ other: meta.postedBy !== commonStore.userId }">-->
  <!--        {{ userStore.emailById(meta.postedBy) || meta.postedBy }} | {{ meta.postedAt }}-->
  <!--      </div>-->
  <!--      <div class="values">-->
  <!--        <div class="value" v-for="({ label, value }, valuesIndex) in values" :key="valuesIndex">-->
  <!--          <label>{{ label }}</label>-->
  <!--          <span>{{ value }}</span>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<style></style>
