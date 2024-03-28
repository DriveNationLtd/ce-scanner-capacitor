
// Constants
export const DB_NAME = 'test';
export const EVENT_TABLE = 'cc_events';
export const TICKET_TABLE = 'cc_tickets';

// Queries
export const CREATE_EVENTS_TABLE = `CREATE TABLE IF NOT EXISTS ${EVENT_TABLE} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_type TEXT,
    title TEXT,
    venue TEXT,
    start_date TEXT,
    end_date TEXT,
    status TEXT,
    image TEXT,
    total_orders INTEGER,
    scanned_orders INTEGER,
    orders_error TEXT
);`;

export const RESET_EVENTS_TABLE = `DROP TABLE ${EVENT_TABLE};`;

export const CREATE_TICKETS_TABLE = `CREATE TABLE IF NOT EXISTS ${TICKET_TABLE} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id TEXT,
    order_id TEXT,
    order_item_id TEXT,
    ticket_id TEXT,
    ticket_name TEXT,
    ticket_price TEXT,
    decoded_qr_code TEXT,
    ticket_scanned_at TEXT,
    date_created_gmt TEXT,
    order_status TEXT,
    billing_first_name TEXT,
    billing_last_name TEXT,
    car_make TEXT,
    car_model TEXT,
    car_reg TEXT,
    concours TEXT,
    FOREIGN KEY (event_id) REFERENCES ${EVENT_TABLE}(id)
);`;


export const RESET_TICKETS_TABLE = `DROP TABLE ${TICKET_TABLE};`;