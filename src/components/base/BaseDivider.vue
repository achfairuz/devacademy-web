<template>
  <div class="flex items-center gap-3">
    <span class="h-px flex-1 bg-border"></span>
    <span v-if="$slots.default" class="text-xs uppercase tracking-wide text-text-soft">
      <slot />
    </span>
    <span v-if="$slots.default" class="h-px flex-1 bg-border"></span>
  </div>
</template>
