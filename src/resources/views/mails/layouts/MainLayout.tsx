import '@/resources/css/styles.css';
import { PropsWithChildren } from 'hono/jsx';

export default function MainLayout({children}: PropsWithChildren<{}>) {
    return (
        <div className='p-10 bg-slate-200 min-h-screen'>
            <main className="container max-w-screen-md mx-auto bg-white rounded-3xl border p-7">
                <header className='p-2 text-center mb-10'>
                    <h1 className='text-3xl font-bold text-blue-500'>Pooling App</h1>
                </header>

                {children}

                <br />
                <p>Regards Voting ID</p>
                <p>Voting App</p>
                <br />

                <footer className='border-t-2 pt-4 mt-5 flex justify-between'>
                    <span>Pooling App &copy; {new Date().getFullYear()} - All Rights Reserved</span>
                    <span>Powered by <a href="https://hono.dev">Hono</a></span>
                </footer>
            </main>
        </div>
    )
};
