
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { createContext, useContext, useState, useEffect } from 'react';
import { JSX as LocalJSX, applyPolyfills } from "jeep-sqlite/loader";
import { HTMLAttributes } from 'react';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite'
import { defineCustomElements as jeepSqlite } from "jeep-sqlite/loader";
import { CREATE_EVENTS_TABLE, CREATE_TICKETS_TABLE, DB_NAME, RESET_EVENTS_TABLE, RESET_TICKETS_TABLE } from '../types/db.constants';

type StencilToReact<T> = {
    [P in keyof T]?: T[P] & Omit<HTMLAttributes<Element>, 'className'> & {
        class?: string;
    };
};

declare global {
    export namespace JSX {
        interface IntrinsicElements extends StencilToReact<LocalJSX.IntrinsicElements> {
        }
    }
}

applyPolyfills().then(() => {
    jeepSqlite(window);
});

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
        const mSQLite = new SQLiteConnection(CapacitorSQLite);
        const platform = Capacitor.getPlatform();

        const initDB = async () => {
            if (db) {
                console.log('$$$ DB already initialized', JSON.stringify(db));
                return;
            }

            try {
                if (platform === "web") {
                    // add 'jeep-sqlite' Stencil component to the DOM
                    const jeepEl = document.createElement("jeep-sqlite");
                    document.body.appendChild(jeepEl);

                    if (!customElements.get('jeep-sqlite')) {
                        customElements.define('jeep-sqlite', JeepSqlite);
                    } else {
                        console.log('$$$ jeep-sqlite-v1 already defined');
                    }

                    // initialize the web store
                    await mSQLite.initWebStore();
                }

                const consistency = await CapacitorSQLite.checkConnectionsConsistency({
                    dbNames: [DB_NAME],
                    openModes: ['no-encryption'],
                });

                console.log('$$$ DB Connection consistency', JSON.stringify(consistency.result));

                const connection = await mSQLite.createConnection(DB_NAME, false, 'no-encryption', 1, false);
                await connection.open();

                // drop tables if they exist
                // await connection.execute(RESET_TICKETS_TABLE);
                // await connection.execute(RESET_EVENTS_TABLE);

                // create tables 
                await connection.execute(CREATE_EVENTS_TABLE);
                await connection.execute(CREATE_TICKETS_TABLE);
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
                mSQLite.closeConnection(DB_NAME, false);
            }
        };
    }, []);

    return (
        <DBContext.Provider value={{ db }}>
            {children}
        </DBContext.Provider>
    );
}