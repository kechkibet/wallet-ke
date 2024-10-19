import React from 'react';
import { ThemeProvider } from 'antd-style';

interface PageThemeProps {
  children: React.ReactNode;
}

const PageTheme: React.FC<PageThemeProps> = ({ children }) => {
  // Define the custom theme with the desired primary color
  const customTheme = {
    token: {
      colorPrimary: '#FF8C00', // Set primary color to orange
    },
  };

  return (
    <ThemeProvider theme={customTheme}>
      {children}
    </ThemeProvider>
  );
};

export default PageTheme;
