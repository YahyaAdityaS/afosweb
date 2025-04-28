"use client";
import { useState, useEffect } from "react";
import { IMenu } from "@/app/types";
import { getCookie, storeCookie } from "@/lib/client-cookie";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { get } from "@/lib/api-bridge";
import { AlertInfo } from "@/components/alert/index";
import Search from "./search";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface MenuResponse {
  status: boolean;
  data: {
    status: boolean;
    data: IMenu[];
    message: string;
  };
}

const getMenu = async (search: string, token: string): Promise<IMenu[]> => {
  try {
    const url = `${BASE_API_URL}/menu?search=${search}`;
    const { data } = (await get(url, token)) as MenuResponse;
    return data?.status ? data.data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const postTransaction = async (transactionData: any, token: string) => {
  try {
    const url = `${BASE_API_URL}/order`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transactionData),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error posting transaction:", error);
    return null;
  }
};

const MenuPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const [menu, setMenu] = useState<IMenu[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [total, setTotal] = useState<number>(0);
  const [category, setCategory] = useState<string>("All");
  const [note, setNote] = useState("");

  // Detail Transaksi
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("new");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    const token = getCookie("token") || "";
    const fetchMenu = async () => {
      const data = await getMenu(search, token);
      setMenu(data);
    };
    fetchMenu();
  }, [search]);

  useEffect(() => {
    const savedCart = getCookie("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  
  useEffect(() => {
    storeCookie("cart", JSON.stringify(cart));
  }, [cart]);

  const renderCategory = (cat: string): React.ReactNode => {
    switch (cat) {
      case "FOOD":
        return (
          <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
            Food
          </span>
        );
      case "SNACK":
        return (
          <span className="bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
            Snack
          </span>
        );
      default:
        return (
          <span className="bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
            Drink
          </span>
        );
    }
  };

  const handleAddToCart = (menuId: number, price: number) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      updatedCart[menuId] = (updatedCart[menuId] || 0) + 1;
      setTotal((prevTotal) => prevTotal + price);
      return updatedCart;
    });
  };

  const handleRemoveFromCart = (menuId: number, price: number) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const currentCount = updatedCart[menuId] || 0;
      if (currentCount > 1) {
        updatedCart[menuId] = currentCount - 1;
        setTotal((prevTotal) => prevTotal - price);
      } else if (currentCount === 1) {
        delete updatedCart[menuId];
        setTotal((prevTotal) => prevTotal - price);
      }
      return updatedCart;
    });
  };

  const filteredMenu =
    category === "All"
      ? menu
      : menu.filter(
          (item) => item.category.toUpperCase() === category.toUpperCase()
        );

  const handleCheckout = async () => {
    const token = getCookie("token") || "";

    // Membuat objek transaksi sesuai dengan format yang diinginkan
    const transactionData = {
      customer: customerName, // Nama customer dari input
      table_number: tableNumber, // Nomor meja dari input
      payment_method: paymentMethod, // Metode pembayaran dari dropdown
      status: paymentStatus, // Status pembayaran dari dropdown
      order_list: Object.entries(cart)
        .map(([menuId, quantity]) => {
          const menuItem = menu.find((item) => item.id === parseInt(menuId));
          return menuItem
            ? {
                idMenu: menuItem.id, // ID Menu
                quantity: quantity, // Jumlah
                note: note, // Catatan jika diperlukan
              }
            : null;
        })
        .filter((item) => item !== null), // Filter jika ada item null
    };

    // Menambahkan data transaksi ke backend
    const result = await postTransaction(transactionData, token);

    if (result?.status) {
      alert("Transaction successful!");
      setCart({}); // Clear cart
      setTotal(0); // Reset total
      storeCookie("cart", JSON.stringify({})); // Clear cart in cookie
    } else {
      alert("Transaction failed. Please try again.");
    }    
  };

  return (
    <div className="m-4 bg-white rounded-lg p-6 border-t-4 border-t-primary shadow-lg">
      <h4 className="text-4xl pl-5 pt-5 font-bold mb-2 text-black">
        Menu Data
      </h4>
      <p className="text-black text-sm text-secondary mb-4 pl-5 pt-2">
        This page displays menu data, allowing users to view details, search,
        and manage menu items by adding, editing, or deleting them.
      </p>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center w-full max-w-md flex-grow pl-5 text-black">
          <Search url={`/cashier/pesanMakanan`} search={search} />
        </div>
      </div>

      <div className="flex pl-5 space-x-4 mb-6">
        {["All", "Food", "Drink", "Snack"].map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-lg ${
              category === cat
                ? "bg-sky-600 text-white"
                : "bg-primary text-sky-600 border border-sk"
            } transition-all duration-300 hover:bg-sky-400 hover:text-white hover:shadow-lg hover:scale-105`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredMenu.length === 0 ? (
        <AlertInfo title="Informasi">No data available</AlertInfo>
      ) : (
        <div className="flex">
          <div className="w-2/3 grid grid-cols-3 gap-4">
            {filteredMenu.map((data, index) => {
              const itemInCart = cart[data.id] || 0;
              return (
                <div
                  key={`keyMenu${index}`}
                  className="flex flex-col bg-white shadow-md rounded-lg p-4 border border-sky-100"
                >
                  <div className="flex justify-center mb-4">
                    <Image
                      width={400}
                      height={300}
                      src={`${BASE_IMAGE_MENU}/${data.picture}`}
                      className="rounded-md overflow-hidden w-full h-48 object-cover"
                      alt="Menu image"
                      unoptimized
                    />
                  </div>
                  <div className="mb-2 text-center">
                    <h5 className="text-xl font-semibold text-sky-600">
                      {data.name}
                    </h5>
                    <p className="text-gray-600">{data.description}</p>
                  </div>
                  <div className="flex justify-center mb-4">
                    <span className="text-lg font-semibold text-sky-600">
                      Rp{data.price}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="bg-red-500 text-white px-4 rounded-lg"
                      onClick={() => handleRemoveFromCart(data.id, data.price)}
                    >
                      -
                    </button>
                    <span className="text-blue-700 pt-2 mx-3">
                      {itemInCart}{" "}
                    </span>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg"
                      onClick={() => handleAddToCart(data.id, data.price)}
                    >
                      +
                    </button>
                  </div>

                  <div className="flex justify-center pt-5">
                    {renderCategory(data.category)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Transaction Section on the right */}
          <div className="w-1/3 ml-6">
            <h4 className="text-xl font-bold text-sky-600 mb-4">Transaksi</h4>
            <div className="bg-white p-4 shadow-md rounded-lg border border-sky-50 ">
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 mb-2 text-slate-900 border-sky-500 outline-none"
                  placeholder="Nama Customer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 mb-2 text-black border-sky-500 outline-none"
                  placeholder="Nomor Meja"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                />
                <select
                  className="w-full border rounded-md px-3 py-2 mb-2 text-black border-sky-600 outline-none"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="NEW" className="text-black">
                    New
                  </option>
                  <option value="PAID" className="text-black">
                    Paid
                  </option>
                  <option value="DONE" className="text-black ">
                    Done
                  </option>
                </select>
                <select
                  className="w-full border rounded-md px-3 py-2 text-black border-sky-600 outline-none"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="CASH" className="text-black">
                    Cash
                  </option>
                  <option value="QRIS" className="text-black">
                    Qris
                  </option>
                </select>
              </div>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 mb-2 text-black border-sky-600 outline-none"
                placeholder="Catatan (opsional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="flex flex-col gap-2 text-sky-600">
                {Object.entries(cart).map(([menuId, quantity]) => {
                  const menuItem = menu.find(
                    (item) => item.id === parseInt(menuId)
                  );
                  return (
                    menuItem && (
                      <div key={menuId} className="flex justify-between">
                        <span>{menuItem.name}</span>
                        <span>
                          {quantity} x Rp{menuItem.price}
                        </span>
                      </div>
                    )
                  );
                })}
              </div>
              <div className="flex justify-between mt-4">
                <h5 className="text-lg font-semibold text-sky-600">Total</h5>
                <span className="text-lg font-semibold text-sky-600">
                  Rp{total / 2}
                </span>
              </div>
              <button
                className="bg-sky-600 text-white p-2 rounded-lg w-full mt-4"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
