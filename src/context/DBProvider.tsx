
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

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
export const eventTableClearQuery = `DELETE FROM ${EVENT_TABLE};`;

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
            if (db) {
                console.log('$$$ DB already initialized', JSON.stringify(db));
                return;
            }

            const consistency = await CapacitorSQLite.checkConnectionsConsistency({
                dbNames: [DB_NAME],
                openModes: ['no-encryption'],
            });

            console.log('$$$ DB Connection consistency', JSON.stringify(consistency.result));
            const mSQLite = new SQLiteConnection(CapacitorSQLite);

            try {
                const connection = await mSQLite.createConnection(DB_NAME, false, 'no-encryption', 1, false);
                await connection.open();

                await connection.execute(eventTableQuery);
                // await connection.execute(eventTableQuery);
                setDb(connection);
            } catch (err) {
                console.error('Error initializing database:', err, mSQLite, db);
                // retrieve the connection if it exists
                const connection = await mSQLite.retrieveConnection(DB_NAME, false);
                setDb(connection);
                return;
            }
        };

        initDB();

        return () => {
            if (db) {
                db.close(); // Close the connection when the component unmounts
            }
        };
    }, []);

    return (
        <DBContext.Provider value={{ db }}>
            {children}
        </DBContext.Provider>
    );
}