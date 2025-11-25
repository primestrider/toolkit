<template>
  <UMain>
    <div class="w-full">
      <!-- inline CSS vars SSR-safe -->
      <div
        class="mx-auto px-4 max-w-[1920px]"
        :style="{
          '--ad-rail-w': readAdBannerWidth,
          '--ad-rail-h': railHeight,
        }"
      >
        <!-- grid: single column on mobile, 3 columns on lg -->
        <div
          class="grid grid-cols-1 gap-6 items-start lg:[grid-template-columns:var(--ad-rail-w)_1fr_var(--ad-rail-w)]"
        >
          <!-- LEFT RAIL (desktop only) -->
          <aside
            class="hidden lg:flex justify-center"
            role="complementary"
            aria-labelledby="left-rail-label"
          >
            <span id="left-rail-label" class="sr-only">Left Advertisement</span>

            <div
              class="flex items-center justify-center bg-white border border-gray-200 rounded-md text-xs text-gray-400 p-2 box-border"
              :style="{
                width: 'var(--ad-rail-w)',
                minHeight: 'var(--ad-rail-h)',
              }"
              data-debug="left-ad"
            >
              Left Ad
            </div>
          </aside>

          <!-- MAIN COLUMN -->
          <div class="flex flex-col gap-4">
            <!-- Tablet medium rect (visible on md, hidden on lg) -->
            <div
              class="hidden md:flex lg:hidden items-center justify-center mx-auto"
              aria-hidden="true"
              style="max-width: 300px"
            >
              <div
                class="w-[300px] h-[250px] bg-white border border-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400"
              >
                Medium Ad (300×250) — Tablet
              </div>
            </div>

            <!-- Main content -->
            <main class="px-0 py-8 max-w-[42rem] mx-auto">
              <slot />
            </main>

            <!-- Bottom banner (responsive) -->
            <div
              class="flex justify-center w-full mt-2 lg:mt-6"
              role="complementary"
              aria-label="Iklan bawah"
            >
              <div class="w-full px-4">
                <!--
      Container max-width responsif:
      - mobile: sempit
      - lg: cukup lebar (1500px) agar 2x728px muat
      - xl: sedikit lebih lebar
    -->
                <div
                  class="grid grid-cols-1 lg:grid-cols-2 gap-4 mx-auto w-full max-w-[380px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[1500px] xl:max-w-[1600px]"
                >
                  <!-- Bottom Ad 1: fluid width, but capped to 728px on large screens -->
                  <div class="w-full flex items-center justify-center">
                    <div
                      class="bg-white border rounded-md flex items-center justify-center text-xs text-gray-400 w-full"
                      :class="bottomSizeClass"
                      style="max-width: 728px"
                    >
                      Bottom Ad #1 (responsive)
                    </div>
                  </div>

                  <!-- Bottom Ad 2: hidden on small, shown on lg; also fluid + capped -->
                  <div
                    class="w-full hidden lg:flex items-center justify-center"
                  >
                    <div
                      class="bg-white border rounded-md flex items-center justify-center text-xs text-gray-400 w-full"
                      :class="bottomSizeClass"
                      style="max-width: 728px"
                    >
                      Bottom Ad #2 (responsive)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT RAIL (desktop only) -->
          <aside
            class="hidden lg:flex justify-center"
            role="complementary"
            aria-labelledby="right-rail-label"
          >
            <span id="right-rail-label" class="sr-only"
              >Right Advertisement</span
            >

            <div
              class="flex items-center justify-center bg-white border border-gray-200 rounded-md text-xs text-gray-400 p-2 box-border"
              :style="{
                width: 'var(--ad-rail-w)',
                minHeight: 'var(--ad-rail-h)',
              }"
              data-debug="right-ad"
            >
              Right Ad
            </div>
          </aside>
        </div>
      </div>
    </div>
  </UMain>
</template>

<script setup lang="ts">
import { computed } from "vue";

const readAdBannerWidth = "240px"; // ubah ke 200px / 240px / 300px sesuai kebutuhan
const railHeight = "600px";

const bottomSizeClass = computed(() => {
  // jangan set fixed width di sini — gunakan w-full + style max-width di inner div
  return "h-[50px] sm:h-[60px] lg:h-[90px]";
});
</script>

<!-- Tidak ada style custom di sini — semua menggunakan Tailwind -->
