export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: ["cursor-pointer rounded-full px-5! ring-0!"],
      },
      // 👉 hanya tambahkan bagian ini
      compoundVariants: [
        // primary solid
        {
          color: "primary",
          variant: "solid",
          class:
            "text-white bg-black hover:bg-neutral-800 active:bg-neutral-800 " +
            "dark:text-black dark:bg-white dark:hover:bg-neutral-200 dark:active:bg-neutral-200",
        },

        // primary outline
        {
          color: "primary",
          variant: "outline",
          class:
            "text-black border border-neutral-300 hover:bg-neutral-100 active:bg-neutral-200 " +
            "dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-800 dark:active:bg-neutral-700",
        },

        // primary soft
        {
          color: "primary",
          variant: "soft",
          class:
            "text-black bg-black/10 hover:bg-black/15 active:bg-black/20 " +
            "dark:text-white dark:bg-white/10 dark:hover:bg-white/15 dark:active:bg-white/20",
        },

        // primary subtle
        {
          color: "primary",
          variant: "subtle",
          class:
            "text-black bg-black/5 hover:bg-black/10 active:bg-black/15  " +
            "dark:text-white dark:bg-white/5 dark:hover:bg-white/10 dark:active:bg-white/15 ",
        },

        // primary ghost
        {
          color: "primary",
          variant: "ghost",
          class:
            "text-black hover:bg-black/10 active:bg-black/15 " +
            "dark:text-white dark:hover:bg-white/10 dark:active:bg-white/15",
        },

        // primary link
        {
          color: "primary",
          variant: "link",
          class:
            "text-black hover:text-black/70 active:text-black/60 " +
            "dark:text-white dark:hover:text-white/80 dark:active:text-white/70",
        },
      ],
      defaultVariants: {
        color: "primary",
        variant: "outline",
      },
    },
  },
});
