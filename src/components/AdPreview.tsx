import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  mediaUrl: string;
  title: string;
  description: string;
}

export const AdPreview: React.FC<Props> = ({ mediaUrl, title, description }) => {
  const isVideo = mediaUrl.endsWith('.mp4') || mediaUrl.includes('video');

  return (
    <Box mt={4} p={2} border="1px solid #ccc" borderRadius={2}>
      {isVideo ? (
        <video src={mediaUrl} controls style={{ width: '100%' }} />
      ) : (
        <img src={mediaUrl} alt="Preview" style={{ width: '100%' }} />
      )}
      <Typography variant="h5">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
    </Box>
  );
};
