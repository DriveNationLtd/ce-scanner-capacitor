import { getEventScanProgress } from "../../actions/VerifyScan";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { EventTicketProgressResponse } from "../../types/event";

interface EventScanProgressProps {
    event_id: string;
}

export const EventScanProgressSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col bg-theme-dark">
            {[1, 2, 3].map((index) => (
                <div key={index} className="flex justify-between border-t p-4 shadow animate-pulse">
                    <span className="bg-white/70 h-2 rounded w-36"></span>
                    <span className="bg-white/70 h-2 rounded w-12"></span>
                </div>
            ))}
        </div>
    );
}

export const EventScanProgress: React.FC<EventScanProgressProps> = ({ event_id }) => {
    const [data, setData] = useState<EventTicketProgressResponse>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getEventScanProgress(event_id).then((progress) => {
            setData(progress);
            setLoading(false);
        }).catch((err) => {
            console.error('Error getting event:', err);
            setData({
                success: false,
                error: 'Internal Server Error'
            });
            setLoading(false);
        });


    }, [event_id]);



    const renderPage = () => {
        if (!data) {
            return null;
        }

        const { progress, error, success } = data;
        if (error || !success) {
            return (
                <div className="text-center text-red-500">
                    {error ?? "Internal Server Error"}
                </div>
            );
        }

        if (!progress) {
            return (
                <div className="text-center text-red-500">
                    No tickets found
                </div>
            );
        }

        return (
            Object.entries(progress).map(([ticketId, ticketInfo]) => (
                <div key={ticketId} className="flex justify-between border-t p-4">
                    <span className="text-white/70 text-xs font-medium">{ticketInfo.name}</span>
                    <span className="text-white/70 text-xs">
                        <span className={clsx(
                            ticketInfo.scanned === ticketInfo.sold ? "text-green-500" : ""
                        )}>
                            {ticketInfo.scanned}
                        </span>
                        /{ticketInfo.sold}</span>
                </div>
            ))
        )
    }


    return (
        <div className="flex flex-col bg-theme-dark">
            {loading && <EventScanProgressSkeleton />}
            {renderPage()}
        </div>
    );
}