import EventCard from "./EventCard"
import { useSelector } from 'react-redux';

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <div>
      {!isLoading && (
        <div className="max-w-[1320px] mx-auto w-full px-4 lg:px-8 mt-10 font-jakarta">
        <div className="mb-4">
          <span className="text-label-sm uppercase tracking-wider text-tertiary font-bold">
            Limited Time
          </span>
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
            Popular Events
          </h1>
        </div>

        <div className="w-full grid">
            <EventCard data = {allEvents && allEvents[0]} />
        </div>
      </div>
      )}
    </div>
  )
}
export default Events