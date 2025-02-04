// app/dashboard/page.tsx
import React from "react";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Dashboard Restoran</h1>
      
      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold text-black">Pendapatan</h2>
          <p className="text-2xl font-bold text-black">Rp500.000</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold text-black">Pesanan</h2>
          <p className="text-2xl font-bold text-black">25</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold text-black">Menu Terlaris</h2>
          <h2 className="text-2xl font-bold text-black">Mie Gacoan</h2>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold text-black">Rating</h2>
          <h2 className="text-2xl font-bold text-black">4.8 ⭐</h2>
        </div>
      </div>
      
      {/* Pesanan Terbaru */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-bold mb-4 text-black">Pesanan Terbaru</h2>
        <ul>
          <li className="border-b p-2">
            <span className="font-semibold text-black">Yahya</span> <div className="text-black">- Rp50.000 - Diproses</div>
          </li>
          <li className="border-b p-2">
            <span className="font-semibold text-black">Aditya</span> <div className="text-black">- Rp75.000 - Selesai</div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
