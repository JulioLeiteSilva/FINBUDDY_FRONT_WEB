import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';

// --- Helpers para o funcionamento das Abas ---
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

// --- Definição das Props do Componente Principal ---
export interface TabConfig {
  label: string;
  content: React.ReactNode;
}

interface TabsContainerProps {
  tabs: TabConfig[];
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({ tabs, value, onChange }) => {
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={onChange} aria-label="tabs container">
          {tabs.map((tab, index) => (
            <Tab label={tab.label} {...a11yProps(index)} key={index} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab, index) => (
        <CustomTabPanel value={value} index={index} key={index}>
          {tab.content}
        </CustomTabPanel>
      ))}
    </Box>
  );
};