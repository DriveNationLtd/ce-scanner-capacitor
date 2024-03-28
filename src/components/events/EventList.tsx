import { useEffect, useState } from 'react'
import { useDB } from '../../context/DBProvider';
import { getAllEvents } from '../../utils/db';
import { Event, EventsResponse } from '../../types/event';
import Loader from "../../shared/Loader";
import { EventTile, EventTileSkeleton, NoEventsPlaceholder } from "./EventTile";
import { Suspense } from "react";

export const EventsAysnc: React.FC = () => {
    const { db } = useDB();
    const [data, setData] = useState<EventsResponse>();

    useEffect(() => {
        if (db) {
            getAllEvents(db).then((events) => {
                console.log("$$$ Events: ", JSON.stringify(events));
                setData({
                    success: true,
                    events,
                    count: events.length
                });
            });
        }
    }, []);

    return (
        <>
            {data && data.error && <p className='text-red-500'>{data.error}</p>}
            {data && data.isLocal && <p className='text-gray-300/70 text-xs mb-3 text-center'>You are using cached data</p>}

            {(data && data.events && !data.error && data.events.length > 0) ? (
                <div className='flex flex-col w-full'>
                    {data.events.map((event: Event, idx: number) => {
                        return <EventTile key={idx} event={event} />;
                    })}
                </div>
            ) : (
                <NoEventsPlaceholder />
            )}
        </>
    );
};

export const EventList: React.FC = () => {
    const { db } = useDB();
    const [events, setEvents] = useState<Event[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (db) {
            getAllEvents(db).then((events) => {
                setEvents(events);
                setLoading(false);
            });
        }
    }, [db]);

    return (
        <div className='container mx-auto px-4 w-full my-4'>
            <div className="my-4 flex flex-col w-full">
                <h1 className="text-3xl font-semibold mb-4 text-center mt-3">
                    Your Active Events
                </h1>

                {loading && <EventTileSkeleton />}
                {events && events.length === 0 && <NoEventsPlaceholder />}
                {events?.map((event) => (
                    <EventTile key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}