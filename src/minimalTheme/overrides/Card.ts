import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Card(theme: Theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#22262C',
          boxShadow: theme.customShadows.z16,
          borderRadius: theme.shape.borderRadiusMd,
          position: 'relative'
          // zIndex: 0 // Fix Safari overflow: hidden with border radius << this breaks popovers from saleor
        }
      }
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: { variant: 'body2', marginTop: theme.spacing(0.5) }
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0)
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3)
        }
      }
    }
  };
}
