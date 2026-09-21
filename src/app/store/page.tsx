"use client";

import Image from "next/image";
import { Star, Share2, PlusSquare, MonitorSmartphone, ArrowRight, Cloud, Lock, Trash2, Info, MoreVertical, ChevronDown, Smartphone, Monitor, Tablet, Search, HelpCircle, Gamepad2, LayoutGrid, Book, Star as StarOutline, ChevronLeft, ChevronRight } from "lucide-react";

export default function PlayStoreFakePage() {
  const DOWNLOAD_URL = "https://github.com/shravani-agro/realspinpro_frontend/releases/latest/download/realspinpro.apk";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'RealSpinPro Casino',
          text: 'Play RealSpinPro Casino and Win Upto ₹5 Crores Daily!',
          url: 'https://realspinpro.com',
        });
      } else {
        navigator.clipboard.writeText('https://realspinpro.com');
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  const handlePageClick = (e: React.MouseEvent) => {
    // If the click is on a button or link, let it do its normal action
    if ((e.target as HTMLElement).closest('button, a')) {
      return;
    }
    // Otherwise, anywhere else clicked triggers the download
    window.location.href = DOWNLOAD_URL;
  };

  return (
    <main onClick={handlePageClick} className="min-h-screen bg-white text-[#202124] pb-16 md:pb-12 antialiased cursor-pointer" style={{ fontFamily: "'Google Sans', Roboto, Arial, sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.cdnfonts.com/css/google-sans-display');
        @import url('https://fonts.cdnfonts.com/css/google-sans');
        
        .font-display {
          font-family: 'Google Sans Display', 'Google Sans', Roboto, Arial, sans-serif !important;
        }
      `}} />

      {/* Top Navigation - Mobile & Desktop */}
      <nav className="flex items-center justify-between px-4 md:px-6 py-2.5 md:py-3 sticky top-0 bg-white z-50 shadow-sm md:shadow-none border-b border-transparent md:border-gray-100">
        <div className="flex items-center gap-4">
          <Image src="/googleplay.svg" alt="Google Play" width={140} height={40} className="w-[130px] md:w-[150px] h-auto" />
        </div>
        <div className="flex items-center gap-5 md:gap-6 text-[#5f6368]">
          <Search className="w-5 h-5 md:w-6 md:h-6 cursor-pointer" />
          <HelpCircle className="w-5 h-5 md:w-6 md:h-6 cursor-pointer" />
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 cursor-pointer shadow-sm">
            <Image src="/profiledummy.png" alt="Profile" width={32} height={32} className="w-full h-full object-cover" />
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="max-w-[1080px] mx-auto px-5 md:px-8 pt-6 md:pt-10">

        {/* ======================================= */}
        {/*           MOBILE HEADER BLOCK           */}
        {/* ======================================= */}
        <div className="md:hidden flex flex-col mb-4">

          <div className="flex gap-5 items-start mb-6">
            <div className="shrink-0 drop-shadow-md rounded-[16px] overflow-hidden w-[72px] h-[72px] flex items-center justify-center border border-gray-100">
              <Image src="/playicon.png" alt="RealSpinPro Icon" width={80} height={80} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="font-display text-[22px] font-medium leading-tight text-[#202124] tracking-tight">
                RealSpinPro Casino
              </h1>
              <p className="text-[#01875f] font-medium text-[14px] mt-1 tracking-tight">RealSpinPro Games - Play Together</p>
              <p className="text-[#5f6368] text-[12px] mt-0.5">Contains ads · In-app purchases</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 mb-6 max-w-sm mx-auto w-full">
            <div className="flex flex-col items-center justify-center">
              <div className="font-medium flex items-center gap-0.5 text-[14px] text-[#202124]">
                4.9 <Star className="w-3 h-3 fill-[#202124] text-[#202124] -mt-0.5" />
              </div>
              <p className="text-[#5f6368] text-[12px] mt-0.5">344K reviews</p>
            </div>

            <div className="w-px h-6 bg-gray-200"></div>

            <div className="flex flex-col items-center justify-center">
              <div className="border border-[#202124] font-bold text-[9px] px-1 rounded-[2px] leading-tight mb-0.5 mt-0.5">18+</div>
              <p className="text-[#5f6368] text-[12px] mt-0.5 flex items-center gap-1">Rated for 18+ <Info className="w-3 h-3" /></p>
            </div>

            <div className="w-px h-6 bg-gray-200"></div>

            <div className="flex flex-col items-center justify-center">
              <div className="font-medium text-[14px] text-[#202124]">10M+</div>
              <p className="text-[#5f6368] text-[12px] mt-0.5">Downloads</p>
            </div>
          </div>

          <a
            href={DOWNLOAD_URL}
            className="block w-full bg-[#01875f] text-white text-center font-medium py-2 rounded-[8px] text-[14px] mb-4 hover:bg-[#01704f] transition-colors"
          >
            Install
          </a>

          <div className="flex items-center justify-center gap-10 text-[#01875f] font-medium text-[14px] mb-6">
            <button onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share
            </button>
            <button className="flex items-center gap-2">
              <PlusSquare className="w-5 h-5" />
              Add to wishlist
            </button>
          </div>

          <div className="flex items-center gap-3 text-[#5f6368] mb-6 px-1">
            <MonitorSmartphone className="w-5 h-5 shrink-0" />
            <p className="text-[12px]">This app is available for all of your devices</p>
          </div>
        </div>

        {/* ======================================= */}
        {/*           DESKTOP HEADER BLOCK          */}
        {/* ======================================= */}
        <div className="hidden md:flex flex-row items-start justify-between gap-12 mb-10">

          <div className="flex-1">
            <h1 className="font-display text-[44px] font-normal leading-[1.1] text-[#202124] tracking-tight mb-3">
              RealSpinPro Casino
            </h1>
            <p className="text-[#01875f] font-medium text-[16px] tracking-tight mb-1">
              RealSpinPro Games - Play Together
            </p>
            <p className="text-[#5f6368] text-[14px] mb-8">
              Contains ads · In-app purchases
            </p>

            <div className="flex items-center justify-start gap-12 mb-8">
              <div className="flex flex-col items-start justify-center">
                <div className="font-medium flex items-center gap-1 text-[16px] text-[#202124]">
                  4.9 <Star className="w-4 h-4 fill-[#202124] text-[#202124] -mt-0.5" />
                </div>
                <p className="text-[#5f6368] text-[13px] mt-1">344K reviews</p>
              </div>

              <div className="w-px h-8 bg-gray-200"></div>

              <div className="flex flex-col items-center justify-center">
                <div className="border border-[#202124] font-bold text-[12px] px-1.5 py-0.5 rounded-[2px] leading-tight mb-1 mt-0.5">18+</div>
                <p className="text-[#5f6368] text-[13px] mt-0.5 flex items-center gap-1">Rated for 18+ <Info className="w-3.5 h-3.5" /></p>
              </div>

              <div className="w-px h-8 bg-gray-200"></div>

              <div className="flex flex-col items-center justify-center">
                <div className="font-medium text-[16px] text-[#202124]">10M+</div>
                <p className="text-[#5f6368] text-[13px] mt-1">Downloads</p>
              </div>
            </div>

            <div className="max-w-[400px]">
              <a
                href={DOWNLOAD_URL}
                className="block w-full bg-[#01875f] text-white text-center font-medium py-2.5 rounded-[24px] text-[15px] mb-6 hover:bg-[#01704f] transition-colors"
              >
                Install
              </a>

              <div className="flex items-center justify-start gap-8 text-[#01875f] font-medium text-[14px] mb-6">
                <button onClick={handleShare} className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors z-10 relative">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors z-10 relative">
                  <PlusSquare className="w-5 h-5" />
                  Add to wishlist
                </button>
              </div>

              <div className="flex items-center justify-start gap-3 text-[#5f6368] mb-6">
                <MonitorSmartphone className="w-5 h-5" />
                <p className="text-[14px]">This app is available for all of your devices</p>
              </div>
            </div>
          </div>

          <div className="shrink-0 pt-2">
            <div className="drop-shadow-2xl rounded-[44px] overflow-hidden w-[260px] h-[260px] flex items-center justify-center border border-gray-100">
              <Image src="/playicon.png" alt="RealSpinPro Icon" width={300} height={300} className="w-full h-full object-cover" />
            </div>
          </div>

        </div>

        {/* Desktop Two-Column Content Layout (Applies to Mobile as Single Column) */}
        <div className="flex flex-col md:flex-row gap-8">

          {/* Main Left Content */}
          <div className="flex-1 min-w-0">
            {/* Screenshots Carousel */}
            <div className="relative mb-8 group">
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-5 px-5 md:mx-0 md:px-0">
                {[
                  "/4.jpeg",
                  "/1.jpeg",
                  "/5.jpeg",
                  "/2.jpeg",
                  "/3.jpeg",
                ].map((src, idx) => (
                  <div key={idx} className="shrink-0 w-[146px] h-[260px] md:w-[213px] md:h-[380px] bg-black rounded-[12px] md:rounded-[16px] overflow-hidden snap-center relative shadow-sm border border-gray-200">
                    <Image src={src} alt={`Screenshot ${idx + 1}`} fill sizes="(max-width: 768px) 146px, 213px" className="object-cover" />
                  </div>
                ))}
              </div>

              <button className="hidden md:flex absolute top-1/2 -left-5 -translate-y-1/2 w-10 h-10 bg-white shadow-lg border border-gray-100 rounded-full items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-gray-50">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="hidden md:flex absolute top-1/2 -right-5 -translate-y-1/2 w-10 h-10 bg-white shadow-lg border border-gray-100 rounded-full items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-gray-50">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* About this game */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="font-display text-[20px] md:text-[24px] font-normal text-[#202124]">About this game</h2>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-[#5f6368] cursor-pointer" />
              </div>
              <div className="text-[#5f6368] text-[14px] md:text-[15px] leading-relaxed mb-6 max-w-3xl">
                LUCKY SLOTS & Online CASINO GAMES<br />
                Welcome to a sophisticated sanctuary of social casino. RealSpinPro Casino invites you to experience the glitz and glamour of Las Vegas-style slots with a touch of class. Join a vibrant community of millions in a destination tailored for players who seek high-quality gameplay, fair mechanics, and massive jackpots!
              </div>

              <h3 className="text-[14px] md:text-[15px] font-medium text-[#202124] mb-1">Updated on</h3>
              <p className="text-[#5f6368] text-[14px] md:text-[15px] mb-6">Sep 11, 2026</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                {['Casino', 'Slots', 'Casual', 'Multiplayer', 'Competitive multiplayer', 'Stylized', 'Competitive', 'Modern'].map(tag => (
                  <span key={tag} className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-full text-[#5f6368] text-[13px] md:text-[14px] font-medium cursor-pointer hover:bg-gray-50 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Data safety */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="font-display text-[20px] md:text-[24px] font-normal text-[#202124]">Data safety</h2>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-[#5f6368] cursor-pointer" />
              </div>
              <p className="text-[#5f6368] text-[14px] md:text-[15px] leading-relaxed mb-4 md:mb-6 max-w-3xl">
                Safety starts with understanding how developers collect and share your data. Data privacy and security practices may vary based on your use, region, and age. The developer provided this information and may update it over time.
              </p>

              <div className="border border-gray-200 rounded-[8px] p-5 max-w-3xl">
                <div className="flex gap-4 mb-5">
                  <Share2 className="w-5 h-5 md:w-6 md:h-6 text-[#5f6368] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#5f6368] text-[14px] md:text-[15px]">This app may share these data types with third parties</p>
                    <p className="text-[#5f6368] text-[12px] md:text-[13px] mt-0.5">Personal info, App activity, and Device or other IDs</p>
                  </div>
                </div>

                <div className="flex gap-4 mb-5">
                  <Cloud className="w-5 h-5 md:w-6 md:h-6 text-[#5f6368] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#5f6368] text-[14px] md:text-[15px]">This app may collect these data types</p>
                    <p className="text-[#5f6368] text-[12px] md:text-[13px] mt-0.5">Personal info, Messages and 3 others</p>
                  </div>
                </div>

                <div className="flex gap-4 mb-5">
                  <Lock className="w-5 h-5 md:w-6 md:h-6 text-[#5f6368] shrink-0 mt-0.5" />
                  <p className="text-[#5f6368] text-[14px] md:text-[15px]">Data is encrypted in transit</p>
                </div>

                <div className="flex gap-4 mb-5">
                  <Trash2 className="w-5 h-5 md:w-6 md:h-6 text-[#5f6368] shrink-0 mt-0.5" />
                  <p className="text-[#5f6368] text-[14px] md:text-[15px]">You can request that data be deleted</p>
                </div>

                <button className="text-[#01875f] text-[14px] md:text-[15px] font-medium hover:bg-emerald-50 px-2 py-1 -ml-2 rounded transition-colors">See details</button>
              </div>
            </div>

            {/* Ratings and reviews */}
            <div className="mb-8 max-w-3xl">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <h2 className="font-display text-[20px] md:text-[24px] font-normal text-[#202124]">Ratings and reviews</h2>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-[#5f6368] cursor-pointer" />
              </div>
              <p className="text-[#5f6368] text-[12px] md:text-[14px] flex items-center gap-1 mb-6">
                Ratings and reviews are verified <Info className="w-3 h-3 md:w-4 md:h-4" />
              </p>

              {/* Filters */}
              <div className="flex gap-2 mb-6">
                <button className="bg-[#e6f4ea] text-[#01875f] px-4 py-1.5 md:py-2 rounded-full text-[13px] md:text-[14px] font-medium flex items-center gap-2 transition-colors">
                  <Smartphone className="w-4 h-4 md:w-5 md:h-5" /> Phone
                </button>
                <button className="border border-gray-300 text-[#5f6368] px-4 py-1.5 md:py-2 rounded-full text-[13px] md:text-[14px] font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                  <Monitor className="w-4 h-4 md:w-5 md:h-5" /> Chromebook
                </button>
                <button className="border border-gray-300 text-[#5f6368] px-4 py-1.5 md:py-2 rounded-full text-[13px] md:text-[14px] font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                  <Tablet className="w-4 h-4 md:w-5 md:h-5" /> Tablet
                </button>
              </div>

              {/* Rating Summary */}
              <div className="flex gap-6 md:gap-10 items-center mb-8">
                <div className="flex flex-col items-center">
                  <span className="font-display text-[48px] md:text-[64px] font-normal text-[#202124] leading-none mb-1">4.2</span>
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(4)].map((_, i) => <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-[#01875f] text-[#01875f]" />)}
                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-[#01875f] text-[#01875f] opacity-50" />
                  </div>
                  <span className="text-[#5f6368] text-[11px] md:text-[13px]">308K reviews</span>
                </div>

                <div className="flex-1 flex flex-col gap-1 md:gap-2">
                  {[
                    { label: '5', width: '70%' },
                    { label: '4', width: '15%' },
                    { label: '3', width: '5%' },
                    { label: '2', width: '2%' },
                    { label: '1', width: '8%' },
                  ].map(bar => (
                    <div key={bar.label} className="flex items-center gap-3 md:gap-4">
                      <span className="text-[11px] md:text-[13px] text-[#5f6368] w-2">{bar.label}</span>
                      <div className="flex-1 h-2.5 md:h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#01875f] rounded-full" style={{ width: bar.width }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review 1 */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#5d4037] text-white flex items-center justify-center text-[14px] md:text-[16px]">E</div>
                    <span className="text-[14px] md:text-[15px] text-[#202124]">Elijah</span>
                  </div>
                  <MoreVertical className="w-5 h-5 text-[#5f6368] cursor-pointer" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 md:w-3 md:h-3 fill-[#01875f] text-[#01875f]" />)}
                  </div>
                  <span className="text-[#5f6368] text-[12px] md:text-[13px]">August 25, 2026</span>
                </div>
                <p className="text-[#5f6368] text-[13px] md:text-[15px] leading-relaxed">
                  Been a free player this whole time currently on lvl 1996 my daily free reward is in the trillions. I dont see where everyone is saying you hit a pay wall in this game . you win some you loose some thats slots its a game of luck nothing else . if every machine had a high chance of winning imagine how boring that'll be . the game play is fluid the added social element is refreshing the payouts are more than fair . the only con I have is the very high point amount you need to get a card you need .
                </p>
              </div>

              {/* Review 2 */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#7b1fa2] text-white flex items-center justify-center text-[14px] md:text-[16px]">J</div>
                    <span className="text-[14px] md:text-[15px] text-[#202124]">Janet Owen</span>
                  </div>
                  <MoreVertical className="w-5 h-5 text-[#5f6368] cursor-pointer" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(2)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 md:w-3 md:h-3 fill-[#01875f] text-[#01875f]" />)}
                    {[...Array(3)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-300" />)}
                  </div>
                  <span className="text-[#5f6368] text-[12px] md:text-[13px]">July 13, 2026</span>
                </div>
                <p className="text-[#5f6368] text-[13px] md:text-[15px] leading-relaxed mb-3 md:mb-4">
                  I've been playing this game for over 10 years now and have seen many changes, some good, some not so good. One of the not so good ones is the black lottery tickets. The only way to earn them is to spend money to upgrade your tasks to the premium edition so you can play the specific game to earn the tickets. How about you give us a way to earn the tickets without making us always have to pay for it. I do spend money in here, but really folks, every time those tickets are available, ridiculous.
                </p>
                <p className="text-[#5f6368] text-[12px] md:text-[13px] mb-3">4 people found this review helpful</p>
                <div className="flex items-center gap-3 text-[#5f6368] text-[13px] md:text-[14px]">
                  Did you find this helpful?
                  <button className="border border-gray-300 hover:bg-gray-50 px-4 md:px-5 py-1 md:py-1.5 rounded-full transition-colors">Yes</button>
                  <button className="border border-gray-300 hover:bg-gray-50 px-4 md:px-5 py-1 md:py-1.5 rounded-full transition-colors">No</button>
                </div>
              </div>

              <button className="text-[#01875f] text-[14px] md:text-[15px] font-medium mt-2 hover:bg-emerald-50 px-2 py-1 -ml-2 rounded transition-colors">See all reviews</button>
            </div>

            {/* What's new */}
            <div className="mb-6 md:mb-8 border-t border-gray-100 pt-6 md:pt-8 max-w-3xl">
              <h2 className="font-display text-[20px] md:text-[24px] font-normal text-[#202124] mb-4 md:mb-6">What's new</h2>
              <p className="text-[#5f6368] text-[14px] md:text-[15px] leading-relaxed">
                Hey, Spinners!<br />
                Exciting news from RealSpinPro Casino! Billy and the team are working hard, fine-tuning every spin, squashing pesky bugs, and sprinkling a bit of magic to ensure you feel the ultimate casino excitement.<br />
                Keep your game updated to keep enjoying the latest Slots and features!<br />
                Let's play together and #StayHuuuge! Happy Spinning!
              </p>
            </div>

            {/* App support */}
            <div className="flex items-center justify-between py-4 md:py-6 border-t border-gray-100 max-w-3xl cursor-pointer">
              <h2 className="font-display text-[20px] md:text-[24px] font-normal text-[#202124]">App support</h2>
              <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-[#5f6368]" />
            </div>

          </div>

          {/* Desktop Right Column: Meta Info */}
          <div className="hidden md:block w-[320px] shrink-0 pt-4">
            {/* Age Rating Card (as seen in desktop screenshot) */}
            <div className="border border-gray-200 rounded-[12px] p-5 mb-6">
              <div className="flex gap-4">
                <div className="border border-black font-bold text-[16px] px-1.5 py-0.5 rounded-[2px] self-start leading-none mt-1">18+</div>
                <div>
                  <p className="text-[#202124] text-[15px] font-medium">Rated for 18+</p>
                  <p className="text-[#5f6368] text-[13px] mt-1">Simulated Gambling</p>
                  <p className="text-[#5f6368] text-[13px] mt-3 leading-relaxed">Users Interact, In-Game Purchases (Includes Random Items)</p>
                  <button className="text-[#01875f] text-[13px] font-medium mt-3 hover:underline">Learn more</button>
                </div>
              </div>
            </div>

            {/* App Support Dropdown in right column for desktop */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer">
              <h2 className="text-[16px] font-medium text-[#202124]">App support</h2>
              <ChevronDown className="w-5 h-5 text-[#5f6368]" />
            </div>

            <div className="py-4">
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <h2 className="text-[16px] font-medium text-[#202124]">Similar games</h2>
                <ArrowRight className="w-5 h-5 text-[#5f6368]" />
              </div>

              {/* Similar Game Item */}
              <div className="flex gap-4 items-center cursor-pointer hover:bg-gray-50 p-2 -ml-2 rounded-lg transition-colors">
                <div className="w-14 h-14 rounded-[12px] overflow-hidden shrink-0 shadow-sm border border-gray-100">
                  <Image src="/playicon.png" alt="Similar game" width={56} height={56} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[#202124] text-[13px] font-medium leading-tight line-clamp-1">Double Win Slots- Vegas Casino</p>
                  <p className="text-[#5f6368] text-[12px] mt-1">Royal Slot Casino</p>
                  <div className="text-[#5f6368] text-[11px] mt-0.5 flex items-center gap-0.5">
                    4.1 <Star className="w-2.5 h-2.5 fill-[#5f6368] text-[#5f6368]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-between items-center px-4 pb-safe z-50 h-[68px] shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        <button className="flex-1 flex flex-col items-center justify-center gap-1.5 text-[#5f6368] hover:bg-gray-50 h-full rounded-full transition-colors">
          <Gamepad2 className="w-6 h-6" />
          <span className="text-[11px] font-medium">Games</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center gap-1.5 text-[#01875f] hover:bg-gray-50 h-full rounded-full transition-colors">
          <LayoutGrid className="w-6 h-6 fill-[#01875f]" />
          <span className="text-[11px] font-medium">Apps</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center gap-1.5 text-[#5f6368] hover:bg-gray-50 h-full rounded-full transition-colors">
          <Book className="w-6 h-6" />
          <span className="text-[11px] font-medium">Books</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center gap-1.5 text-[#5f6368] hover:bg-gray-50 h-full rounded-full transition-colors">
          <StarOutline className="w-6 h-6" />
          <span className="text-[11px] font-medium">Kids</span>
        </button>
      </div>

    </main>
  );
}
