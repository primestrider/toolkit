<!-- app/layouts/tools.vue -->
<template>
  <UMain>
    <div class="w-full">
      <div class="mx-auto px-4" :style="`max-width: ${containerMaxWidth}`">
        <div
          class="grid grid-cols-1 lg:grid-cols-[var(--ad-rail-w)_1fr_var(--ad-rail-w)] gap-6 items-start"
        >
          <!-- LEFT AD (desktop only) -->
          <aside
            class="hidden lg:flex justify-center"
            aria-label="Iklan kiri"
            role="complementary"
          >
            <div
              class="ad-rail flex items-center justify-center bg-white border border-gray-200 rounded-md text-xs text-gray-400"
              :style="`width: var(--ad-rail-w); min-height: var(--ad-rail-h)`"
            >
              Left Ad (<span class="hidden md:inline">var</span>)
            </div>
          </aside>

          <!-- MAIN COLUMN -->
          <div class="flex flex-col gap-4">
            <!-- TABLET MEDIUM RECT (300x250) shown on md but hidden on lg -->
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

            <!-- MAIN CONTENT -->
            <main
              class="px-0 py-8"
              style="max-width: 42rem; margin-left: auto; margin-right: auto"
            >
              <slot />
            </main>

            <!-- BOTTOM BANNER (desktop/tablet/mobile) -->
            <div
              class="flex justify-center w-full mt-2 lg:mt-6"
              aria-label="Iklan bawah"
              role="complementary"
            >
              <div class="w-full px-4">
                <div
                  class="mx-auto bg-white border rounded-md flex items-center justify-center text-xs text-gray-400"
                  :class="bottomClass"
                  style="margin: 0 auto"
                >
                  Bottom Ad (responsive)
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT AD (desktop only) -->
          <aside
            class="hidden lg:flex justify-center"
            aria-label="Iklan kanan"
            role="complementary"
          >
            <div
              class="ad-rail flex items-center justify-center bg-white border border-gray-200 rounded-md text-xs text-gray-400"
              :style="`width: var(--ad-rail-w); min-height: var(--ad-rail-h)`"
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

/*
  Quick customizable settings:
  - change railWidth to '160px' (default), '200px', '300px', etc.
  - containerMaxWidth keeps main content comfortable when rails expand.
*/
const railWidth = "240px"; // <-- change this to widen left/right rails (160px / 200px / 300px)
const railHeight = "600px"; // keep standard vertical rail height
const containerMaxWidth = "1600px"; // total content width (adjust if rails get huge)

// bottom responsive classes (Tailwind utility string)
const bottomClass = computed(() => {
  return "w-[320px] h-[50px] sm:w-[468px] sm:h-[60px] lg:w-[728px] lg:h-[90px]";
});

// inject CSS variables into root of component via style binding
// Using inline <style> is simpler here; the template uses var(--ad-rail-w) etc.
const root = document?.documentElement;
if (typeof window !== "undefined") {
  document.documentElement.style.setProperty("--ad-rail-w", railWidth);
  document.documentElement.style.setProperty("--ad-rail-h", railHeight);
}
</script>

<style scoped>
/* Visual polish for ad placeholders */
.ad-rail {
  padding: 8px;
  box-sizing: border-box;
}

/* ensure rails don't collapse on very narrow screens */
@media (max-width: 1023px) {
  :root {
    --ad-rail-w: 0px;
    --ad-rail-h: 0px;
  }
}
</style>
