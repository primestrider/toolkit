<script setup lang="ts">
definePageMeta({
  layout: "tools",
});

import { ref, computed, onMounted } from "vue";
import { useClipboard as useClipboardClient } from "@vueuse/core";
import { useToast } from "#imports"; // Nuxt UI composable
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

// track last copied item for per-item feedback
const lastCopied = ref<string | null>(null);

// mounted guard and clipboard fn (init only on client)
const mounted = ref(false);
let copyFn: ((text: string) => Promise<void>) | null = null;
const isCopySupported = ref<boolean>(false);

onMounted(() => {
  mounted.value = true;
  // init clipboard on client only
  const cb = useClipboardClient();
  copyFn = cb.copy;
  isCopySupported.value = !!cb.isSupported;
});

/* Nuxt UI toast helper using useToast().add(...) */
const nuxtToast = useToast();

const showToast = (
  message: string,
  opts: { type?: "success" | "error" | "info"; title?: string } = {}
) => {
  const color =
    opts.type === "success"
      ? "success"
      : opts.type === "error"
      ? "danger"
      : "neutral";

  const payload: Record<string, any> = {};
  if (opts.title) payload.title = opts.title;
  payload.description = message;
  payload.color = color;

  try {
    if (nuxtToast && typeof nuxtToast.add === "function") {
      nuxtToast.add(payload);
      return;
    }
  } catch (e) {
    // ignore
  }

  // fallback
  // eslint-disable-next-line no-console
  console.info("[toast]", message);
};

/* UUID generation logic */
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

/* Clipboard helpers (guarded) */
const copyToClipboard = async () => {
  if (!mounted.value || !copyFn || !generateUuid.value.length) return;
  try {
    await copyFn(generateUuid.value.join("\n"));
    lastCopied.value = generateUuid.value[0] ?? null;
    setTimeout(() => {
      lastCopied.value = null;
    }, 1500);

    showToast(`Copied ${generateUuid.value.length} UUID(s) to clipboard.`, {
      type: "success",
    });
  } catch {
    showToast("Failed to copy to clipboard.", { type: "error" });
  }
};

const cleargenerateUuid = () => {
  generateUuid.value = [];
};

/* copy single item (for clicking uuid or clicking copy button) */
const copyItem = async (text: string) => {
  if (!mounted.value || !copyFn) return;
  try {
    await copyFn(text);
    lastCopied.value = text;
    setTimeout(() => {
      if (lastCopied.value === text) lastCopied.value = null;
    }, 1500);
    const short = text.length > 12 ? text.slice(0, 12) + "…" : text;
    showToast(`Copied: ${short}`, { type: "success" });
  } catch {
    showToast("Failed to copy.", { type: "error" });
  }
};

const showNameNamespace = computed(
  () => selectedUUid.value === "v3" || selectedUUid.value === "v5"
);

/* Download .txt helpers */
const makeFilename = (prefix = "uuids") => {
  const now = new Date();
  const ts = now.toISOString().replace(/[:.]/g, "-");
  return `${prefix}-${ts}.txt`;
};

const downloadTxt = (filename?: string) => {
  if (!mounted.value || !generateUuid.value.length) {
    showToast("No UUIDs to download.", { type: "info" });
    return;
  }
  const content = generateUuid.value.join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || makeFilename("uuids");
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  showToast(
    `Downloaded ${generateUuid.value.length} UUID(s) as ${a.download}`,
    { type: "success" }
  );
};

/* === New: history utilities: copy/download per-batch === */
const copyBatch = async (batch: string[]) => {
  if (!mounted.value || !copyFn || !batch.length) return;
  try {
    await copyFn(batch.join("\n"));
    showToast(`Copied ${batch.length} UUID(s) from batch.`, {
      type: "success",
    });
  } catch {
    showToast("Failed to copy batch.", { type: "error" });
  }
};

const downloadBatch = (batch: string[], index: number) => {
  if (!mounted.value || !batch.length) {
    showToast("No UUIDs to download in this batch.", { type: "info" });
    return;
  }
  const content = batch.join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  // include batch index in filename (1-based)
  a.download = makeFilename(`uuids-batch-${index + 1}`);
  a.href = url;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  showToast(`Downloaded ${batch.length} UUID(s) from batch #${index + 1}`, {
    type: "success",
  });
};
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
                v-if="isCopySupported && mounted"
                size="lg"
                :disabled="!generateUuid.length"
                @click="copyToClipboard"
                color="primary"
                class="cursor-pointer"
                >Copy All</UButton
              >

              <UButton
                size="lg"
                variant="outline"
                :disabled="!generateUuid.length"
                @click="() => downloadTxt()"
              >
                Download .txt
              </UButton>

              <UButton size="sm" variant="outline" @click="cleargenerateUuid"
                >Clear</UButton
              >
            </div>

            <!-- scrollable result list -->
            <ol
              class="list-decimal list-outside text-sm max-h-80 overflow-auto wrap-break-word"
            >
              <li
                v-for="(g, idx) in generateUuid"
                :key="g + String(idx)"
                class="relative py-1"
              >
                <!-- UUID text — block so it fills the line and is the only selectable content -->
                <div
                  class="block pr-12 font-mono whitespace-pre-wrap select-text cursor-pointer"
                  @click="copyItem(g)"
                  title="Click to copy"
                >
                  {{ g }}
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
        <div v-for="(batch, i) in history" :key="i" class="p-0">
          <UCard class="p-3">
            <template #default>
              <div class="flex items-start justify-between gap-3">
                <div class="text-xs text-gray-600">
                  Batch #{{ history.length - i }} — {{ batch.length }} item(s)
                </div>

                <div class="flex items-center gap-2">
                  <UButton
                    size="sm"
                    variant="outline"
                    :disabled="!mounted || !batch.length"
                    @click="() => copyBatch(batch)"
                  >
                    Copy Batch
                  </UButton>

                  <UButton
                    size="sm"
                    variant="outline"
                    :disabled="!mounted || !batch.length"
                    @click="() => downloadBatch(batch, i)"
                  >
                    Download Batch .txt
                  </UButton>
                </div>
              </div>

              <ol
                class="list-decimal list-outside text-xs mt-2 space-y-1 wrap-break-word"
              >
                <li v-for="(g, j) in batch" :key="g + String(j)">{{ g }}</li>
              </ol>
            </template>
          </UCard>
        </div>
      </div>
    </section>
  </UContainer>
</template>

<style scoped>
/* keep select helper (if you still use it anywhere) */
.select-all {
  user-select: text;
}
</style>
