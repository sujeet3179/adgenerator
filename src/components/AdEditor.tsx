import React from 'react';
import { TextField, Box } from '@mui/material';

interface Props {
  title: string;
  description: string;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
}

export const AdEditor: React.FC<Props> = ({ title, description, setTitle, setDescription }) => (
  <Box mt={2}>
    <TextField
      fullWidth
      label="Ad Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      margin="normal"
    />
    <TextField
      fullWidth
      label="Ad Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      margin="normal"
      multiline
      rows={4}
    />
  </Box>
);
