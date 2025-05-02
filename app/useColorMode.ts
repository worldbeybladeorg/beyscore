import { useEffect, useState } from "react";

type ColorMode = "light" | "dark" | "system";
type ResolvedColorMode = "light" | "dark";

/**
 * Hook to manage light/dark/system color modes
 */
export function useColorMode() {
  const [preference, setPreference] = useState<ColorMode>(() => {
    return (localStorage.getItem("color-mode") as ColorMode) || "system";
  });

  const [resolvedMode, setResolvedMode] = useState<ResolvedColorMode>(() => {
    return getSystemPreference();
  });

  useEffect(() => {
    if (preference === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const mode = media.matches ? "dark" : "light";
        setResolvedMode(mode);
        applyThemeClass(mode);
      };

      handleChange(); // set initial
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    } else {
      setResolvedMode(preference);
      applyThemeClass(preference);
    }
  }, [preference]);

  function updatePreference(newPreference: ColorMode) {
    setPreference(newPreference);
    localStorage.setItem("color-mode", newPreference);
  }

  return {
    preference,
    resolvedMode,
    setPreference: updatePreference,
  };
}

function getSystemPreference(): ResolvedColorMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeClass(mode: ResolvedColorMode) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(mode);
}
