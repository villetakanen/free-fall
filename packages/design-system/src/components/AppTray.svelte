<script>
  import "../styles/app-tray.css";

  let { items = [], children } = $props();
  let open = $state(false);
  let burgerRef = $state(null);
  let drawerRef = $state(null);
  let isDesktop = $state(false);

  function updateBreakpoint() {
    isDesktop = window.matchMedia("(min-width: 780px)").matches;
  }

  $effect(() => {
    updateBreakpoint();
    const mql = window.matchMedia("(min-width: 780px)");
    mql.addEventListener("change", updateBreakpoint);
    return () => mql.removeEventListener("change", updateBreakpoint);
  });

  function toggle() {
    open = !open;
    if (open && !isDesktop) {
      // Focus trap: focus the drawer when overlaying
      requestAnimationFrame(() => {
        const first = drawerRef?.querySelector(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        first?.focus();
      });
    }
  }

  function close() {
    open = false;
    burgerRef?.focus();
  }

  function handleKeydown(e) {
    if (e.key === "Escape" && open) {
      close();
    }

    // Focus trap for overlay mode (small + medium)
    if (open && !isDesktop && e.key === "Tab" && drawerRef) {
      const focusable = drawerRef.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="app-tray" data-open={open ? "" : undefined}>
  <aside class="app-tray__rail">
    <button
      class="app-tray__burger"
      bind:this={burgerRef}
      onclick={toggle}
      aria-expanded={open}
      aria-controls="app-tray-nav"
      aria-label="Toggle navigation"
    >
      <span class="app-tray__burger-icon app-tray__burger-icon--menu material-symbols-sharp" aria-hidden="true">menu</span>
      <span class="app-tray__burger-icon app-tray__burger-icon--close material-symbols-sharp" aria-hidden="true">close</span>
    </button>
    {#each items as item}
      <a class="app-tray__rail-item" href={item.href} data-active={item.active ? "" : undefined}>
        <span class="app-tray__rail-icon material-symbols-sharp" aria-hidden="true">{item.icon}</span>
      </a>
    {/each}
  </aside>

  <nav
    id="app-tray-nav"
    class="app-tray__drawer"
    bind:this={drawerRef}
    aria-label="Main navigation"
  >
    <div class="app-tray__drawer-header"></div>
    {#each items as item}
      <a class="app-tray__nav-item" href={item.href} data-active={item.active ? "" : undefined}>
        <span class="app-tray__nav-icon material-symbols-sharp" aria-hidden="true">{item.icon}</span>
        {item.label}
      </a>
    {/each}
  </nav>

  <button
    class="app-tray__scrim"
    onclick={close}
    aria-label="Close navigation"
    tabindex="-1"
  ></button>

  <main class="app-tray__content">
    {@render children()}
  </main>
</div>
