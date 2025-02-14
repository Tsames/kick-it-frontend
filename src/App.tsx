//Dependencies
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

//Import Backend Address
import REACT_APP_BACKEND from "./config";

//Import Nav & Footer Components
import Navbar from './components/navigation_components/navbar';
import Footer from './components/navigation_components/footer';

//Import Account Components
// import Login from './components/Accounts/Login';
// import Signup from './components/Accounts/Signup/Signup';
// import ForgotPassword from './components/Accounts/Forgot-Password/ForgotPassword'

//Import Main Pages
import Home from './components/home_page/Home';
// import HowItWorks from './components/info_pages/howItWorks';
import Create from './components/create_pages/create_page/create';
import Created from './components/create_pages/created_page/created';
// import Invitation from './components/event_pages/invitation_page/invitation';
import Event from './components/event_pages/event_page/event';
import AboutUs from "./components/info_pages/aboutUs";

//Import Example Event Data
import exampleEvent from "./exampleEvent"

function App() {

  /* ------------------------------------------ App Wide Variables and State ------------------------------------------ */

  /* Data of the event is stored in event state at App.js to eliminate the need to repeatedly query the database.

  We also store data called blocks which is data that facilitates the creation of grids in the AttendanceChart.js and Grid.js components
  to visually represent availability */

  const location = useLocation();

  // const BACKEND_URL = process.env.REACT_APP_KICKIT_DEV_BACKEND;
  const BACKEND_URL = REACT_APP_BACKEND;

  //Attending Interface
  interface attendingInterface {
    name: string;
    available: Array<[number, number]>;
  }

  //Event Interface
 interface eventInterface {
    _id: string;
    title: string;
    location: string;
    description: string;
    early: number;
    late: number;
    days: number[];
    attending: Array<attendingInterface>;
  }

  //Stores the data of an event
  const [event, setEvent] = useState<eventInterface>(exampleEvent);

  /* ------------------------------------------ Helper Functions ------------------------------------------ */

  /* Helper function (checkEvent) - Searches for a specific Id in the database, if none exist then it returns false.
  If an event with the given Id does exist returns true and sets state to the new event data. */
  const getEventData = async (id : string) :Promise<boolean> => {
    try {
      //Fetch event data
      const response = await fetch(BACKEND_URL + `events/${id}`);
      const data = await response.json()

      //Set event state
      setEvent(data);

      //Return true
      return true;

    } catch (error) {
      console.log("Couldn't get event.");
      console.log(error);
      return false;
    }
  }

  /* Helper function (addAttendee) - Passed the new attendee's object. Checks the current event states' attending array to see
  if it contains an object that matches the new attendee's name. If it finds one, replace it with the new data. If it doesn't add the new data to the array. */

  const findExisting = (newAttendee: attendingInterface): attendingInterface[] => {

    const newAttending: Array<attendingInterface> = event.attending;

    for (let i=0; i < newAttending.length; i++) {
      if (newAttending[i].name === newAttendee.name) {
        newAttending[i] = newAttendee;
        return newAttending;
      }
    }

    newAttending.push(newAttendee);
    return newAttending;
  }

  /* ------------------------------------------ Passing Functions ------------------------------------------ */

  /* Passing Function - Checks if the current event is saved in the event state matches the url of the page.
  If it doesn't, then the function will call getEventData */
  const checkEvent = async (id: string): Promise<boolean> => {
    if (id !== event._id) {
      const output = await getEventData(id);
      return output;
    } else {
      return true;
    }
  }

  /* Passing Function - Sends a PUT HTTP Request to backend server to amend the event in state with a new availability. */
  const addAttendee = async (newAttendee: attendingInterface): Promise<void> => {

    //Create an event object with the newAttendee data
    const newAttending = findExisting(newAttendee);
    const newEvent = {...event, attending: newAttending };

    //If the user is just submitting to the example event then just update state - no need to make a call to the database.
    if (event._id === "example") {
      setEvent(newEvent);

    //Else the user is updating a real event.
    } else {
      try {
        //Find data by Id and update using a PUT request. Save the response to data
        const response = await fetch(BACKEND_URL + `events/${event._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newEvent) });
        const data = await response.json()

        //Set event state
        console.log("Setting new event state in addAttendee function.");
        console.log(data);
        await setEvent({...event, attending: data.attending });

      } catch(error) {
        console.log(error);
      }
    }
  }

  /* ------------------------------------------ Returning JSX ------------------------------------------ */

  return (
    <>
      <AnimatePresence>
        <Navbar eventId={event._id} />
        <Routes location={location} key={location.key}>

          {/* Accounts Routes */}
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm-account" element={<ForgotPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/new-password" element={<ForgotPassword />} /> */}

          {/* Main Routes */}
          <Route path='/' element={<Home />} />
          {/* <Route path='/howItWorks' element={<HowItWorks />} /> */}
          <Route path='/create' element={<Create setEvent={setEvent}/>} />
          <Route path='/created/:id' element={<Created event={event} getEventData={getEventData} />} />
          {/* <Route path='/event/:id/invitation' element={<Invitation eventData={event} setEvent={setEvent} checkEvent={checkEvent} />} /> */}
          <Route path='/event/:id' element={<Event eventData={event} checkEvent={checkEvent} addAttendee={addAttendee}/>} />
          <Route path='/aboutUs' element={<AboutUs />} />

        </Routes>
        <Footer />
      </ AnimatePresence>
    </>
  );
}

export default App;