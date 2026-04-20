export function useMatchHistoryModal() {
  const isMatchHistoryModalOpen = ref(false);
  const isMatchHistoryModalClosing = ref(false);

  function openMatchHistoryModal() {
    isMatchHistoryModalClosing.value = false;
    isMatchHistoryModalOpen.value = true;
  }

  function closeMatchHistoryModal() {
    if (isMatchHistoryModalClosing.value) return; // Prevent multiple close calls

    isMatchHistoryModalClosing.value = true;
    // Wait for slide-out animation to complete (300ms)
    setTimeout(() => {
      isMatchHistoryModalOpen.value = false;
      isMatchHistoryModalClosing.value = false;
    }, 300);
  }

  return {
    isMatchHistoryModalOpen,
    isMatchHistoryModalClosing,
    openMatchHistoryModal,
    closeMatchHistoryModal,
  };
}

export function useSettingsModal() {
  const isSettingsModalOpen = ref(false);
  const isSettingsModalClosing = ref(false);

  function openSettingsModal() {
    isSettingsModalClosing.value = false;
    isSettingsModalOpen.value = true;
  }

  function closeSettingsModal() {
    if (isSettingsModalClosing.value) return;
    isSettingsModalClosing.value = true;
    setTimeout(() => {
      isSettingsModalOpen.value = false;
      isSettingsModalClosing.value = false;
    }, 300);
  }

  return {
    isSettingsModalOpen,
    isSettingsModalClosing,
    openSettingsModal,
    closeSettingsModal,
  };
}
