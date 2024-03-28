import { clsx } from "clsx";
import Loader from "./Loader";
import { useCallback } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    fullPageLoading?: boolean;
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ fullPageLoading, icon, loading, ...btnprops }) => {
    const renderIcon = useCallback(() => {
        if (!fullPageLoading && loading) {
            return <i className="ml-2 fas fa-spinner fa-spin"></i>
        }

        if (icon) {
            return <i className="ml-2 fas fa-chevron-right"></i>
        }
    }, [fullPageLoading, icon, loading]);
    return (
        <>
            {(loading && fullPageLoading) && <Loader />}
            <button
                {...btnprops}
                className={clsx(
                    "uppercase bg-theme-primary w-full hover:bg-theme-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
                    "disabled:cursor-not-allowed disabled:bg-theme-primary-light",
                    btnprops.className
                )}
            >
                {btnprops.children} {renderIcon()}
            </button>
        </>
    );
}