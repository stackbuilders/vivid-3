<template>
  <VCalendar>
    <VCalendarEvent slot="day-0" connotation="accent" appearance="filled" heading="accent" />
    <VCalendarEvent slot="day-1" connotation="cta" appearance="filled" heading="cta" />
    <VCalendarEvent slot="day-2" connotation="success" appearance="filled" heading="success" />
    <VCalendarEvent slot="day-3" connotation="alert" appearance="filled" heading="alert" />
    <VCalendarEvent slot="day-4" connotation="warning" appearance="filled" heading="warning" />
    <VCalendarEvent slot="day-5" connotation="information" appearance="filled" heading="information" />
    <VCalendarEvent slot="day-6" connotation="announcement" appearance="filled" heading="announcement" />
  </VCalendar>
</template>
<script setup lang="ts">
import { VCalendar, VCalendarEvent } from '@vonage/vivid-vue';
</script>
