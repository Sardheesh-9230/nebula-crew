import React, { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import { Emergency } from '@mui/icons-material';
import EmergencySOS from './EmergencySOS';

const SOSButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Emergency SOS" placement="left">
        <Fab
          color="error"
          aria-label="emergency-sos"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1200,
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            boxShadow: '0 8px 24px rgba(245, 87, 108, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
              transform: 'scale(1.1)',
              boxShadow: '0 12px 32px rgba(245, 87, 108, 0.6)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                boxShadow: '0 8px 24px rgba(245, 87, 108, 0.4)',
              },
              '50%': {
                boxShadow: '0 8px 24px rgba(245, 87, 108, 0.8), 0 0 0 8px rgba(245, 87, 108, 0.1)',
              },
              '100%': {
                boxShadow: '0 8px 24px rgba(245, 87, 108, 0.4)',
              },
            },
          }}
        >
          <Emergency sx={{ fontSize: 32 }} />
        </Fab>
      </Tooltip>

      <EmergencySOS open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default SOSButton;
