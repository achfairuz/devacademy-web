<script setup lang="ts">
import { Mail, MapPin, Phone } from '@lucide/vue'
import { RouterLink } from 'vue-router'

import { linked } from '@/constants/constans'
</script>

<template>
  <footer id="contact" class="bg-surface border-t border-border">
    <div class="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
      <div>
        <img
          src="https://placehold.co/40x40/EEE/31343C"
          alt="logo"
          class="inline-block mr-2 w-12 mb-4"
        />
        <p class="text-text-soft max-w-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Nisi et modi
          laborum mollitia nemo ipsa.
        </p>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-heading mb-4">Quick Links</h3>
        <ul class="flex flex-col gap-2">
          <li v-for="item in Object.values(linked)" :key="item.path">
            <RouterLink
              :to="item.path"
              class="text-text-soft hover:text-primary hover:underline transition-colors"
            >
              {{ item.name }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-heading mb-4">Contact</h3>
        <ul class="flex flex-col gap-3 text-text-soft">
          <li class="flex items-center gap-2">
            <MapPin class="w-4 h-4 text-primary" />
            Jl. Lorem Ipsum No. 123, Jakarta
          </li>
          <li class="flex items-center gap-2">
            <Phone class="w-4 h-4 text-primary" />
            +62 812-3456-7890
          </li>
          <li class="flex items-center gap-2">
            <Mail class="w-4 h-4 text-primary" />
            hello@devacademy.com
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-border py-4 text-center text-sm text-text-soft">
      © {{ new Date().getFullYear() }} DevAcademy. All rights reserved.
    </div>
  </footer>
</template>
