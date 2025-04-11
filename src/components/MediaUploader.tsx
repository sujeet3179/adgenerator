import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface Props {
  onMediaUpload: (file: File) => void;
}

export const MediaUploader: React.FC<Props> = ({ onMediaUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onMediaUpload(e.target.files[0]);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Upload Media</Typography>
      <Button variant="contained" component="label">
        Upload File
        <input type="file" hidden accept="image/*,video/*" onChange={handleFileChange} />
      </Button>
    </Box>
  );
};
