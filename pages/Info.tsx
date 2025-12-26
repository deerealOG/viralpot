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
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
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
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 mb-4 shadow-lg">
          <InfoIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          Legal Information
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Important information about our terms, policies, and your rights.
        </p>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-4">
        {/* Legal / Terms of Service */}
        <AccordionItem
          title="Terms of Service"
          icon={<Scale className="w-6 h-6 text-slate-600 dark:text-slate-400" />}
          isOpen={openSection === 'legal'}
          onToggle={() => toggleSection('legal')}
        >
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              <strong>Last updated:</strong> December 2024
            </p>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">1. Acceptance of Terms</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              By accessing and using ViralPot ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">2. Description of Service</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              ViralPot is an AI-powered content generation tool that helps users create social media content ideas, captions, and strategies. The Service is provided "as is" and we reserve the right to modify or discontinue it at any time.
            </p>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">3. User Responsibilities</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              You are responsible for your use of the Service and any content you create or publish using our tools. You agree not to use the Service for any unlawful purpose or in violation of any applicable laws or regulations.
            </p>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">4. Intellectual Property</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Content generated using our Service is yours to use. However, the ViralPot platform, including its design, features, and underlying technology, remains our intellectual property.
            </p>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">5. Limitation of Liability</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              ViralPot shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.
            </p>
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
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
              <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                ⚠️ Please read this disclaimer carefully before using our Service.
              </p>
            </div>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">AI-Generated Content</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              All content generated by ViralPot is created using artificial intelligence. While we strive to provide high-quality, relevant suggestions, we cannot guarantee the accuracy, completeness, or suitability of any generated content for your specific purposes.
            </p>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">No Guarantees</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              We do not guarantee that using our content suggestions will result in increased engagement, followers, or any specific outcomes on social media platforms. Results vary based on numerous factors outside our control.
            </p>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">User Review Required</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              You should always review and edit AI-generated content before publishing. It is your responsibility to ensure that any content you publish complies with applicable laws, platform guidelines, and your brand standards.
            </p>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">Third-Party Services</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              ViralPot uses third-party AI services to generate content. We are not responsible for the availability, accuracy, or policies of these third-party providers.
            </p>
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
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              <strong>Last updated:</strong> December 2024
            </p>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">Information We Collect</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              ViralPot is designed with privacy in mind. We collect minimal information necessary to provide the Service:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 mb-4">
              <li>Content inputs you provide for generation (processed in real-time, not stored permanently)</li>
              <li>Basic usage analytics to improve our Service</li>
              <li>Local preferences stored in your browser (theme settings, etc.)</li>
            </ul>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">How We Use Your Information</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Your inputs are sent to AI services solely to generate content for you. We do not sell, share, or use your content for any other purpose.
            </p>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">Data Storage</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              We do not maintain user accounts or store personal data on our servers. All preferences are stored locally in your browser using localStorage.
            </p>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">Cookies</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              We use essential cookies only for basic functionality. We do not use tracking cookies or third-party advertising cookies.
            </p>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">Your Rights</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Since we don't store personal data, there's nothing to delete. You can clear your browser's localStorage at any time to remove any locally stored preferences.
            </p>
            
            <h4 className="text-slate-900 dark:text-white font-semibold mt-6 mb-3">Contact Us</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at hello@viralpot.com.
            </p>
          </div>
        </AccordionItem>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} ViralPot. All rights reserved.
        </p>
      </div>
    </div>
  );
};
