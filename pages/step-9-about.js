import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Step9About() {
  const [selectedOptions, setSelectedOptions] = useState({});
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

  useEffect(() => {
    // Restore options from URL if coming back
    if (router.query.options) {
      const options = router.query.options.split(',');
      const initialOptions = {};
      options.forEach(option => {
        if (option) initialOptions[option] = true;
      });
      setSelectedOptions(initialOptions);
    }
  }, [router.query.options]);

  const getAboutOptions = () => {
    return [
      {
        id: 'company-story',
        name: 'Company Story',
        description: 'Tell your brand story and mission',
        price: '+$50',
        features: ['Brand History', 'Mission Statement', 'Vision', 'Company Values', 'Team Introduction']
      },
      {
        id: 'team-members',
        name: 'Team Members',
        description: 'Showcase your team and expertise',
        price: '+$100',
        features: ['Team Bios', 'Professional Photos', 'Skills & Expertise', 'Social Links', 'Contact Info']
      },
      {
        id: 'company-stats',
        name: 'Company Statistics',
        description: 'Display impressive metrics and achievements',
        price: '+$75',
        features: ['Years in Business', 'Projects Completed', 'Client Count', 'Awards Won', 'Growth Metrics']
      },
      {
        id: 'testimonials',
        name: 'Client Testimonials',
        description: 'Show customer reviews and feedback',
        price: '+$80',
        features: ['Customer Quotes', 'Star Ratings', 'Client Photos', 'Project Names', 'Results Highlighted']
      }
    ];
  };

  const toggleOption = (optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: !prev[optionId]
    }));
  };

  const calculateOptionCost = () => {
    let total = 0;
    Object.keys(selectedOptions).forEach(optionId => {
      if (selectedOptions[optionId]) {
        const option = getAboutOptions().find(opt => opt.id === optionId);
        if (option) {
          total += parseInt(option.price.replace(/[^0-9]/g, ''));
        }
      }
    });
    return total;
  };

  return (
    <>
      <Head>
        <title>About Section Options - Mellow Quote</title>
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
                About Section Options
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
                  <span className="text-blue-600 font-semibold flex-shrink-0">About Options</span>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Customize Your About Section</h2>
                <p className="text-base text-slate-600 max-w-2xl mx-auto">
                  Choose the features you want to include in your About section
                </p>
              </div>

              <div className="space-y-3">
                {getAboutOptions().map((option) => (
                  <div
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                      selectedOptions[option.id]
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                            selectedOptions[option.id]
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedOptions[option.id] && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{option.name}</h4>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-blue-600 ml-4">
                        {option.price}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 flex flex-wrap gap-1">
                        {option.features.map((feature, index) => (
                          <span key={index} className="inline-block bg-gray-100 rounded px-2 py-1">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">About Section Cost:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {Object.keys(selectedOptions).some(key => selectedOptions[key]) ? `+$${calculateOptionCost()}` : '+$0'}
                  </span>
                </div>
                {Object.keys(selectedOptions).some(key => selectedOptions[key]) && (
                  <div className="mt-2 text-sm text-gray-600">
                    {Object.keys(selectedOptions).filter(key => selectedOptions[key]).length} option{Object.keys(selectedOptions).filter(key => selectedOptions[key]).length > 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Go back to sections page
                    router.push(`/step-9?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&pages=${pages.join(',')}&from=about-options`);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-sm"
                >
                  ← Back
                </button>
                
                <button
                  onClick={() => {
                    // Add about section to selected pages and go back to sections
                    const updatedPages = [...pages, 'about'];
                    const selectedOptionIds = Object.keys(selectedOptions).filter(key => selectedOptions[key]);
                    router.push(`/step-9?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&pages=${updatedPages.join(',')}&from=about-options`);
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 text-sm"
                >
                  Add About Section →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
