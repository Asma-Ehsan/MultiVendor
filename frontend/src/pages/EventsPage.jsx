import React, { useEffect } from "react";
import Header from "../components/Layout/Header";
import EventCard from "../components/Events/EventCard";
import { useSelector } from "react-redux";
import Loader from "../components/Layout/Loader";
import Footer from "../components/Layout/Footer";
const EventsPage = () => {
  
  const { allEvents, isLoading } = useSelector((state) => state.events);
  
  useEffect(() => {
      window.scrollTo(0, 0);
  },[])
  
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-background font-jakarta">
          <Header activeHeading={4} />
          <div className="max-w-[1320px] mx-auto w-full px-4 lg:px-8 mt-10 mb-10">
            <EventCard active={true} data={allEvents && allEvents[0]} />
          </div>
          <Footer/>
        </div>
      )}
    </>
  );
};
export default EventsPage;