import { onBeforeMount, onBeforeUnmount } from 'vue';

export function useTinymce() {
  const focusInTox = (event: FocusEvent) => {
    const toxDialog = (event.target as HTMLElement).closest('.tox');
    if (!toxDialog)
      return;

    event.stopImmediatePropagation();
  };

  onBeforeMount(() => {
    document.addEventListener('focusin', focusInTox, true);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('focusin', focusInTox, true);
  });

  return { focusInTox };
}
