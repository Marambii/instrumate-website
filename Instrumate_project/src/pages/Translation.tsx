import PageWrapper from "../components/PageWrapper";
{/*import SignAvatar from "../components/SignAvatar";*/}

export default function TranslationPage() {
  return (
    <PageWrapper>
      <div className="p-6">
        {/* Your sign detection content */}
        <main className="relative flex min-h-screen flex-col bg-slate-50 overflow-x-hidden font-['Lexend','Noto_Sans',sans-serif]">
          <div className="layout-container flex flex-col flex-grow h-full px-40 py-5">
            <div className="flex flex-col max-w-[960px] w-full mx-auto">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <p className="text-[#0c151d] text-[32px] font-bold leading-tight min-w-72">
                  Translate Text to KSL
                </p>
              </div>

              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <textarea
                    placeholder="Enter text to translate"
                    className="form-input w-full resize-none rounded-xl min-h-36 p-[15px] text-base border border-[#cddcea] bg-slate-50 text-[#0c151d] placeholder:text-[#4574a1] focus:outline-none"
                  />
                </label>
              </div>

              <div className="flex px-4 py-3 justify-start">
                <button className="rounded-full h-10 px-4 bg-[#e6edf4] text-[#0c151d] text-sm font-bold">
                  Upload File (Optional)
                </button>
              </div>

              <div className="flex px-4 py-3 justify-start">
                <button className="rounded-full h-10 px-4 bg-[#359dff] text-[#0c151d] text-sm font-bold">
                  Translate
                </button>
              </div>

              <h2 className="text-[#0c151d] text-[22px] font-bold px-4 pb-3 pt-5">
                Translation Output
              </h2>

              <div className="p-4">
                <div
                  className="relative flex items-center justify-center bg-[#359dff] bg-cover bg-center aspect-video rounded-xl p-4"
                  style={{
                    backgroundColor: "#0c151d",
                  }}
                >
                  {/*<SignAvatar />*/}

                  <button className="flex items-center justify-center size-16 rounded-full bg-black/40 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-[#0c151d] text-base text-center px-4 pt-1 pb-3">
                The quick brown fox jumps over the lazy dog.
              </p>

              <p className="text-[#4574a1] text-sm text-center px-4 pt-1 pb-3">
                KSL Supported
              </p>
            </div>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}
