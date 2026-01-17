import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { navigationStore, dataStore } from '@/store';
import { MainLayout, LoginModal, ConfirmModal, Toast } from '@/components';
import { HomePage, ClientsPage, DealsPage, TasksPage, AdminPage } from '@/pages';

const PageRouter = observer(() => {
  const { currentPage } = navigationStore;
  switch (currentPage) {
    case 'home': return <HomePage />;
    case 'clients': return <ClientsPage />;
    case 'deals': return <DealsPage />;
    case 'tasks': return <TasksPage />;
    case 'admin': case 'admin-clients': case 'admin-deals': case 'admin-tasks': return <AdminPage />;
    default: return <HomePage />;
  }
});

const App = observer(() => {
  useEffect(() => { dataStore.loadAllData(); }, []);
  return (<><MainLayout><PageRouter /></MainLayout><LoginModal /><ConfirmModal /><Toast /></>);
});

export default App;
