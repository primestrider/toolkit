<template>
  <UMain>
    <div class="w-full flex justify-center">
      <!-- paksa max-width inline supaya tidak bisa dioverride -->
      <div
        class="w-full px-4 py-8"
        style="max-width: 42rem; margin-left: auto; margin-right: auto"
      >
        <slot />
      </div>
    </div>
  </UMain>
</template>
