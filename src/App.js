import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // For React Query
import Home from './Pages/Home'
import Add from './Pages/Add'
import Show from './Pages/Show';
import Edit from './Pages/Edit';

const App = () => {

    // Create Query Client For React Query
    const queryClient = new QueryClient()

    const public_routing = [
        {
            path: '/',
            component: <Home />
        },
        {
            path: '/add',
            component: <Add />
        },
        {
            path: '/show',
            component: <Show />
        },
        {
            path: '/edit/:id',
            component: <Edit />
        }
    ]

    return (
        <>
            <ToastContainer />

            {/*Cover with QueryClientProvider*/}
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Routes>
                        {public_routing?.map((routing) => {
                            return (
                                <>
                                    <Route path={routing?.path} element={routing?.component} />
                                </>
                            )
                        })}
                    </Routes>
                </Router>
            </QueryClientProvider>
        </>
    )
}

export default App
