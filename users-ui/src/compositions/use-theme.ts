import { ref } from 'vue';
import { useQuasar } from 'quasar';

export function useTheme() {
  const q = useQuasar();
  const isDark = ref(q.dark.isActive);

  function dark(): void {
    q.dark.set(true);
    isDark.value = true;
    localStorage.setItem('theme', 'dark');
  }

  function light(): void {
    q.dark.set(false);
    isDark.value = false;
    localStorage.setItem('theme', 'light');
  }

  function system(): void {
    const prevState = localStorage.getItem('theme');
    if (prevState === 'dark') {
      dark();
    } else if (prevState === 'light') {
      light();
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      dark();
    } else {
      light();
    }
  }

  return {
    isDark,
    system,
    dark,
    light,
  };
}
