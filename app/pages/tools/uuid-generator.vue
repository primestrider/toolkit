<script setup lang="ts">
definePageMeta({
  layout: "tools",
});

import { ref, computed } from "vue";
import { useClipboard } from "@vueuse/core";
import {
  v3 as uuidV3,
  v4 as uuidV4,
  v5 as uuidV5,
  v6 as uuidV6,
  v7 as uuidV7,
} from "uuid";

const { copy, copied, isSupported } = useClipboard();

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

// track last copied item for per-item feedback
const lastCopied = ref<string | null>(null);

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

const copyToClipboard = () => {
  if (!generateUuid.value.length) return;
  copy(generateUuid.value.join("\n"));
};

const cleargenerateUuid = () => {
  generateUuid.value = [];
};

// copy single item (for clicking uuid or clicking copy button)
const copyItem = async (text: string) => {
  try {
    await copy(text);
    lastCopied.value = text;
    // clear feedback after 1500ms
    setTimeout(() => {
      if (lastCopied.value === text) lastCopied.value = null;
    }, 1500);
  } catch {
    // ignore
  }
};

const showNameNamespace = computed(
  () => selectedUUid.value === "v3" || selectedUUid.value === "v5"
);
</script>

<template>
  <UContainer>
    <UPageHeader
      title="UUID Generator"
      description="Generate UUIDs across multiple versions including UUID v3, v4, v5, v6, and v7 instantly and for free. Perfect for developers who need reliable unique identifiers for apps, databases, APIs, and distributed systems."
    />

    <!-- version chips -->
    <div class="mt-5 flex flex-row gap-3 flex-wrap text-center">
      <UButton
        v-for="version in uuidVersions"
        :key="version.value"
        :label="version.label"
        variant="outline"
        :class="[
          'rounded-full px-5 py-2 cursor-pointer transition-colors',
          selectedUUid === version.value
            ? 'font-semibold bg-primary-600 dark:text-200 dark:bg-old-neutral-950 border border-old-neutral-400'
            : 'border border-old-neutral-300 text-old-neutral-800 bg-white hover:bg-old-neutral-100 \
         dark:border-old-neutral-700 dark:text-old-neutral-200 dark:bg-old-neutral-900 dark:hover:bg-old-neutral-800',
        ]"
        @click="selectedUUid = version.value"
      />
    </div>

    <!-- optional name / namespace inputs for v3 & v5 -->
    <div
      v-if="showNameNamespace"
      class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      <div>
        <label class="block text-sm font-medium mb-1">Name</label>
        <UInput v-model="nameInput" type="text" class="w-full" size="lg" />
        <p class="text-xs text-neutral-400 mt-1">
          Used for name-based UUIDs (v3 & v5).
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Namespace (UUID)</label>
        <UInput v-model="namespaceInput" type="text" class="w-full" size="lg" />
        <p class="text-xs text-neutral-400 mt-1">
          Default DNS namespace:
          <code class="bg-gray-100 px-1 rounded"
            >6ba7b810-9dad-11d1-80b4-00c04fd430c8</code
          >
        </p>
      </div>
    </div>

    <!-- controls: count + actions -->
    <!-- controls: count + actions (flex responsive) -->
    <div class="mt-5 flex flex-col gap-3">
      <!-- left: input area (takes available width) -->
      <div class="flex-1">
        <label class="block text-sm font-medium mb-1">How many UUIDs?</label>

        <UInputNumber
          v-model="count"
          :min="1"
          :max="1000"
          size="lg"
        ></UInputNumber>

        <p class="text-xs text-neutral-400 mt-1">
          Max 1000 per generate. Output will be shown line-by-line.
        </p>
      </div>

      <!-- right: action buttons -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
        <UButton
          color="primary"
          @click="generate"
          block
          size="xl"
          class="font-semibold"
        >
          Generate
        </UButton>
      </div>
    </div>

    <!-- RESULT SECTION -->
    <section class="mt-6">
      <h2 class="text-lg font-semibold mb-2">
        Results
        <span class="text-sm text-neutral-400"
          >({{ generateUuid.length }} items)</span
        >
      </h2>

      <UCard class="min-h-80">
        <template #default>
          <template v-if="!generateUuid.length">
            <div class="text-neutral-400">
              No UUIDs generated yet. Click <strong>Generate</strong> to create
              UUIDs.
            </div>
          </template>

          <template v-else>
            <!-- actions for results -->
            <div class="flex justify-end gap-2 mb-3">
              <UButton
                size="lg"
                :disabled="!generateUuid.length"
                @click="copyToClipboard"
                color="primary"
                class="cursor-pointer"
                >Copy All</UButton
              >
              <UButton size="sm" variant="outline" @click="cleargenerateUuid"
                >Clear</UButton
              >
            </div>

            <!-- scrollable result list -->
            <ol
              class="list-decimal list-inside text-sm max-h-80 overflow-auto wrap-break-word"
            >
              <li
                v-for="(g, idx) in generateUuid"
                :key="g + String(idx)"
                class="group flex items-start justify-between gap-1 p-1 relative"
              >
                <!-- clicking the text copies the uuid -->
                <div
                  class="flex-1 pr-3 cursor-pointer select-all"
                  @click="copyItem(g)"
                  title="Click to copy"
                >
                  {{ g }}
                </div>

                <!-- copy button appears only on hover (group-hover) -->
                <div
                  class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    class="text-xs px-2 py-1 rounded border bg-white/6"
                    @click.stop="copyItem(g)"
                    aria-label="Copy UUID"
                  >
                    <!-- show 'Copied!' when this item was last copied -->
                    <span v-if="lastCopied === g">Copied!</span>
                    <span v-else>Copy</span>
                  </button>
                </div>
              </li>
            </ol>
          </template>
        </template>
      </UCard>
    </section>

    <!-- HISTORY (batch) -->
    <section v-if="history.length" class="mt-6">
      <h3 class="text-sm font-medium mb-2">History (recent batches)</h3>
      <div class="space-y-3 max-h-80 overflow-auto">
        <div
          v-for="(batch, i) in history"
          :key="i"
          class="p-3 rounded border bg-black"
        >
          <div class="text-xs text-gray-600 mb-2">
            Batch #{{ history.length - i }} — {{ batch.length }} item(s)
          </div>
          <ol
            class="list-decimal list-inside text-xs space-y-1 wrap-break-word"
          >
            <li v-for="(g, j) in batch" :key="g + String(j)">{{ g }}</li>
          </ol>
        </div>
      </div>
    </section>
  </UContainer>
</template>

<style scoped>
/* show copy button on hover via `group` utility; .select-all helps users copy visually */
.select-all {
  user-select: text;
}

/* small visual tweak for copy button background on dark result area */
button[aria-label="Copy UUID"] {
  background: rgba(255, 255, 255, 0.04);
}
</style>
