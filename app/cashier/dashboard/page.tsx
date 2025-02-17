import Image from "next/image";

const DashboardPage = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 m-2">
        <div className="flex border border-red justify-center bg-rose-600">
            <Image src="/fooder/public/image/restaurant.png" alt="gambar" width={150} height={200}/>
        </div>
        <div className="flex border border-red justify-center bg-sky-600">02</div>
        <div className="flex border border-red justify-center bg-yellow-600">03</div>
        <div className="flex border border-red justify-center bg-green-600">04</div>
        <div className="flex border border-red justify-center bg-purple-600">05</div>
        <div className="flex border border-red justify-center bg-pink-600">06</div>
      </div>
    </>
  );
};
export default DashboardPage;
