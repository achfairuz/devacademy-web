<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    images: string[]
    alt?: string
  }>(),
  {
    alt: '',
  },
)

const activeIndex = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const deltaX = ref(0)

const visible = computed(() => {
  const n = props.images.length
  const offsets = [-2, -1, 0, 1, 2]
  return offsets.map((offset) => ({
    index: (activeIndex.value + offset + n) % n,
    offset,
  }))
})

const sizeClass = (offset: number) => {
  switch (Math.abs(offset)) {
    case 2:
      return 'w-20 h-16 sm:w-32 sm:h-24 lg:w-40 lg:h-32 opacity-40 scale-90'
    case 1:
      return 'w-20 h-16 sm:w-44 sm:h-32 lg:w-56 lg:h-44 opacity-70 scale-95'
    default:
      return 'w-48 h-36 sm:w-64 sm:h-48 lg:w-80 lg:h-60 opacity-100 scale-105 shadow-lg border-primary animate-pop'
  }
}

function prev() {
  activeIndex.value = (activeIndex.value - 1 + props.images.length) % props.images.length
}

function next() {
  activeIndex.value = (activeIndex.value + 1) % props.images.length
}

function onPointerDown(e: PointerEvent) {
  isDragging.value = true
  startX.value = e.clientX
  deltaX.value = 0
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  deltaX.value = e.clientX - startX.value
}

function onPointerUp() {
  if (!isDragging.value) return
  isDragging.value = false
  if (deltaX.value < -40) next()
  else if (deltaX.value > 40) prev()
  deltaX.value = 0
}
</script>

<template>
  <div class="w-full">
    <div
      class="flex items-center justify-center gap-2 sm:gap-4 py-4 select-none cursor-grab active:cursor-grabbing"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointerleave="onPointerUp"
    >
      <img
        v-for="item in visible"
        :key="item.offset === 0 ? `center-${activeIndex}` : `${item.index}-${item.offset}`"
        :src="images[item.index]"
        :alt="alt"
        class="rounded-xl object-cover border-2 transition-all duration-300"
        :class="[
          item.offset === 0
            ? 'border-primary'
            : 'border-border cursor-pointer hover:scale-100',
          Math.abs(item.offset) === 2 ? 'hidden sm:block' : '',
          sizeClass(item.offset),
        ]"
        @click="item.offset === 0 ? next() : (activeIndex = item.index)"
      />
    </div>

    <div class="flex justify-center items-center gap-6 mt-6">
      <button
        class="w-10 h-10 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 active:scale-95 transition-all"
        aria-label="Previous"
        @click="prev"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
      <button
        class="w-10 h-10 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 active:scale-95 transition-all"
        aria-label="Next"
        @click="next"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes pop {
  0% {
    transform: scale(0.9);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.05);
    opacity: 1;
  }
}

.animate-pop {
  animation: pop 0.4s ease-out;
}
</style>
