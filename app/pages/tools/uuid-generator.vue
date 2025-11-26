<script setup lang="ts">
definePageMeta({
  layout: "tools",
});

import { ref, computed } from "vue";
import {
  v3 as uuidV3,
  v4 as uuidV4,
  v5 as uuidV5,
  v6 as uuidV6,
  v7 as uuidV7,
} from "uuid";

const DNS_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

const uuidVersions = [
  { value: "v3", label: "UUID V3" },
  { value: "v4", label: "UUID V4" },
  { value: "v5", label: "UUID V5" },
  { value: "v6", label: "UUID V6" },
  { value: "v7", label: "UUID V7" },
];

const selectedUUid = ref<string>("v7"); // default v7
const nameInput = ref<string>("example.com");
const namespaceInput = ref<string>(DNS_NAMESPACE);
const generateUuid = ref<string[]>([]);
const history = ref<string[][]>([]); // store batches
const count = ref<number>(1);

const generateOne = (version: string) => {
  switch (version) {
    case "v3":
      return uuidV3(
        nameInput.value || "default",
        namespaceInput.value || DNS_NAMESPACE
      );
    case "v4":
      return uuidV4();
    case "v5":
      return uuidV5(
        nameInput.value || "default",
        namespaceInput.value || DNS_NAMESPACE
      );
    case "v6":
      return uuidV6();
    case "v7":
    default:
      return uuidV7();
  }
};

const generate = () => {
  try {
    const out: string[] = [];
    const n = Math.max(1, Math.min(1000, Math.floor(count.value) || 1));
    for (let i = 0; i < n; i++) {
      out.push(generateOne(selectedUUid.value));
    }
    generateUuid.value = out;
    // push to history (keep most recent 50 batches)
    history.value.unshift(out);
    if (history.value.length > 50) history.value.pop();
  } catch (err) {
    generateUuid.value = ["Error generating UUID: " + (err as Error).message];
  }
};

const copyToClipboard = async () => {
  if (!generateUuid.value.length) return;
  await navigator.clipboard.writeText(generateUuid.value.join("\n"));
};

const cleargenerateUuid = () => {
  generateUuid.value = [];
};
</script>

<template>
  <UContainer>
    <UPageHeader
      title="UUID Generator"
      description="Generate UUIDs across multiple versions including UUID v3, v4, v5, v6, and v7 instantly and for free. Perfect for developers who need reliable unique identifiers for apps, databases, APIs, and distributed systems."
    />

    <div class="mt-5 flex flex-row gap-3 text-center">
      <UButton
        v-for="version in uuidVersions"
        :key="version.value"
        :label="version.label"
        variant="outline"
        :class="[
          ' rounded-full px-5 text-center',
          selectedUUid === version.value ? ' font-bold' : '',
        ]"
        @click="selectedUUid = version.value"
      />
    </div>
  </UContainer>
</template>
