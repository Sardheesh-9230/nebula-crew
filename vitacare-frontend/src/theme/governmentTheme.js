import { createTheme } from '@mui/material/styles';

// VitaCare Government Theme - Consistent design system
export const governmentTheme = createTheme({
  palette: {
    primary: {
      main: '#164194', // Government Blue
      light: '#2d5cb8',
      dark: '#0f2d66',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#13547a', // Teal Blue
      light: '#1a6b96',
      dark: '#0d3d56',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#FF9933', // Saffron (Indian Flag)
      light: '#FFB366',
      dark: '#E68A2E',
      contrastText: '#ffffff',
    },
    success: {
      main: '#138808', // Green (Indian Flag)
      light: '#1ea50f',
      dark: '#0d6006',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FFD700', // Gold
      light: '#FFE44D',
      dark: '#CCA300',
      contrastText: '#000000',
    },
    error: {
      main: '#d32f2f',
      light: '#e57373',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      letterSpacing: '-0.5px',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.3px',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.1)',
    '0 8px 16px rgba(0,0,0,0.1)',
    '0 12px 24px rgba(0,0,0,0.1)',
    '0 16px 32px rgba(0,0,0,0.1)',
    '0 20px 40px rgba(0,0,0,0.1)',
    '0 24px 48px rgba(0,0,0,0.1)',
    '0 2px 4px rgba(22,65,148,0.1)',
    '0 4px 8px rgba(22,65,148,0.1)',
    '0 8px 16px rgba(22,65,148,0.15)',
    '0 12px 24px rgba(22,65,148,0.15)',
    '0 16px 32px rgba(22,65,148,0.2)',
    '0 20px 40px rgba(22,65,148,0.2)',
    '0 24px 48px rgba(22,65,148,0.25)',
    '0 28px 56px rgba(22,65,148,0.25)',
    '0 32px 64px rgba(22,65,148,0.3)',
    '0 36px 72px rgba(22,65,148,0.3)',
    '0 40px 80px rgba(22,65,148,0.35)',
    '0 44px 88px rgba(22,65,148,0.35)',
    '0 48px 96px rgba(22,65,148,0.4)',
    '0 52px 104px rgba(22,65,148,0.4)',
    '0 56px 112px rgba(22,65,148,0.45)',
    '0 60px 120px rgba(22,65,148,0.45)',
    '0 64px 128px rgba(22,65,148,0.5)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #164194 0%, #13547a 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0f2d66 0%, #0d3d56 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          border: '1px solid rgba(22,65,148,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(22,65,148,0.15)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        },
        elevation3: {
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #164194 0%, #13547a 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: '#164194',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#164194',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
});

// Common styles for consistent design
export const commonStyles = {
  // Gradient backgrounds
  gradients: {
    primary: 'linear-gradient(135deg, #164194 0%, #13547a 100%)',
    accent: 'linear-gradient(135deg, #FF9933 0%, #FF7722 100%)',
    success: 'linear-gradient(135deg, #138808 0%, #0d6006 100%)',
    light: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
  },
  
  // Glass-morphism effect
  glassMorphism: {
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  
  // Government tricolor stripe
  tricolorStripe: {
    background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%, #138808 100%)',
    height: '6px',
  },
  
  // Card hover effect
  cardHover: {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 48px rgba(22, 65, 148, 0.2)',
    },
  },
  
  // Text shadows for readability
  textShadows: {
    strong: '3px 3px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
    medium: '2px 2px 6px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)',
    light: '1px 1px 4px rgba(0,0,0,0.3)',
  },
  
  // Hero section overlay
  heroOverlay: {
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.15,
      zIndex: 0,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(22, 65, 148, 0.98) 0%, rgba(19, 84, 122, 0.98) 100%)',
      zIndex: 1,
    },
  },
  
  // Button styles
  buttons: {
    primary: {
      background: 'linear-gradient(135deg, #164194 0%, #13547a 100%)',
      color: '#fff',
      fontWeight: 700,
      px: 4,
      py: 1.5,
      borderRadius: 3,
      textTransform: 'none',
      boxShadow: '0 4px 12px rgba(22,65,148,0.3)',
      '&:hover': {
        background: 'linear-gradient(135deg, #0f2d66 0%, #0d3d56 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(22,65,148,0.4)',
      },
      transition: 'all 0.3s ease',
    },
    accent: {
      background: 'linear-gradient(135deg, #FF9933 0%, #FF7722 100%)',
      color: '#fff',
      fontWeight: 700,
      px: 4,
      py: 1.5,
      borderRadius: 3,
      textTransform: 'none',
      boxShadow: '0 4px 12px rgba(255,153,51,0.3)',
      '&:hover': {
        background: 'linear-gradient(135deg, #FF7722 0%, #FF5511 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(255,153,51,0.4)',
      },
      transition: 'all 0.3s ease',
    },
  },
};

export default governmentTheme;
