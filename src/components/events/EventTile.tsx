import { Event } from '../../types/event';
import { formatDate } from '../../utils/date';
import { Link } from '../Link';

interface EventTileProps {
    event: Event;
}

export const EventTile: React.FC<EventTileProps> = ({ event }) => {
    const { title, start_date, image, total_orders, scanned_orders, orders_error } = event;
    const formattedDate = formatDate(start_date);

    return (
        <Link href={`/events/${event.id}`}>
            <div className="relative flex items-center gap-3 p-4 w-full rounded-md mb-2 bg-theme-dark border-none bg-opacity-90 overflow-hidden cursor-pointer">
                <div className="w-1/4 mr-4">
                    <div className="relative w-full h-0 min-w-[100px] max-w-[100px] lg:max-w-none" style={{ paddingBottom: '100%' }}>
                        <img src={image} alt={title} className="" />
                    </div>
                </div>
                <div className="flex flex-col justify-between flex-grow mt-2">
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
                    <div className="absolute inset-0 -z-10 bg-black opacity-60"></div>
                    <img src={image} alt={title} className="absolute inset-0 -z-10" />
                </div>
                {/* right chevron */}
                <i className="fas fa-chevron-right text-sm text-gray-300"></i>
            </div>
        </Link>
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