import { Link } from 'react-router-dom';
import { Event } from '../../types/event';
import { formatDate } from '../../utils/date';
import { Button } from '../../shared/Button';
import { useEffect, useState } from 'react';
import { getEventTickets } from '../../actions/VerifyScan';
import { useConnectiviy } from '../../hooks/useConnectivity';
import { checkIfEventTicketsSynced, syncEventTickets } from '../../utils/db';
import { useDB } from '../../context/DBProvider';

interface EventTileProps {
    event: Event;
}

export const EventTile: React.FC<EventTileProps> = ({ event }) => {
    const { isOnline } = useConnectiviy();
    const { db } = useDB();

    const { title, start_date, image, total_orders, scanned_orders, orders_error } = event;
    const [loading, setLoading] = useState(false);
    const formattedDate = formatDate(start_date);

    const [ticketsSynced, setTicketsSynced] = useState(false);
    useEffect(() => {
        if (db) {
            checkIfEventTicketsSynced(event.id, db)
                .then((synced) => {
                    console.log('Tickets synced', synced);
                    setTicketsSynced(synced);
                });
        }
    }, []);

    const handleSync = async () => {
        if (!isOnline) return alert('You are offline, please connect to the internet to sync');
        if (!db) return alert('Database not available');

        console.log('Syncing event', event.id);
        setLoading(true);

        const data = await getEventTickets(event.id);

        if (data.success && data.tickets) {
            const { tickets } = data;
            if (tickets.length === 0) {
                alert('No tickets found for this event');
                return;
            }

            await syncEventTickets(event.id, tickets, db);
            setTicketsSynced(true);
        } else {
            console.error('Error syncing event', event.id, data.error);
            alert(data.error);
        }

        setLoading(false);
    }

    const syncBtnText = () => {
        if (loading) return 'Syncing...';
        if (ticketsSynced) return 'Resync';
        return 'Sync Tickets';
    }

    return (
        <div className="relative flex items-center gap-3 p-4 w-full rounded-md mb-2 bg-theme-dark border-none bg-opacity-90 overflow-hidden cursor-pointer">
            <Link to={`/events/${event.id}`}>
                <div className="w-1/4 mr-4">
                    <div className="relative w-full min-w-[100px] max-w-[100px] lg:max-w-none h-full">
                        <img src={image} alt={title} className="" />
                    </div>
                </div>
            </Link>

            <div className="flex flex-col justify-between flex-grow mt-2">
                <Link to={`/events/${event.id}`}>
                    <div className='flex items-start justify-start flex-col'>
                        <h2 className="font-bold mb-2 text-md text-white">{title}</h2>
                        <p className="text-gray-300 text-xs">{formattedDate}</p>
                        {(!orders_error) && (
                            <div className="order-items-status text-xs mt-2 text-white">
                                Scanned: <span className='text-green-500'>{scanned_orders}</span>/<span>{total_orders}</span>
                            </div>
                        )}

                        {(orders_error) && (
                            <p className="text-red-500 text-xs mt-2">{orders_error}</p>
                        )}
                    </div>
                </Link>
                <div className="absolute inset-0 -z-10 bg-black opacity-60"></div>
                <img src={image} alt={title} className="absolute inset-0 -z-10 object-cover w-full" />
                <Button className='text-xs w-fit my-3' onClick={handleSync} loading={loading} disabled={!isOnline || (orders_error ? true : false)}>
                    {syncBtnText()}
                </Button>
            </div>
            {/* right chevron */}
            <Link to={`/events/${event.id}`}>
                <i className="fas fa-chevron-right text-sm text-gray-300"></i>
            </Link>
        </div>
    );
}

export const EventTileSkeleton: React.FC = () => {
    return (
        <>
            {[1, 2, 3, 4].map((_, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 w-full rounded-md mb-2 bg-theme-dark border-none bg-opacity-90 animate-pulse">
                    <div className="w-1/4 mr-4">
                        <div className="w-full h-0 min-w-[100px] max-w-[100px] lg:max-w-none bg-gray-300 rounded-lg" style={{ paddingBottom: '100%' }}></div>
                    </div>
                    <div className="flex flex-col justify-between flex-grow mt-2">
                        <div className='flex items-start justify-start flex-col'>
                            <div className="w-1/2 h-4 bg-gray-300 mb-2 rounded-lg"></div>
                            <div className="w-1/4 h-3 bg-gray-300 rounded-lg"></div>
                        </div>
                    </div>
                    <i className="fas fa-chevron-right text-sm text-gray-300"></i>
                </div>
            ))}
        </>
    );
}

export const NoEventsPlaceholder: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full mt-10">
            <h1 className="text-2xl font-semibold mb-2">No Events</h1>
            <p className="text-gray-300">You have no events to display</p>
        </div>
    );
}