import React, { useState } from 'react';
import { Shield, FileText, AlertTriangle, ChevronDown, Scale, Lock, Info as InfoIcon } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, children, isOpen, onToggle }) => (
  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-lg font-semibold text-slate-900 dark:text-white">{title}</span>
      </div>
      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
      <div className="p-6 pt-0 bg-white dark:bg-slate-900">
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export const Info: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('legal');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto p-6 lg:p-12">
      {/* Header */}
      <div className="text-center mb-16 space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white mb-4 shadow-2xl transform hover:rotate-6 transition-transform">
          <InfoIcon className="w-10 h-10" />
        </div>
        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Legal Center
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
              Transparency, trust, and our commitment to your privacy.
            </p>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-6">
        {/* Legal / Terms of Service */}
        <AccordionItem
          title="Terms of Service"
          icon={<Scale className="w-6 h-6 text-slate-600 dark:text-slate-400" />}
          isOpen={openSection === 'legal'}
          onToggle={() => toggleSection('legal')}
        >
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                <FileText size={14} /> Last updated: December 2024
            </div>
            
            <div className="space-y-8">
                <section>
                    <h4 className="text-slate-900 dark:text-white font-black text-lg mb-3">1. Acceptance of Terms</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      By accessing and using ViralPot ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                    </p>
                </section>
                
                <section>
                    <h4 className="text-slate-900 dark:text-white font-black text-lg mb-3">2. Description of Service</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      ViralPot is an AI-powered content generation tool that helps users create social media content ideas, captions, and strategies. The Service is provided "as is" and we reserve the right to modify or discontinue it at any time.
                    </p>
                </section>
                
                <section>
                    <h4 className="text-slate-900 dark:text-white font-black text-lg mb-3">3. User Responsibilities</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      You are responsible for your use of the Service and any content you create or publish using our tools. You agree not to use the Service for any unlawful purpose or in violation of any applicable laws or regulations.
                    </p>
                </section>
                
                <section>
                    <h4 className="text-slate-900 dark:text-white font-black text-lg mb-3">4. Intellectual Property</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      Content generated using our Service is yours to use. However, the ViralPot platform, including its design, features, and underlying technology, remains our intellectual property.
                    </p>
                </section>
            </div>
          </div>
        </AccordionItem>

        {/* Disclaimer */}
        <AccordionItem
          title="Disclaimer"
          icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
          isOpen={openSection === 'disclaimer'}
          onToggle={() => toggleSection('disclaimer')}
        >
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 rounded-4xl p-8 mb-10">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={24} className="text-amber-600" />
                <h4 className="text-amber-800 dark:text-amber-300 font-black uppercase text-sm tracking-widest m-0">Critical Notice</h4>
              </div>
              <p className="text-amber-900 dark:text-amber-200 text-lg font-bold leading-relaxed m-0">
                Please read this disclaimer carefully before using our Service.
              </p>
            </div>
            
            <div className="space-y-8">
                <section>
                    <h4 className="text-slate-900 dark:text-white font-black text-lg mb-3">AI-Generated Content</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      All content generated by ViralPot is created using artificial intelligence. While we strive to provide high-quality, relevant suggestions, we cannot guarantee the accuracy, completeness, or suitability of any generated content for your specific purposes.
                    </p>
                </section>
                
                <section>
                    <h4 className="text-slate-900 dark:text-white font-black text-lg mb-3">No Guarantees</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      We do not guarantee that using our content suggestions will result in increased engagement, followers, or any specific outcomes on social media platforms. Results vary based on numerous factors outside our control.
                    </p>
                </section>
                
                <section>
                    <h4 className="text-slate-900 dark:text-white font-black text-lg mb-3">User Review Required</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      You should always review and edit AI-generated content before publishing. It is your responsibility to ensure that any content you publish complies with applicable laws, platform guidelines, and your brand standards.
                    </p>
                </section>
            </div>
          </div>
        </AccordionItem>

        {/* Privacy Policy */}
        <AccordionItem
          title="Privacy Policy"
          icon={<Lock className="w-6 h-6 text-emerald-500" />}
          isOpen={openSection === 'privacy'}
          onToggle={() => toggleSection('privacy')}
        >
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                <Shield size={14} /> Last updated: December 2024
            </div>
            
            <div className="space-y-8">
                <section>
                    <h4 className="text-slate-900 dark:text-white font-black text-lg mb-3">Information We Collect</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-4">
                      ViralPot is designed with privacy in mind. We collect minimal information necessary to provide the Service:
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Content inputs processed in real-time',
                        'Basic usage analytics to improve our engine',
                        'Local preferences stored in your browser'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold">
                           <div className="w-2 h-2 rounded-full bg-emerald-500" />
                           {item}
                        </li>
                      ))}
                    </ul>
                </section>
                
                <section>
                    <h4 className="text-slate-900 dark:text-white font-black text-lg mb-3">Data Sovereignty</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      Your inputs are sent to AI services solely to generate content for you. We do not sell, share, or use your content for any other purpose. All preferences are stored locally in your browser using secure storage.
                    </p>
                </section>
                
                <section>
                    <h4 className="text-slate-900 dark:text-white font-black text-lg mb-3">Your Rights</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      You can clear your browser's locally stored data at any time. For any privacy-related inquiries, please contact our data team at <span className="text-slate-900 dark:text-white font-black underline">hello@viralpot.com</span>.
                    </p>
                </section>
            </div>
          </div>
        </AccordionItem>
      </div>

      {/* Footer Note */}
      <div className="mt-20 text-center pb-12">
        <p className="text-xs text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} ViralPot Professional Content Suite
        </p>
      </div>
    </div>
  );
};
