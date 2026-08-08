<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import CourseBuilderWizard from '@/components/course-builder/CourseBuilderWizard.vue'
import { useCourseBuilder } from '@/hooks/useCourseBuilder'

const route = useRoute()

const builder = useCourseBuilder({ courseId: typeof route.params.id === 'string' ? route.params.id : undefined })

onMounted(() => {
  builder.load()
})
</script>

<template>
  <CourseBuilderWizard :builder="builder" />
</template>
