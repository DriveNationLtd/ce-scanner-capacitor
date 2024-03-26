import { useEffect, useState } from 'react'
import { useDB } from '../../context/DBProvider';
import { getAllEvents } from '../../utils/db';
import { Event, EventsResponse } from '../../types/event';
import Loader from "../../shared/Loader";
import { EventTile, NoEventsPlaceholder } from "./EventTile";
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
        } else {
            console.log('$$$ No database connection', JSON.stringify(db));

            setData((prev) => ({
                ...prev,
                success: false,
                error: 'Database not available'
            }));
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

    useEffect(() => {
        if (db) {
            getAllEvents(db).then((events) => {
                console.log("$$$ Events: ", JSON.stringify(events));
                setEvents(events);
            });
        }
    }, [db]);

    return (
        <div className='container mx-auto px-4 w-full my-4'>
            <div className="my-4 flex flex-col w-full">
                <h1 className="text-3xl font-semibold mb-4 text-center">
                    Your Events
                </h1>
                {events?.map((event) => (
                    <EventTile key={event.id} event={event} />
                ))}
            </div>
        </div>
    );

    // const { db } = useDB();
    // const [data, setData] = useState<EventsResponse>();

    // useEffect(() => {
    //     if (db) {
    //         getAllEvents(db).then((events) => {
    //             console.log("$$$ Events: ", JSON.stringify(events));
    //             setData({
    //                 success: true,
    //                 events,
    //                 count: events.length
    //             });
    //         });
    //     } else {
    //         console.log('$$$ No database connection', JSON.stringify(db));

    //         setData((prev) => ({
    //             ...prev,
    //             success: false,
    //             error: 'Database not available'
    //         }));
    //     }
    // }, []);

    // return (
    //     <div className='container mx-auto px-4 w-full my-4'>
    //         <div className="my-4 flex flex-col w-full">
    //             <h1 className="text-3xl font-semibold mb-4 text-center">
    //                 Your Events
    //             </h1>
    //             <>
    //                 {data && data.error && <p className='text-red-500'>{data.error}</p>}
    //                 {data && data.isLocal && <p className='text-gray-300/70 text-xs mb-3 text-center'>You are using cached data</p>}

    //                 {(data && data.events && !data.error && data.events.length > 0) ? (
    //                     <div className='flex flex-col w-full'>
    //                         {data.events.map((event: Event, idx: number) => {
    //                             return <EventTile key={idx} event={event} />;
    //                         })}
    //                     </div>
    //                 ) : (
    //                     <NoEventsPlaceholder />
    //                 )}
    //             </>
    //         </div>
    //     </div >
    // );
}