// https://github.com/capacitor-community/sqlite/blob/master/docs/SQLiteTransaction.md
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Event, EventTicket, EventsResponse, TicketScanResponse } from '../types/event';
import { getEvents, redeemTicket, verifyScan } from '../actions/VerifyScan';
import { EVENT_TABLE, TICKET_TABLE } from '../types/db.constants';

export const syncEvents = async (db: SQLiteDBConnection, data: EventsResponse) => {
    try {
        // Loop through the events and insert them into the database
        // await db.beginTransaction();
        if (data && data.events) {
            data.events.forEach(async (event: Event) => {
                await insertEvent(event, db);
            })
        }
        // await db.commitTransaction();
    } catch (err) {
        console.log(`$$$ in syncEvents error ${err} $$$`);
        return null;
    }
}

export const insertEvent = async (event: Event, db: SQLiteDBConnection) => {
    const query = `INSERT INTO ${EVENT_TABLE} (id, ticket_type, title, start_date, end_date, status, image, venue, total_orders, scanned_orders, orders_error)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        event.id,
        event.ticket_type,
        event.title,
        event.start_date,
        event.end_date,
        event.status,
        event.image,
        event.venue,
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

export const syncEventTickets = async (event_id: string, tickets: EventTicket[], db: SQLiteDBConnection) => {
    try {
        await db.run(`DELETE FROM ${TICKET_TABLE} WHERE event_id = ?`, [event_id]);

        if (tickets) {
            tickets.forEach(async (ticket: EventTicket) => {
                await insertEventTicket(ticket, db);
            })
        }
    } catch (err) {
        console.log(`$$$ in syncEventTickets error ${err} $$$`);
        return null;
    }
}

export const insertEventTicket = async (ticket: EventTicket, db: SQLiteDBConnection) => {
    const query = `INSERT INTO ${TICKET_TABLE} (
        event_id,
        order_id,
        order_item_id,
        ticket_id,
        ticket_name,
        ticket_price,
        decoded_qr_code,
        ticket_scanned_at,
        date_created_gmt,
        order_status,
        billing_first_name,
        billing_last_name,
        car_make,
        car_model,
        car_reg,
        concours
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    const values = [
        ticket.event_id,
        ticket.order_id,
        ticket.order_item_id,
        ticket.ticket_id,
        ticket.ticket_name,
        ticket.ticket_price,
        ticket.decoded_qr_code,
        ticket.ticket_scanned_at,
        ticket.date_created_gmt,
        ticket.order_status,
        ticket.billing_first_name,
        ticket.billing_last_name,
        ticket.car_make,
        ticket.car_model,
        ticket.car_reg,
        ticket.concours
    ];

    try {
        const insert = await db.run(query, values);
        return insert
    } catch (error) {
        console.error('Error inserting event ticket:', error);
        return null;
    }
};

export const getAllEvents = async (db: SQLiteDBConnection): Promise<Event[] | []> => {
    const query = `SELECT * FROM ${EVENT_TABLE};`;

    try {
        const result = await db?.query(query);
        if (!result.values || result.values.length === 0) {
            const data = await getEvents();
            if (data.success) {
                await syncEvents(db, data);
                return data.events ?? [];
            }
        }
        return result.values ?? [];
    } catch (error) {
        console.error(`$$$ Error getting all events: `, error);
        return [];
    }
};

export const resyncData = async (db: SQLiteDBConnection) => {
    // clear all tables
    try {
        await db.run(`DELETE FROM ${TICKET_TABLE}`);
        await db.run(`DELETE FROM ${EVENT_TABLE}`);

        // get all events
        await getEvents();
    } catch (error) {
        console.error('Error resyncing data:', error);
    }
}

export const getEventById = async (db: SQLiteDBConnection, event_id: string): Promise<Event | null> => {
    const query = `SELECT * FROM ${EVENT_TABLE} WHERE id = ?;`;
    const values = [event_id];

    try {
        const result = await db.query(query, values);
        const event_data = result.values

        if (!event_data || event_data.length === 0) {
            return null;
        }

        return event_data[0];
    } catch (error) {
        console.error(`$$$ Error getting event by id: `, error);
        return null;
    }
}

export const verifyScanLocally = async (db: SQLiteDBConnection, qr_code: string): Promise<TicketScanResponse> => {
    const query = `SELECT * FROM ${TICKET_TABLE} WHERE decoded_qr_code = ?;`;
    const values = [qr_code];

    try {
        const result = await db.query(query, values);
        const ticket_data = result.values

        if (!ticket_data || ticket_data.length === 0) {
            console.log('$$$ Ticket not found locally, verifying scan online');
            const response = await verifyScan(qr_code);
            console.log('$$$ Response from online verification: ', JSON.stringify(response));
            return response;
        }

        const ticket = ticket_data[0];
        const ticket_scanned_at = ticket.ticket_scanned_at;

        const event_id = ticket.event_id;
        const event = await getEventById(db, event_id);

        return {
            success: true,
            error: ticket_scanned_at ? 'Ticket already scanned' : '',
            data: {
                event: {
                    event_date: event?.start_date ?? 'Synchronizating Error',
                    event_name: event?.title ?? 'Synchronizating Error',
                    event_id: event_id,
                    event_venue: event?.venue ?? 'Synchronizating Error',
                },
                ticket,
            },
            ticket_scanned_at
        }
    } catch (error) {
        console.error(`$$$ Error verifying scan locally: `, error);
        return {
            success: false,
            error: 'Internal Server Error',
        };
    }
}

export const checkIfEventTicketsSynced = async (event_id: string, db: SQLiteDBConnection): Promise<boolean> => {
    const query = `SELECT * FROM ${TICKET_TABLE} WHERE event_id = ?;`;
    const values = [event_id];

    try {
        const result = await db.query(query, values);
        const tickets = result.values

        return tickets && tickets.length > 0 ? true : false;
    } catch (error) {
        console.error(`$$$ Error checking if event tickets synced: `, error);
        return false;
    }
}

export const redeemTicketLocally = async (db: SQLiteDBConnection, order_item_id: string): Promise<any> => {

    try {
        const query1 = `SELECT * FROM ${TICKET_TABLE} WHERE order_item_id = ?;`;
        const values1 = [order_item_id];

        const result = await db.query(query1, values1);
        const ticket_data = result.values

        if (!ticket_data || ticket_data.length === 0) {
            const response = await redeemTicket(order_item_id);
            return response;
        }

        const ticket = ticket_data[0];
        const ticket_scanned_at = ticket.ticket_scanned_at;

        if (ticket_scanned_at) {
            return {
                success: false,
                error: 'Ticket already scanned',
            };
        }

        const query = `UPDATE ${TICKET_TABLE} SET ticket_scanned_at = ? WHERE order_item_id = ?;`;
        const values = [new Date().toISOString(), order_item_id];

        await db.run(query, values);

        // if done locally, then try to sync with the server in the background
        syncTicketScan(order_item_id);

        return {
            success: true,
            ticket_scanned_at: new Date().toISOString(),
            order_item_id,
        };
    } catch (error) {
        console.error(`$$$ Error redeeming ticket locally: `, error);
        return {
            success: false,
            error: 'Internal Server Error',
        };
    }
}

export const syncTicketScan = async (order_item_id: string) => {
    try {
        const response = await redeemTicket(order_item_id);
        if (response.success) {
            console.log('$$$ Syncing ticket scan response: ', JSON.stringify(response));
        } else {
            console.error('$$$ Error syncing ticket scan response: ', response.error);
        }
    } catch (error) {
        console.error(`$$$ Error syncing ticket scan: `, error);
    }
}