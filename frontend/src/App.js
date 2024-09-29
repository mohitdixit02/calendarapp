import './App.css';
import CalendarView from './components/Calendar/CalendarView';
import LeftPannel from "./components/LeftPannel/LeftPannel";
import { Routes, Route, BrowserRouter } from "react-router-dom"
import NewEvent from './components/Events/NewEvent/NewEvent';
import ViewEvents from './components/Events/ViewEvents/ViewEvents';
import Upcoming from "./components/Upcoming/Upcoming";
import { NotificationProvider } from './components/Notifications/Notifications';
import Cookies from 'js-cookie';

function App() {
  if(!Cookies.get('active_event')){
    Cookies.set('active_event', JSON.stringify({date:"", title:"", description:"", start_time:"", end_time:""}));
  }
  return (
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <div className="App">
                <LeftPannel />
                <CalendarView />
              </div>
            } />
            <Route path="/upcoming" element={
              <div className="App">
                <LeftPannel />
                <Upcoming />
              </div>
            } />
            <Route path="/create_new_event" element={
              <div className="App">
                <LeftPannel />
                <NewEvent />
              </div>
            } />
            <Route path="/view_events" element={
              <div className="App">
                <LeftPannel />
                <ViewEvents />
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
  );
}

export default App;
