import { component$, useStore, $ } from '@builder.io/qwik';

export default component$(() => {
  // --- Game State ---
  const state = useStore({
    step: 1, // 1=Flavor, 2=Shape, 3=Name, 4=Eat
    flavor: 'milk', // milk, dark, white
    shape: 'heart', // heart, circle, square
    name: '',
    bites: 0,
  });

  // --- Logic: Play Sound (Max 3 Seconds) ---
  const handleBite = $(() => {
    if (state.bites < 4) {
      const audio = new Audio('/bite.mp3');
      audio.volume = 0.5;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {}); 
      }

      // Stop audio after 3 seconds
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 3000);

      state.bites++;
    }
  });

  const resetGame = $(() => {
    state.step = 1;
    state.bites = 0;
    state.name = '';
  });

  // --- Helper: Get Color Class ---
  const getColor = (flavor: string) => {
    if (flavor === 'white') return 'bg-[#FDF5E6] text-amber-900 border-amber-200 fill-[#FDF5E6]';
    if (flavor === 'dark') return 'bg-[#3E2723] text-pink-100 border-[#5D4037] fill-[#3E2723]';
    return 'bg-[#795548] text-white border-[#8D6E63] fill-[#795548]'; // Milk
  };

  return (
    // Main Background: Burgundy (#4a0316)
    <div class="min-h-screen bg-[#4a0316] flex flex-col items-center justify-center font-sans p-4 transition-all">
      
      <h1 class="text-4xl md:text-5xl font-extrabold text-pink-200 mb-8 drop-shadow-sm tracking-tight text-center">
        🍫 Chocolate Maker for Valentine's
      </h1>

      {/* UPDATED: Box Background is now #F9B9CA */}
      <div class="bg-[#F9B9CA] p-8 rounded-3xl shadow-xl w-full max-w-md border-b-8 border-pink-400 relative overflow-hidden min-h-[500px] flex flex-col">
        
        {/* Progress Bar (Darker pink to stand out) */}
        <div class="absolute top-0 left-0 h-2 bg-pink-600 transition-all duration-500" style={{ width: `${(state.step / 4) * 100}%` }}></div>

        {/* --- STEP 1: FLAVOR --- */}
        {state.step === 1 && (
          <div class="animate-fadeIn flex-1 flex flex-col justify-center">
            <h2 class="text-2xl font-bold text-[#4a0316] mb-6 text-center">Choose a Flavor</h2>
            <div class="space-y-4">
              <button onClick$={() => { state.flavor = 'milk'; state.step = 2; }} class="w-full p-4 rounded-xl bg-[#795548] text-white font-bold text-lg hover:scale-105 transition shadow-md border-2 border-[#5D4037]">Milk Chocolate</button>
              <button onClick$={() => { state.flavor = 'white'; state.step = 2; }} class="w-full p-4 rounded-xl bg-[#FDF5E6] text-amber-900 border-2 border-amber-100 font-bold text-lg hover:scale-105 transition shadow-md">White Chocolate</button>
              <button onClick$={() => { state.flavor = 'dark'; state.step = 2; }} class="w-full p-4 rounded-xl bg-[#3E2723] text-pink-100 font-bold text-lg hover:scale-105 transition shadow-md border-2 border-[#2D1B18]">Dark Chocolate</button>
            </div>
          </div>
        )}

        {/* --- STEP 2: SHAPE --- */}
        {state.step === 2 && (
          <div class="animate-fadeIn text-center flex-1 flex flex-col justify-center">
            <h2 class="text-2xl font-bold text-[#4a0316] mb-6">Pick a Shape</h2>
            
            <div class="grid grid-cols-3 gap-4 mb-8">
              {/* Heart Button */}
              <button onClick$={() => { state.shape = 'heart'; state.step = 3; }} class="group flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-pink-300 hover:border-pink-600 hover:bg-white/30 transition">
                <svg viewBox="0 0 24 24" class={`w-14 h-14 transition-transform group-hover:scale-110 ${getColor(state.flavor)} rounded-none bg-transparent border-0`}>
                   <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span class="text-sm font-bold text-[#4a0316]">Heart</span>
              </button>
              
              {/* Circle Button */}
              <button onClick$={() => { state.shape = 'circle'; state.step = 3; }} class="group flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-pink-300 hover:border-pink-600 hover:bg-white/30 transition">
                <div class={`w-14 h-14 rounded-full shadow-sm transition-transform group-hover:scale-110 ${getColor(state.flavor)}`}></div>
                <span class="text-sm font-bold text-[#4a0316]">Circle</span>
              </button>

              {/* Square Button */}
              <button onClick$={() => { state.shape = 'square'; state.step = 3; }} class="group flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-pink-300 hover:border-pink-600 hover:bg-white/30 transition">
                <div class={`w-14 h-14 rounded-md shadow-sm transition-transform group-hover:scale-110 ${getColor(state.flavor)}`}></div>
                <span class="text-sm font-bold text-[#4a0316]">Square</span>
              </button>
            </div>

            <button onClick$={() => state.step = 1} class="text-[#4a0316] opacity-70 hover:opacity-100 underline">Back</button>
          </div>
        )}

        {/* --- STEP 3: NAME --- */}
        {state.step === 3 && (
          <div class="animate-fadeIn text-center flex-1 flex flex-col justify-center">
            <h2 class="text-2xl font-bold text-[#4a0316] mb-2">Who is this for?</h2>
            <p class="text-[#4a0316] text-sm mb-6 opacity-80">Write their name on the chocolate!</p>
            
            <input 
              type="text" 
              placeholder="e.g., My Valentine" 
              class="w-full p-4 bg-white/50 border-2 border-pink-300 rounded-xl text-center text-xl font-bold text-[#4a0316] placeholder-pink-800/40 focus:outline-none focus:border-[#4a0316] mb-6"
              onInput$={(e) => state.name = (e.target as HTMLInputElement).value}
              maxLength={12}
            />
            
            <button 
              disabled={!state.name}
              onClick$={() => { if (state.name) state.step = 4; }}
              class="w-full py-4 rounded-xl bg-[#4a0316] text-pink-100 font-bold text-xl shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Finish! ❤️
            </button>
            <button onClick$={() => state.step = 2} class="mt-4 text-[#4a0316] opacity-70 hover:opacity-100 underline">Back</button>
          </div>
        )}

        {/* --- STEP 4: EAT --- */}
        {state.step === 4 && (
          <div class="animate-fadeIn text-center flex-1 flex flex-col items-center justify-center">
            {state.bites < 4 ? (
              <>
                <h2 class="text-2xl font-bold text-[#4a0316] mb-2">Happy Valentine's Day!</h2>
                <p class="text-lg text-[#4a0316] mb-8">
                  <span class="font-bold">{state.name}</span>, eat your chocolate!
                </p>

                {/* THE CHOCOLATE CONTAINER */}
                <div 
                  onClick$={handleBite}
                  class="relative cursor-pointer transition-transform active:scale-95 duration-100 select-none w-64 h-64 flex items-center justify-center"
                >
                  
                  {/* --- RENDER THE SHAPE --- */}
                  
                  {state.shape === 'heart' && (
                    <svg viewBox="0 0 24 24" class={`w-full h-full drop-shadow-2xl ${getColor(state.flavor)} rounded-none bg-transparent border-0`}>
                       <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  )}

                  {state.shape === 'circle' && (
                    <div class={`w-56 h-56 rounded-full shadow-2xl flex items-center justify-center ${getColor(state.flavor)}`}></div>
                  )}

                  {state.shape === 'square' && (
                    <div class={`w-56 h-56 rounded-3xl shadow-2xl flex items-center justify-center ${getColor(state.flavor)}`}></div>
                  )}

                  {/* TEXT OVERLAY (Centered) */}
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span class={`text-3xl font-handwriting font-bold opacity-90 transform -rotate-6 z-10 ${state.flavor === 'white' ? 'text-pink-600' : 'text-pink-100'}`}>
                      {state.name}
                    </span>
                  </div>

                  {/* BITE MASKS (The "Invisibility Cloak" circles) */}
                  {/* UPDATED: These must match the background #F9B9CA to look invisible */}
                  {state.bites >= 1 && <div class="absolute -top-4 -right-4 w-36 h-36 bg-[#F9B9CA] rounded-full pointer-events-none"></div>}
                  {state.bites >= 2 && <div class="absolute -bottom-4 -right-4 w-36 h-36 bg-[#F9B9CA] rounded-full pointer-events-none"></div>}
                  {state.bites >= 3 && <div class="absolute -top-4 -left-4 w-36 h-36 bg-[#F9B9CA] rounded-full pointer-events-none"></div>}
                  
                  {/* Click Hint */}
                  {state.bites === 0 && <div class="absolute -bottom-10 left-0 right-0 text-[#4a0316] text-sm animate-bounce opacity-70">(Click me!)</div>}
                </div>
              </>
            ) : (
              // FINISHED STATE
              <div class="py-10 animate-bounce">
                <div class="text-7xl mb-4">😋</div>
                <h2 class="text-3xl font-bold text-[#4a0316] mb-6">Delicious!</h2>
                <p class="text-[#4a0316] mb-8">Hope you liked it, {state.name}!</p>
                <button onClick$={resetGame} class="px-8 py-3 bg-white text-[#4a0316] rounded-full font-bold hover:bg-pink-100 transition shadow-lg">
                  Replay ↺
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
});