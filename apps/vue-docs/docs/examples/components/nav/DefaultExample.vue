<template>
  <VNav>
    <VNavItem
      href="#"
      text="1st level item"
      :aria-current="selectedItem === 1 ? 'page' : undefined"
      @click.prevent="selectedItem = 1"
    />
    <VNavItem
      href="#"
      text="1st level item"
      :aria-current="selectedItem === 2 ? 'page' : undefined"
      @click.prevent="selectedItem = 2"
    />
    <VNavItem
      href="#"
      text="1st level item"
      :aria-current="selectedItem === 3 ? 'page' : undefined"
      @click.prevent="selectedItem = 3"
    />
  </VNav>
</template>

<script setup lang="ts">
import { VNav, VNavItem } from '@vonage/vivid-vue';
import { ref } from 'vue';

const selectedItem = ref(1);
</script>
