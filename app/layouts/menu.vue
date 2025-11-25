<template>
  <UMain>
    <div class="w-full flex justify-center">
      <!-- paksa max-width inline supaya tidak bisa dioverride -->
      <div class="w-full px-4 py-8 max-w-6xl">
        <slot />
      </div>
    </div>
  </UMain>
</template>
