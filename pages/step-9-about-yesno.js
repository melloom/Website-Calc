import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Step9AboutYesNo() {
  const [selectedChoice, setSelectedChoice] = useState('');
  const router = useRouter();
  
  const websiteType = router.query.type || 'single';
  const category = router.query.category || 'business';
  const subcategory = router.query.subcategory || '';
  const backend = router.query.backend || '';
  const aiChoice = router.query.ai || '';
  const automation = router.query.automation || '';
  const store = router.query.store || '';
  const pages = router.query.pages ? router.query.pages.split(',') : [];
  const fromPage = router.query.from || '';

  const toggleChoice = (choiceId) => {
    setSelectedChoice(prev => prev === choiceId ? '' : choiceId);
  };

  const getSectionInfo = () => {
    return {
      name: 'About Section',
      description: 'Share your company story, team, and build trust with visitors',
      price: '+$100',
      features: ['Company Story', 'Team Bios', 'Mission Statement', 'Company History', 'Contact Information']
    };
  };

  return (
    <>
      <Head>
        <title>About Section - Mellow Quote</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.6s ease-out;
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-12 pb-24 sm:pt-0 sm:pb-0">
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8">
          <div className="fade-in">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-2 tracking-tight">
                Mellow Quote
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
                About Section
              </p>
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 shadow-sm max-w-full overflow-hidden">
                <span className="text-blue-600 font-semibold flex-shrink-0">About</span>
                <span className="mx-1.5 text-slate-400 flex-shrink-0">•</span>
                <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-hide">
                  <span className="flex-shrink-0">📄 Single</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">{subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace('-', ' ')}</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">Backend: {backend === 'no' ? 'No' : 'Yes'}</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">AI: {aiChoice === 'no' ? 'No' : 'Yes'}</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">Store</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">Sections</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="text-blue-600 font-semibold flex-shrink-0">About</span>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Do you want an About section?</h2>
                <p className="text-base text-slate-600 max-w-2xl mx-auto mb-6">
                  Share your company story and build trust with visitors
                </p>
                
                {/* Section Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <div className="text-left">
                    <h3 className="font-semibold text-blue-900 mb-2">{getSectionInfo().name}</h3>
                    <p className="text-sm text-blue-800 mb-3">{getSectionInfo().description}</p>
                    <div className="text-xs text-blue-700">
                      <strong>Includes:</strong> {getSectionInfo().features.join(', ')}
                    </div>
                    <div className="mt-2 text-lg font-bold text-blue-600">
                      {getSectionInfo().price}
                    </div>
                  </div>
                </div>
              </div>

              {/* Yes/No Options */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div
                  onClick={() => toggleChoice('yes')}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    selectedChoice === 'yes'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      selectedChoice === 'yes' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <svg className={`w-8 h-8 ${selectedChoice === 'yes' ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Yes, Add About Section</h3>
                    <p className="text-gray-600 text-sm mb-3">Include company story and team information</p>
                    <div className="text-green-600 font-semibold">
                      {getSectionInfo().price}
                    </div>
                  </div>
                </div>
                
                <div
                  onClick={() => toggleChoice('no')}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    selectedChoice === 'no'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      selectedChoice === 'no' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      <svg className={`w-8 h-8 ${selectedChoice === 'no' ? 'text-red-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No, Skip About Section</h3>
                    <p className="text-gray-600 text-sm mb-3">Don't include company information</p>
                    <div className="text-red-600 font-semibold">
                      No additional cost
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Go back to sections page
                    router.push(`/step-9?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&pages=${pages.join(',')}&from=about-yesno`);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-sm"
                >
                  ← Back
                </button>
                
                {selectedChoice === 'yes' && (
                  <button
                    onClick={() => {
                      // Go to about options page
                      router.push(`/step-9-about?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&pages=${pages.join(',')}&from=about-yesno`);
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 text-sm"
                  >
                    Customize About →
                  </button>
                )}
                
                {selectedChoice === 'no' && (
                  <button
                    onClick={() => {
                      // Go back to sections page without adding about
                      router.push(`/step-9?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&pages=${pages.join(',')}&from=about-yesno`);
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 text-sm"
                  >
                    Continue →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
