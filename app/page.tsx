import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-900 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-100 px-16 bg-green-900 pt-20">
        <Image
          src="enviromental_Image_V2.svg"
          alt="enviromental_Concious_logo"
          width={300}
          height={20}
          priority
        />
        <div className="flex flex-col items-center text-center sm:items-start bg-white rounded-xl">
          <div className="flex flex col sm:items-start sm:text-left m-4 gap-4">
           {/* Location Input */}
                <div className="flex items-center gap-3 flex-1 border border-gray-200 rounded-xl px-4 py-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8c0 7-7.5 12-7.5 12S4.5 15 4.5 8a7.5 7.5 0 1115 0z"/>
                    </svg>
                    <input type="text" placeholder="Where do you want to go?"className="w-full outline-none text-gray-700 placeholder-gray-400"/>
                </div> 
            {/* Date Input */}
                <div className="flex items-center gap-3 flex-1 border border-gray-200 rounded-xl px-4 py-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <input type="dateRamge" placeholder="Select dates" className="w-full outline-none text-gray-700 placeholder-gray-400"/>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"/>
                    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
                </div>
            {/* Explore Button */}
                <button className="flex items-center gap-2 bg-green-900 hover:bg-gray-200 text-white font-medium px-6 py-3 rounded-xl transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>Explore
                </button>
          </div>
        </div>
      </main>
    </div>
  );
}
