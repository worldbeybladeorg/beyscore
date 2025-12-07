<script setup lang="ts">
import { AlertTriangle, Trophy } from "lucide-vue-next";

type ResponseChipVariant = "warning" | "p1Winner" | "p2Winner";

interface Props {
  variant?: ResponseChipVariant;
}

withDefaults(defineProps<Props>(), {
  variant: "warning",
});
</script>

<template>
  <div
    class="box-border flex items-center justify-start gap-2 rounded-full bg-white px-3 py-1.5 shadow-[0_2px_8px_rgba(3,7,18,0.05)] [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0"
  >
    <AlertTriangle
      v-if="variant === 'warning'"
      :size="16"
      color="#F59E0B"
      :stroke-width="2"
    />
    <Trophy
      v-if="variant === 'p1Winner' || variant === 'p2Winner'"
      :size="16"
      :color="variant === 'p1Winner' ? '#1088C9' : '#FF5555'"
      :stroke-width="2"
    />
    <span class="shrink-0 font-titillium text-sm font-bold text-slate-600">
      {{ variant === "warning" ? "Warning" : "Winner" }}
    </span>
  </div>
</template>
