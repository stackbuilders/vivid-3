<template>
  <VCalendar>
    <VCalendarEvent slot="day-0" connotation="accent" appearance="subtle" heading="accent" />
    <VCalendarEvent slot="day-1" connotation="cta" appearance="subtle" heading="cta" />
    <VCalendarEvent slot="day-2" connotation="success" appearance="subtle" heading="success" />
    <VCalendarEvent slot="day-3" connotation="alert" appearance="subtle" heading="alert" />
    <VCalendarEvent slot="day-4" connotation="warning" appearance="subtle" heading="warning" />
    <VCalendarEvent slot="day-5" connotation="information" appearance="subtle" heading="information" />
    <VCalendarEvent slot="day-6" connotation="announcement" appearance="subtle" heading="announcement" />
  </VCalendar>
</template>
<script setup lang="ts">
import { VCalendar, VCalendarEvent } from '@vonage/vivid-vue';
</script>
