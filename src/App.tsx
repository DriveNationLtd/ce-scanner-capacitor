import { useEffect } from 'react';
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { useDB } from './context/DBProvider';
import { EventList } from './components/events/EventList';
import { insertEvent } from './utils/db';


const App = () => {
  // const { db } = useDB();

  // useEffect(() => {
  //   if (db) {
  //     // timestamp for id
  //     const timestamp = new Date().getTime();

  //     insertEvent({
  //       end_date: "2022-12-31 23:59:59",
  //       id: timestamp.toString(),
  //       image: "https://www.carevents.com/uk/wp-content/uploads/sites/3/2024/03/241685-TOT-SOCIAL_STREET_RS_1080x1080.jpg",
  //       start_date: "2022-03-01 00:00:00",
  //       status: "active",
  //       ticket_type: "free",
  //       title: "Car Show",
  //       orders: {
  //         scanned: 0,
  //         total: 0,
  //       }
  //     }, db).then((result) => {
  //       if (result) {
  //         console.log("$$$ Inserted event: ", JSON.stringify(result));
  //       }
  //     });
  //   }
  // }, [db]);

  return (
    <div className="container">
      <Header />
      <EventList />
      <div className="h-20"></div>
      <Footer />
    </div>
  )
}

export default App
