import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header className="border-b border-slate-100 bg-white">
        <nav className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-14">

          {/* LOGO */}
          <a href="#home" className="flex items-center gap-2.5">
            <div className="flex items-center gap-[3px]">

              <span className="h-5 w-[3px] rounded-full bg-indigo-600" />
              <span className="h-8 w-[3px] rounded-full bg-indigo-600" />
              <span className="h-4 w-[3px] rounded-full bg-indigo-600" />
              <span className="h-7 w-[3px] rounded-full bg-indigo-600" />
              <span className="h-3 w-[3px] rounded-full bg-indigo-600" />

            </div>

            <span className="text-[22px] font-extrabold tracking-tight text-slate-900">
              SpeakSprint
              <span className="text-indigo-600"> AI</span>
            </span>
          </a>


          {/* NAVIGATION */}
          <div className="hidden items-center gap-8 lg:flex">

            <a
              href="#home"
              className="text-[14px] font-medium text-slate-900 transition hover:text-indigo-600"
            >
              Home
            </a>

            <a
              href="#features"
              className="text-[14px] font-medium text-slate-600 transition hover:text-indigo-600"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-[14px] font-medium text-slate-600 transition hover:text-indigo-600"
            >
              How It Works
            </a>

            <a
              href="#pricing"
              className="text-[14px] font-medium text-slate-600 transition hover:text-indigo-600"
            >
              Pricing
            </a>

            <a
              href="#faq"
              className="text-[14px] font-medium text-slate-600 transition hover:text-indigo-600"
            >
              FAQ
            </a>

          </div>


          {/* AUTH BUTTONS */}
          <div className="hidden items-center gap-3 sm:flex">

            <button className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
              Log in
            </button>

            <button className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700">
              Sign up
            </button>

          </div>


          {/* MOBILE MENU */}
          <button className="rounded-lg border border-slate-200 p-2.5 lg:hidden">

            <svg
              className="h-5 w-5 text-slate-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>

          </button>

        </nav>
      </header>


      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section id="home" className="overflow-hidden bg-white">

        <div className="mx-auto grid min-h-[500px] max-w-[1440px] items-center px-6 py-16 sm:px-10 lg:grid-cols-2 lg:px-14 lg:py-20">

          {/* LEFT HERO */}
          <div className="max-w-[590px]">

            <h1 className="text-[42px] font-extrabold leading-[1.12] tracking-[-1.5px] text-slate-950 sm:text-[52px] lg:text-[58px]">

              Speak for
              <br />

              60 Seconds.
              <br />

              <span className="text-indigo-600">
                Improve
              </span>{" "}
              for a Lifetime.

            </h1>


            <p className="mt-6 max-w-[510px] text-[16px] leading-7 text-slate-600 sm:text-[17px]">

              AI-powered speaking practice that analyzes your speech
              and helps you become a confident communicator.

            </p>


            {/* HERO BUTTONS */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <button className="rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700">

                Start Speaking Now

              </button>


              <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">

                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-400">

                  <svg
                    className="ml-[1px] h-2.5 w-2.5 fill-slate-700"
                    viewBox="0 0 10 10"
                  >
                    <path d="M2 1l7 4-7 4V1z" />
                  </svg>

                </span>

                Watch Demo

              </button>

            </div>

          </div>


          {/* RIGHT MICROPHONE ILLUSTRATION */}
          <div className="relative mt-12 flex min-h-[360px] items-center justify-center lg:mt-0">

            {/* SOFT CIRCLE */}
            <div className="absolute h-[320px] w-[320px] rounded-full bg-indigo-50 sm:h-[370px] sm:w-[370px]" />

            <div className="absolute h-[270px] w-[270px] rounded-full border-[18px] border-indigo-50 sm:h-[310px] sm:w-[310px]" />


            {/* SOUND WAVE LEFT */}
            <div className="absolute left-[5%] flex items-center gap-1 sm:left-[3%]">

              <span className="h-8 w-[4px] rounded-full bg-indigo-400" />
              <span className="h-16 w-[4px] rounded-full bg-indigo-500" />
              <span className="h-11 w-[4px] rounded-full bg-indigo-500" />
              <span className="h-24 w-[4px] rounded-full bg-indigo-600" />
              <span className="h-14 w-[4px] rounded-full bg-indigo-500" />
              <span className="h-32 w-[4px] rounded-full bg-indigo-600" />

            </div>


            {/* SOUND WAVE RIGHT */}
            <div className="absolute right-[5%] flex items-center gap-1 sm:right-[3%]">

              <span className="h-32 w-[4px] rounded-full bg-indigo-600" />
              <span className="h-14 w-[4px] rounded-full bg-indigo-500" />
              <span className="h-24 w-[4px] rounded-full bg-indigo-600" />
              <span className="h-11 w-[4px] rounded-full bg-indigo-500" />
              <span className="h-16 w-[4px] rounded-full bg-indigo-500" />
              <span className="h-8 w-[4px] rounded-full bg-indigo-400" />

            </div>


            {/* MICROPHONE */}
            <div className="relative z-10 flex flex-col items-center">

              <div className="relative flex h-[180px] w-[105px] items-center justify-center rounded-[55px] bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 shadow-xl shadow-indigo-500/30">

                {/* MIC LINES */}
                <div className="absolute left-7 top-[52px] space-y-3">

                  <div className="h-[4px] w-12 rounded-full bg-white/90" />
                  <div className="h-[4px] w-12 rounded-full bg-white/90" />
                  <div className="h-[4px] w-12 rounded-full bg-white/90" />

                </div>

              </div>


              {/* MIC HOLDER */}
              <div className="relative h-[90px] w-[150px]">

                <div className="absolute left-1/2 top-[-20px] h-[100px] w-[115px] -translate-x-1/2 rounded-b-[65px] border-b-[12px] border-l-[12px] border-r-[12px] border-indigo-700" />

                <div className="absolute left-1/2 top-[62px] h-[38px] w-[10px] -translate-x-1/2 bg-indigo-700" />

                <div className="absolute bottom-0 left-1/2 h-[10px] w-[80px] -translate-x-1/2 rounded-full bg-indigo-700" />

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          STATISTICS
      ====================================================== */}
      <section className="px-6 pb-12 sm:px-10 lg:px-14">

        <div className="mx-auto grid max-w-[1370px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">

          {/* STAT 1 */}
          <div className="flex items-center gap-4 border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>

            </div>

            <div>
              <p className="text-xl font-extrabold text-slate-900">
                10K+
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Active Speakers
              </p>
            </div>

          </div>


          {/* STAT 2 */}
          <div className="flex items-center gap-4 border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <rect x="4" y="4" width="16" height="16" rx="3" />
                <path d="M8 8h8v8H8z" />
              </svg>

            </div>

            <div>
              <p className="text-xl font-extrabold text-slate-900">
                250K+
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Challenges Completed
              </p>
            </div>

          </div>


          {/* STAT 3 */}
          <div className="flex items-center gap-4 border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M4 19V5" />
                <path d="M4 19h17" />
                <path d="m7 15 4-4 3 2 5-7" />
              </svg>

            </div>

            <div>
              <p className="text-xl font-extrabold text-slate-900">
                95%
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Users Improve
              </p>
            </div>

          </div>


          {/* STAT 4 */}
          <div className="flex items-center gap-4 p-6">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
              </svg>

            </div>

            <div>
              <p className="text-xl font-extrabold text-slate-900">
                4.8 ★
              </p>

              <p className="mt-1 text-xs text-slate-500">
                User Rating
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}
      <section id="how-it-works" className="px-6 py-14 sm:px-10 lg:px-14">

        <div className="mx-auto max-w-[1370px]">

          <div className="text-center">

            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              How It Works
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Four simple steps to improve your communication
            </p>

          </div>


          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {/* STEP 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-lg font-bold text-indigo-600">
                1
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Get a Topic
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                We give you a random topic to speak about.
              </p>

            </div>


            {/* STEP 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-lg font-bold text-indigo-600">
                2
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Speak for 60 Sec
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                You get 5 seconds to prepare and then speak for 60 seconds.
              </p>

            </div>


            {/* STEP 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-lg font-bold text-indigo-600">
                3
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                AI Analyzes
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Our AI analyzes your speech across multiple parameters.
              </p>

            </div>


            {/* STEP 4 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-lg font-bold text-indigo-600">
                4
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Get Feedback
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                You receive detailed feedback and a score to improve.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          WHY CHOOSE SPEAKSPRINT
      ====================================================== */}
      <section id="features" className="px-6 pb-14 sm:px-10 lg:px-14">

        <div className="mx-auto max-w-[1370px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#17175c] via-[#202080] to-[#3020a5] px-6 py-10 text-white sm:px-10">

          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            Why Choose SpeakSprint AI?
          </h2>


          <div className="mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            {/* FEATURE 1 */}
            <div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">

                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="8" />
                  <path d="M9 12h6" />
                  <path d="M12 9v6" />
                </svg>

              </div>

              <h3 className="mt-4 font-bold">
                AI Powered
              </h3>

              <p className="mt-2 text-sm leading-6 text-indigo-100">
                Advanced AI analyzes your speech like a personal coach.
              </p>

            </div>


            {/* FEATURE 2 */}
            <div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">

                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 5h14v14H5z" />
                  <path d="M8 15c2-4 6-4 8 0" />
                  <path d="M9 9h.01" />
                  <path d="M15 9h.01" />
                </svg>

              </div>

              <h3 className="mt-4 font-bold">
                Comprehensive
              </h3>

              <p className="mt-2 text-sm leading-6 text-indigo-100">
                We check grammar, fluency, pace, vocabulary and more.
              </p>

            </div>


            {/* FEATURE 3 */}
            <div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">

                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 19V5" />
                  <path d="M4 19h17" />
                  <path d="m7 15 4-4 3 2 5-7" />
                </svg>

              </div>

              <h3 className="mt-4 font-bold">
                Track Progress
              </h3>

              <p className="mt-2 text-sm leading-6 text-indigo-100">
                See your progress over time with beautiful analytics.
              </p>

            </div>


            {/* FEATURE 4 */}
            <div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">

                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 8v4l3 2" />
                  <path d="M8 4 6 2" />
                  <path d="M16 4l2-2" />
                </svg>

              </div>

              <h3 className="mt-4 font-bold">
                Build Confidence
              </h3>

              <p className="mt-2 text-sm leading-6 text-indigo-100">
                Practice daily and become a confident speaker.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          BOTTOM CTA
      ====================================================== */}
      <section id="pricing" className="px-6 py-14 sm:px-10 lg:px-14">

        <div className="mx-auto max-w-[900px] text-center">

          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Start improving your speaking today.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Just 60 seconds a day can help you become a more confident
            communicator.
          </p>

          <button className="mt-7 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700">
            Start Speaking Now
          </button>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer id="faq" className="border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-[1370px] flex-col items-center justify-between gap-5 px-6 py-8 text-center sm:px-10 md:flex-row md:text-left lg:px-14">

          <div className="flex items-center gap-2">

            <div className="flex items-center gap-[2px]">

              <span className="h-4 w-[3px] rounded-full bg-indigo-600" />
              <span className="h-6 w-[3px] rounded-full bg-indigo-600" />
              <span className="h-3 w-[3px] rounded-full bg-indigo-600" />
              <span className="h-5 w-[3px] rounded-full bg-indigo-600" />

            </div>

            <span className="font-bold text-slate-900">
              SpeakSprint
              <span className="text-indigo-600"> AI</span>
            </span>

          </div>

          <p className="text-xs text-slate-500">
            © 2026 SpeakSprint AI. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
};

export default Home;