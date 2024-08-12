import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-screen bg-gray-100'>
      <nav className='w-64 bg-white shadow-lg'>
        <div className='p-4'>
          <h1 className='text-2xl font-bold'>Car Tracking System</h1>
        </div>
        <ul className='mt-4'>
          {[
            "dashboard",
            "users",
            "sims",
            "devices",
            "customers",
            "contracts",
          ].map((item) => (
            <li key={item} className='mb-2'>
              <Link
                href={`/${item}`}
                className='block p-2 hover:bg-gray-200 capitalize'
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className='flex-1 p-8'>
        <div className='flex justify-end mb-4'>
          <UserButton />
        </div>
        {children}
      </main>
    </div>
  );
};

export default Layout;
