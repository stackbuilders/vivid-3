<template>
  <div style="height: 230px">
    <VDialog ref="dialog" headline="Open Dialog">
      <template #main>
        <form method="dialog">
          <VButton type="submit" label="Submit" />
        </form>
      </template>
    </VDialog>
    <VButton label="Open Modal Dialog" @click="openDialog" />
  </div>
</template>

<script setup lang="ts">
import { VButton, VDialog } from '@vonage/vivid-vue';
import { ref } from 'vue';

const dialog = ref<VDialog>(null);

function openDialog() {
  dialog.value.showModal();
}
</script>
