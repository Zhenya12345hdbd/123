import { useState } from 'react';

export function usePendingFiles() {
  const [pendingFiles, setPendingFiles] = useState([]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setPendingFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const handleImageCancel = () => setPendingFiles([]);

  const handleRemoveSingleFile = (index) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clear = () => setPendingFiles([]);

  return {
    pendingFiles,
    handleImageSelect,
    handleImageCancel,
    handleRemoveSingleFile,
    clear,
  };
}