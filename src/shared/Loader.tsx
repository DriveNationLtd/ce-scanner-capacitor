import { memo } from 'react';

const Loader: React.FC = () => {
    return (
        <div className='fixed inset-0 h-full w-full bg-black/80 z-50'>
            <img src='/assets/loading.svg' alt='loading' className='w-full h-full max-w-14 mx-auto' />
        </div>
    );
}


export default memo(Loader);