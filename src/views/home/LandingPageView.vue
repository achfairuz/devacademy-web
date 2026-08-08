<script setup lang="ts">
import FeatureCard from '@/components/home/FeatureCard.vue'
import ProgramsCard from '@/components/home/ProgramsCard.vue'
import TestimonialCard from '@/components/home/TestimonialCard.vue'
import ImageCarousel from '@/components/common/ImageCarousel.vue'
import { carouselImages, features, programs, testimonials } from '@/constants/home'
</script>

<template>
  <!-- <div v-if="isAuthenticated && user" class="flex flex-col gap-8">
    
  </div> -->

  <section class="gap-4 py-12 px-6 md:px-12 lg:px-24 max-w-full bg-gray-200 w-full">
    <div
      class="flex flex-col gap-4 items-center md:flex-row md:items-start md:justify-center md:gap-12 max-w-6xl mx-auto"
    >
      <div>
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-heading mb-4 text-center sm:text-left">
          Platform belajar online untuk
          <span class="text-primary-400">meningkatkan keterampilan Anda</span>. Masuk untuk
          mengakses kursus dan dashboard pribadi.
        </h1>
        <p class="text-text-soft text-center sm:text-left">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit aliquid quidem sit
          voluptatum debitis perspiciatis.
        </p>

        <div
          class="flex flex-col sm:flex-row sm:justify-start sm:items-center sm:py-4 sm:px-8 mt-4 border-l-0 sm:border-l-4 border-primary sm:gap-16 gap-4"
        >
          <div class="">
            <p class="text-gray-400">Trusted by</p>
            <p class="font-semibold text-xl">500+ Parents</p>
          </div>
          <div>
            <p class="text-gray-400">With offer</p>
            <p class="font-semibold text-xl">25+ Lorem ipsum dolor sit amet</p>
          </div>
        </div>
      </div>

      <img
        src="https://placehold.co/600x600/EEE/31343C"
        alt="bg"
        class="border border-primary rounded-2xl w-full max-w-xs sm:max-w-sm lg:max-w-md relative z-10"
      />
    </div>
  </section>

  <section
    class="max-w-7xl mx-auto py-12 flex flex-col md:flex-row items-center border-y-2 mt-20 gap-10 md:gap-20 px-6"
  >
    <FeatureCard v-for="feature in features" :key="feature.title" v-bind="feature" />
  </section>

  <section id="about" class="max-w-7xl mx-auto py-12 flex flex-col gap-8">
    <div class="flex flex-col lg:flex-row justify-center mx-auto w-full gap-10 lg:gap-20 px-6">
      <div class="relative max-w-md lg:max-w-xl w-full aspect-[3/4] border border-primary">
        <img
          src="https://placehold.co/600x700/EEE/31343C"
          alt="bg"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute bg-primary text-white p-4 top-3/4 right-2 lg:-right-8 max-w-[15rem] lg:max-w-xs rounded-lg shadow-xl shadow-primary/50"
        >
          <p class="text-sm uppercase tracking-widest text-white/80 mb-1">About</p>
          <h1 class="text-lg lg:text-2xl font-semibold leading-snug">
            Unleash Students Possibilities with us
          </h1>
        </div>
      </div>
      <div class="flex flex-col max-w-xl text-justify">
        <h3 class="text-xl font-normal text-primary mb-2">Welcome to</h3>
        <h1 class="text-2xl lg:text-3xl font-semibold mb-4">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi et modi laborum mollitia
          nemo ipsa quisquam recusandae culpa ut totam obcaecati, necessitatibus iste alias velit
          itaque veniam, vitae repellendus laboriosam. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Corporis, eaque! Similique, veritatis enim veniam iusto excepturi
          molestiae quisquam sit sint, consequatur ullam voluptas, odio pariatur corporis vero
          quaerat eius rerum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis
          temporibus doloremque debitis distinctio explicabo nam tempore obcaecati sit quibusdam
          voluptates, quo repudiandae, rerum ipsam optio maiores! Nisi dolorem beatae aliquid.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo molestias eaque animi
          voluptatum necessitatibus, qui labore quam at suscipit maxime quisquam nesciunt fuga
          consectetur, sapiente optio consequatur, nulla vel possimus.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus mollitia, quidem sapiente
          enim facilis necessitatibus, reprehenderit totam provident, corrupti saepe omnis at neque.
          Impedit optio iusto iste rerum quo blanditiis?
        </p>
      </div>
    </div>
  </section>

  <section class="max-w-7xl mx-auto py-12 border-y-2 mt-20 gap-20">
    <div class="text-center w-full flex flex-col">
      <h1 class="text-primary font-normal text-xl">Testimonials</h1>
      <h1 class="font-bold text-2xl">Parent Reviews</h1>
      <div class="flex flex-row gap-4 items-stretch overflow-auto px-4 mt-12 max-h-96">
        <TestimonialCard
          v-for="(testimonial, i) in testimonials"
          :key="i"
          :name="testimonial.name"
          :role="testimonial.role"
          :testimonial="testimonial.testimonial"
          :image="testimonial.image"
          class="mt-4"
        />
      </div>
    </div>
  </section>

  <section id="programs" class="max-w-7xl mx-auto py-12">
    <div class="text-center w-full flex flex-col">
      <h1 class="text-primary font-normal text-xl">Exclusive</h1>
      <h1 class="font-bold text-2xl">Join Our Programs</h1>
      <p class="mt-4 text-text-soft">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </p>
      <div class="flex flex-wrap justify-center items-stretch gap-4 mt-12 max-w-5xl mx-auto px-6">
        <ProgramsCard
          v-for="program in programs"
          :key="program.id"
          :program="program"
          class="w-full sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)] h-72 sm:h-80"
        />
      </div>
    </div>
  </section>

  <section class="max-w-full bg-gray-100">
    <div class="max-w-7xl mx-auto py-12">
      <div class="text-center w-full flex flex-col items-center">
        <h1 class="text-primary font-normal text-xl">Gallery</h1>
        <h1 class="font-bold text-2xl">Our Activities</h1>
        <p class="mt-4 text-text-soft max-w-xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        </p>
        <div class="w-full mt-8 px-4">
          <ImageCarousel :images="carouselImages" alt="Activity" />
        </div>
      </div>
    </div>
  </section>
</template>
