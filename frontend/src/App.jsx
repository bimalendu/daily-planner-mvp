import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DailyCalendar from './components/DailyCalendar';
import './App.css';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="app-container">
                <h1>Daily Time Blocker</h1>
                <DailyCalendar />
            </div>
        </QueryClientProvider>
    );
}

export default App;