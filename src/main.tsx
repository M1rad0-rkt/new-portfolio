import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/manrope';
import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';
import './styles/admin.css';
import App from './App';
import { I18nProvider } from './i18n/I18nProvider';
import { ThemeProvider } from './hooks/useTheme';
import { AdminProvider } from './admin/AdminProvider';
import { ContentProvider } from './content/ContentProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <AdminProvider>
          <ContentProvider>
            <App />
          </ContentProvider>
        </AdminProvider>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
