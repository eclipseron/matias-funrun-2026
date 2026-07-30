"use client"
import { useState, useEffect } from "react";


export const CountDownHeader = ({ countdownInfo }) => {
  const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: false
    });
    
    useEffect(() => {
      if (!countdownInfo) return;
      const { targetDate } = countdownInfo;

      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;
  
        if (difference <= 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
          return;
        }
  
        const msInDay = 24 * 60 * 60 * 1000;
        const msInHour = 60 * 60 * 1000;
        const msInMinute = 60 * 1000;
  
        const days = Math.floor(difference / msInDay);
        const hours = Math.floor((difference % msInDay) / msInHour);
        const minutes = Math.floor((difference % msInHour) / msInMinute);
        const seconds = Math.floor((difference % msInMinute) / 1000);
  
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      };
  
      calculateTimeLeft();
      const interval = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(interval);
    }, [countdownInfo?.targetDate, countdownInfo?.label]);

  if (!countdownInfo) return null; // Hide countdown when event is over
  const { label } = countdownInfo;

  return (
    <div className="bg-brand-dark text-brand-white pt-4 pb-8 px-4 border-b border-slate-800">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase mb-4">
          {label}
        </h2>

        {timeLeft.isExpired ? (
          <div className="text-xl font-bold text-red-500 uppercase tracking-wider py-2">
            Waktu Habis (Silakan muat ulang halaman)
          </div>
        ) : (
          <div className="flex flex-row justify-center items-center gap-1.5 sm:gap-3 max-w-xl mx-auto w-full px-2">
            {/* Box Hari */}
            <div className="bg-brand-dark-light border border-slate-700 flex-1 min-w-0 p-2 sm:p-3 rounded-none text-center">
              <div className="text-xl sm:text-3xl md:text-4xl font-extrabold font-mono text-brand-white tracking-tight leading-none">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-[8px] sm:text-[10px] text-sky-300 font-mono uppercase tracking-wider mt-1 sm:mt-2">Hari</div>
            </div>

            <div className="text-xs sm:text-xl font-bold text-slate-600 select-none">:</div>

            {/* Box Jam */}
            <div className="bg-brand-dark-light border border-slate-700 flex-1 min-w-0 p-2 sm:p-3 rounded-none text-center">
              <div className="text-xl sm:text-3xl md:text-4xl font-extrabold font-mono text-brand-white tracking-tight leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-[8px] sm:text-[10px] text-sky-300 font-mono uppercase tracking-wider mt-1 sm:mt-2">Jam</div>
            </div>

            <div className="text-xs sm:text-xl font-bold text-slate-600 select-none">:</div>

            {/* Box Menit */}
            <div className="bg-brand-dark-light border border-slate-700 flex-1 min-w-0 p-2 sm:p-3 rounded-none text-center">
              <div className="text-xl sm:text-3xl md:text-4xl font-extrabold font-mono text-brand-white tracking-tight leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-[8px] sm:text-[10px] text-sky-300 font-mono uppercase tracking-wider mt-1 sm:mt-2">Menit</div>
            </div>

            <div className="text-xs sm:text-xl font-bold text-slate-600 select-none">:</div>

            {/* Box Detik */}
            <div className="bg-brand-dark-light border border-slate-700 flex-1 min-w-0 p-2 sm:p-3 rounded-none text-center">
              <div className="text-xl sm:text-3xl md:text-4xl font-extrabold font-mono text-brand-white tracking-tight leading-none">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-[8px] sm:text-[10px] text-sky-300 font-mono uppercase tracking-wider mt-1 sm:mt-2">Detik</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}