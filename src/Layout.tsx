import { Outlet } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

interface LayoutProps {
}

const Layout: React.FC<LayoutProps> = ({ }) => {
    return (
        <>
            <div className="container">
                <Header />
                <Outlet />
                <div className="h-20"></div>
                <Footer />
            </div>
        </>
    )
}

export default Layout;