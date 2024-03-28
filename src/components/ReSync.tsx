import { useState } from "react";
import { useDB } from "../context/DBProvider";
import { Button } from "../shared/Button";
import { resyncData } from "../utils/db";

interface ReSyncProps {
    callback?: () => void;
}

export const ReSync: React.FC<ReSyncProps> = ({
    callback
}) => {
    const { db } = useDB();
    const [loading, setLoading] = useState(false);
    // const revalidater = useRevalidator();

    const handleReSync = async () => {
        if (!db) {
            console.error('$$$ in ReSync handleReSync no db');
            return;
        }

        setLoading(true);

        console.log('$$$ in ReSync handleReSync');
        await resyncData(db);

        setLoading(false);

        window.location.reload();
        if (callback) {
            callback();
        }
    };

    return (
        <Button
            onClick={handleReSync} disabled={!db || loading}
            loading={loading}
        >
            ReSync
        </Button>
    );
}