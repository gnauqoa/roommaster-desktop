import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
