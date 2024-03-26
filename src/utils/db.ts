// https://github.com/capacitor-community/sqlite/blob/master/docs/SQLiteTransaction.md
// https://www.youtube.com/watch?v=U65a0T3W6uY
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { EVENT_TABLE } from '../context/DBProvider';
import { Event } from '../types/event';

export const syncEvents = async (db: SQLiteDBConnection) => {
    try {
        return null
    } catch (err) {
        console.log(`$$$ in syncEvents error ${err} $$$`);
        return null;
    }
}

// Function to insert event into database
export const insertEvent = async (event: Event, db: SQLiteDBConnection) => {
    const query = `INSERT INTO ${EVENT_TABLE} (id, ticket_type, title, start_date, end_date, status, image, total_orders, scanned_orders, error)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        event.id,
        event.ticket_type,
        event.title,
        event.start_date,
        event.end_date,
        event.status,
        event.image,
        event.orders ? event.orders.total : null,
        event.orders ? event.orders.scanned : null,
        event.orders ? event.orders.error : null
    ];

    try {
        const insert = await db.run(query, values);
        return insert
    } catch (error) {
        console.error('Error inserting event:', error);
        return null;
    }
};

// Function to get all events from the database
export const getAllEvents = async (db: SQLiteDBConnection): Promise<Event[] | []> => {
    // select all from cc_events
    const query = `SELECT * FROM ${EVENT_TABLE};`;

    try {
        const result = await db?.query(query);
        return result.values ?? [];
    } catch (error) {
        console.error(`$$$ Error getting all events: `, error); // `Error getting all events: ${error.message}
        return [];
    }
};
