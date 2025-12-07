<script setup lang="ts">
import { computed } from "vue";

interface Props {
  title?: string;
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Your game has already started",
  message:
    "Adjusting game conditions will force reset this game if Save Changes is pressed.",
});

const formattedMessage = computed(() => {
  return props.message.replace("Save Changes", "<strong>Save Changes</strong>");
});
</script>

<template>
  <div
    class="box-border w-full border-l-2 border-amber-600 bg-linear-to-r from-amber-50 to-transparent px-5 py-3"
  >
    <div class="flex flex-col gap-2">
      <div
        class="m-0 p-0 font-titillium text-base leading-normal font-bold text-amber-600"
      >
        {{ title }}
      </div>
      <div
        class="m-0 p-0 font-titillium text-sm leading-normal font-normal text-slate-600 [&_strong]:font-bold"
        v-html="formattedMessage"
      />
    </div>
  </div>
</template>
