'use client';
import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaStar, FaBellConcierge, FaClockRotateLeft } from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';
import Profile from "@/public/image/restaurant.png";
import { BASE_API_URL } from "@/global";
import { getCookie } from "@/lib/client-cookie"; 
import { get } from "@/lib/api-bridge";
import { IMenu } from '@/app/types';

interface MenuResponse {
  status: boolean;
  data: {
    length: number | PromiseLike<number>;
    status: boolean;
    data: IMenu[];
    message: string;
  };
}

const getMenuCount = async (): Promise<number> => {
  try {
    const token = getCookie("token") ?? "";
    const url = `${BASE_API_URL}/menu`;
    const response = await get(url, token) as MenuResponse;
    
    if (response.status) {
      return response.data.length;
      
    }
    return 0;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    
    return 0;
  }
};

const Dashboard = () => {
  const [menuCount, setMenuCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchMenuCount = async () => {
      const count = await getMenuCount();
      setMenuCount(count);
    };

    fetchMenuCount();
  }, []);

  return (
    <div className="flex">
      <div className="flex-grow min-h-screen bg-gray-100">
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Overview
                  </h2>
                  <Image src={Profile} width={50} height={50} alt="Profile" className="rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <DashboardCard icon={<FaClipboardList size={24} />} title="Menus" value={menuCount} color="bg-blue-500" />
                  <DashboardCard icon={<FaStar size={24} />} title="Menu Favorite" value={0} color="bg-green-500" />
                  <DashboardCard icon={<FaBellConcierge size={24} />} title="Pesan Makanan" value={0} color="bg-yellow-500" />
                  <DashboardCard icon={<FaClockRotateLeft size={24} />} title="Riwayat Pemesanan" value={0} color="bg-red-500" />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">Quick Links</h3>
                  <div className="flex space-x-4 mt-4">
                    <QuickLink href="/cashier/menu" icon={<FaClipboardList />} text="Menus" color="bg-blue-500" />
                    <QuickLink href="/cashier/menu_favorite" icon={<FaStar />} text="Menu Favorite" color="bg-green-500" />
                    <QuickLink href="/cashier/pesan_makanan" icon={<FaBellConcierge />} text="Pesan Makanan" color="bg-yellow-500" />
                    <QuickLink href="/cashier/history" icon={<FaClockRotateLeft />} text="Riwayat Pemesanan" color="bg-red-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | null;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, value, color }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
      <div className={`p-3 mr-4 ${color} text-white rounded-full`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-lg font-semibold text-gray-700">
          {value !== null ? value : <span className="animate-pulse">...</span>}
        </p>
      </div>
    </div>
  );
};

interface QuickLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  color: string;
}

const QuickLink: React.FC<QuickLinkProps> = ({ href, icon, text, color }) => {
  return (
    <Link href={href} className={`flex items-center px-4 py-2 ${color} text-white rounded-lg shadow-md hover:brightness-110`}>
      {icon}
      <span className="ml-2">{text}</span>
    </Link>
  );
};

export default Dashboard;
