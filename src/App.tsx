import './App.css';
import routes from './Routing/Routes';
import { Toaster } from 'react-hot-toast';
import { Context } from './Context/store';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: routes,
      errorElement: <div style={{ color: "#fff" }}>
        <h1>Something went wrong</h1>
      </div>,
    },
  ]);
  return (
    <Context>
      <div className="App">
        <RouterProvider router={router} />
        <Toaster />
      </div>
    </Context>
  );
}

export default App;
