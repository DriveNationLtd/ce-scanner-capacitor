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
                <div className="h-16"></div>
                <Outlet />
                <div className="h-24"></div>
                <Footer />
            </div>
        </>
    )
}

export default Layout;