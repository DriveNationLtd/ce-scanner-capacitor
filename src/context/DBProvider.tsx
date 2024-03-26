
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { createContext, useContext, useState, useEffect } from 'react';

const DB_NAME = 'test';
export const EVENT_TABLE = 'cc_events';
export const eventTableQuery = `CREATE TABLE IF NOT EXISTS ${EVENT_TABLE} (
    id TEXT PRIMARY KEY,
    ticket_type TEXT,
    title TEXT,
    start_date TEXT,
    end_date TEXT,
    status TEXT,
    image TEXT,
    total_orders INTEGER,
    scanned_orders INTEGER,
    error TEXT
);`;

interface DatabaseContextType {
    db: SQLiteDBConnection | null;
}

const DBContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDB = (): DatabaseContextType => {
    const context = useContext(DBContext);
    if (!context) {
        throw new Error('useDB must be used within a DBProvider');
    }
    return context;
};


export const DBProvider = ({ children }: { children: React.ReactNode }) => {
    const [db, setDb] = useState<SQLiteDBConnection | null>(null);

    useEffect(() => {
        const initDB = async () => {
            // check if connection to db exists
            if (db) {
                console.log('Database already initialized');
                return;
            }

            const mSQLite = new SQLiteConnection(CapacitorSQLite);
            try {
                const connection = await mSQLite.createConnection(DB_NAME, false, 'no-encryption', 1, false);
                await connection.open();

                await connection.execute(eventTableQuery);
                setDb(connection);
            } catch (err) {
                console.error('Error initializing database:', err);
            }
        };

        initDB();

        return () => {
            if (db) {
                db.close(); // Close the connection when the component unmounts
            }
        };
    }, [db]); // Run this effect only once

    return (
        <DBContext.Provider value={{ db }}>
            {children}
        </DBContext.Provider>
    );
}