import { useState } from 'react';

export const useMenu = () => {
  const [anchorId, setAnchorId] = useState('');
  const onClose = () => setAnchorId('');

  return {
    anchorId,
    setAnchorId,
    onClose
  };
};
