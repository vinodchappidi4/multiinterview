import React from 'react';
import { Box, Typography } from '@mui/material';

const TopBar = ({ selectedRollNumber }) => {
  return (
    <Box sx={{
      backgroundColor: '#1a3f6e',
      color: 'white',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginRight: 1 }}>
          Roll Number : {selectedRollNumber}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ marginRight: 4 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Name
          </Typography>
          <Typography variant="body1">
            John
          </Typography>
        </Box>
        <Box sx={{ marginRight: 4 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Department
          </Typography>
          <Typography variant="body1">
            CSE
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            year
          </Typography>
          <Typography variant="body1">
            2022
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TopBar;