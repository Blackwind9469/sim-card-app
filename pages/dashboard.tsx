import { useState, useEffect } from "react";
import { PrismaClient } from "@prisma/client";

export default function Dashboard() {
  const [stats, setStats] = useState({
    simCount: 0,
    deviceCount: 0,
    customerCount: 0,
    userCount: 0,
    contractCount: 0,
    nearDueContracts: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const response = await fetch("/api/dashboard");
    const data = await response.json();
    setStats(data);
  };

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
      <div className='grid grid-cols-3 gap-4'>
        <div className='bg-white p-4 shadow'>
          <h2 className='font-bold'>Sims</h2>
          <p>{stats.simCount}</p>
        </div>
        <div className='bg-white p-4 shadow'>
          <h2 className='font-bold'>Devices</h2>
          <p>{stats.deviceCount}</p>
        </div>
        <div className='bg-white p-4 shadow'>
          <h2 className='font-bold'>Customers</h2>
          <p>{stats.customerCount}</p>
        </div>
        <div className='bg-white p-4 shadow'>
          <h2 className='font-bold'>Users</h2>
          <p>{stats.userCount}</p>
        </div>
        <div className='bg-white p-4 shadow'>
          <h2 className='font-bold'>Contracts</h2>
          <p>{stats.contractCount}</p>
        </div>
        <div className='bg-white p-4 shadow'>
          <h2 className='font-bold'>Near Due Contracts</h2>
          <p>{stats.nearDueContracts}</p>
        </div>
      </div>
    </div>
  );
}
