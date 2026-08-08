<script setup lang="ts">
import { onMounted } from 'vue'

import CourseBuilderWizard from '@/components/course-builder/CourseBuilderWizard.vue'
import { useCourseBuilder } from '@/hooks/useCourseBuilder'

const builder = useCourseBuilder()

onMounted(() => {
  builder.load()
})
</script>

<template>
  <CourseBuilderWizard :builder="builder" />
</template>
