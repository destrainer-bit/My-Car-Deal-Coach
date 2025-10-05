import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Legal({ onBack }) {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('disclaimer')

  const sections = {
    disclaimer: {
      title: 'Legal Disclaimer',
      content: (
        <div className="legal-content">
          <h3>Informational Purposes Only</h3>
          <p>Car Deal Coach ("App") provides educational resources, scripts, alerts, and general guidance designed to help consumers navigate the car-buying process. The content is for informational purposes only and should not be interpreted as legal, financial, or professional advice.</p>

          <h3>No Guarantee of Outcomes</h3>
          <p>The App does not guarantee savings, approval, financing terms, or successful negotiations. Each car purchase involves unique circumstances—including credit history, dealership policies, lender requirements, and market conditions—outside the control of the App.</p>

          <h3>No Liability</h3>
          <p>To the fullest extent permitted by law, the creators, owners, and affiliates of Car Deal Coach are not liable for any direct, indirect, incidental, consequential, or punitive damages arising from use of the App. This includes, but is not limited to:</p>
          <ul>
            <li>Vehicle purchase decisions</li>
            <li>Financing agreements</li>
            <li>Dealer negotiations</li>
            <li>Contract terms or errors</li>
            <li>Unexpected costs, fees, or losses</li>
          </ul>
          <p>Users accept full responsibility for their car-buying decisions and any contracts they enter into.</p>

          <h3>Not a Substitute for Professional Advice</h3>
          <p>Users are encouraged to consult qualified professionals (e.g., attorneys, financial advisors, or certified credit counselors) before making purchase decisions or signing any legal agreements.</p>

          <h3>Third-Party Content</h3>
          <p>The App may reference third-party institutions, lenders, credit unions, or dealerships. These references are provided for convenience only. Car Deal Coach has no control over, and accepts no responsibility for, the accuracy, products, or services of any third parties. Accessing or relying on such third-party content is at the user's own risk.</p>

          <h3>Data and Security</h3>
          <p>While the App takes reasonable measures to protect user data, no system is entirely secure. By using the App, you acknowledge and accept the risk of potential data breaches, unauthorized access, or errors in third-party integrations.</p>

          <h3>Indemnification</h3>
          <p>By using Car Deal Coach, you agree to indemnify and hold harmless its creators, owners, and affiliates against any claims, damages, liabilities, or expenses (including attorney's fees) arising from your use of the App, your reliance on its content, or any agreements you enter into.</p>

          <h3>Jurisdiction</h3>
          <p>This Disclaimer shall be governed by the laws of the United States. By using Car Deal Coach, you consent to the exclusive jurisdiction of the courts located in the United States for resolution of any disputes.</p>
        </div>
      )
    },
    terms: {
      title: 'Terms of Use',
      content: (
        <div className="legal-content">
          <h3>Acceptance of Terms</h3>
          <p>By downloading, accessing, or using Car Deal Coach ("App"), you agree to be bound by these Terms of Use. If you do not agree, you must not use the App.</p>

          <h3>License to Use</h3>
          <p>Car Deal Coach grants you a limited, non-exclusive, non-transferable, revocable license to use the App for personal, non-commercial purposes. You may not:</p>
          <ul>
            <li>Copy, modify, or distribute the App's content without written permission</li>
            <li>Use the App for unlawful purposes</li>
            <li>Attempt to hack, reverse-engineer, or disrupt the App's functionality</li>
          </ul>

          <h3>User Responsibilities</h3>
          <p>You are solely responsible for:</p>
          <ul>
            <li>The accuracy of any information you provide in the App</li>
            <li>Decisions you make based on scripts, alerts, or guidance from the App</li>
            <li>Reviewing and understanding all documents and contracts you sign in connection with car purchases</li>
          </ul>

          <h3>Intellectual Property</h3>
          <p>All content, branding, logos, scripts, alerts, and features within Car Deal Coach are the property of its creators and protected under applicable intellectual property laws. Unauthorized use may result in legal action.</p>

          <h3>Prohibited Conduct</h3>
          <p>You agree not to:</p>
          <ul>
            <li>Misuse the App to mislead others or commit fraud</li>
            <li>Upload harmful code, viruses, or attempt to disrupt the service</li>
            <li>Resell or redistribute content without authorization</li>
          </ul>

          <h3>Termination</h3>
          <p>Car Deal Coach reserves the right to suspend or terminate access at any time, with or without notice, if these Terms of Use are violated or if the App is misused.</p>

          <h3>Third-Party Services</h3>
          <p>The App may link or refer to third-party services (dealerships, lenders, credit unions). Use of such services is at your own risk, and Car Deal Coach is not responsible for their content, products, or practices.</p>

          <h3>Disclaimers</h3>
          <p>The App is provided "as is" and "as available," without warranties of any kind. Please review our Legal Disclaimer for more details.</p>

          <h3>Limitation of Liability</h3>
          <p>To the fullest extent permitted by law, Car Deal Coach, its creators, and affiliates are not liable for any damages arising from the use or misuse of the App.</p>

          <h3>Indemnification</h3>
          <p>You agree to indemnify and hold harmless Car Deal Coach and its affiliates against any claims, liabilities, or expenses arising from your use of the App.</p>

          <h3>Changes to Terms</h3>
          <p>We reserve the right to update or modify these Terms at any time. Continued use of the App after changes are posted constitutes acceptance of those changes.</p>
        </div>
      )
    },
    privacy: {
      title: 'Privacy Policy',
      content: (
        <div className="legal-content">
          <p><strong>Effective Date: September 27, 2025</strong></p>
          
          <p>Car Deal Coach ("App," "we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use the App. By accessing or using Car Deal Coach, you agree to the terms of this Privacy Policy.</p>

          <h3>1. Information We Collect</h3>
          <p>We may collect the following types of information when you use the App:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, and any details you voluntarily provide.</li>
            <li><strong>Car-Buying Data:</strong> Information you input about budgets, financing preferences, or dealership interactions.</li>
            <li><strong>Technical Information:</strong> Device type, operating system, IP address, and usage data (e.g., pages viewed, features used).</li>
            <li><strong>Sensitive Financial Inputs (if applicable):</strong> Credit score range or related financial info, entered voluntarily by the user.</li>
          </ul>

          <h3>2. How We Use Your Information</h3>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide you with tailored scripts, alerts, and tools</li>
            <li>Improve App functionality and user experience</li>
            <li>Communicate with you (updates, customer support, promotions)</li>
            <li>Analyze usage patterns to enhance services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h3>3. Data Sharing and Disclosure</h3>
          <p>We do not sell, rent, or trade your personal information. However, we may share information:</p>
          <ul>
            <li>With trusted service providers who help operate the App</li>
            <li>If required by law, regulation, or legal process</li>
            <li>In connection with a business transfer (merger, acquisition, etc.)</li>
          </ul>
          <p>Any third-party links or services accessed through the App are governed by their own privacy policies. We are not responsible for their practices.</p>

          <h3>4. Data Security</h3>
          <p>We take reasonable administrative, technical, and physical measures to protect your information. However, no system is completely secure. By using the App, you acknowledge and accept the risk of potential data breaches or unauthorized access.</p>

          <h3>5. User Choices and Rights</h3>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access, correct, or delete your personal information</li>
            <li>Restrict or object to certain data processing</li>
            <li>Request data portability</li>
            <li>Withdraw consent for data collection (where applicable)</li>
          </ul>
          <p>To exercise these rights, contact us at: legal@cardealcoach.com</p>

          <h3>6. Children's Privacy</h3>
          <p>Car Deal Coach is not directed at children under 18. We do not knowingly collect personal data from minors. If we become aware that we have inadvertently collected such data, we will delete it.</p>

          <h3>7. International Users</h3>
          <p>If you access the App from outside the United States, you understand that your data may be transferred, stored, and processed in a country with different data protection laws.</p>

          <h3>8. Updates to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. Changes will be posted within the App with a new effective date. Continued use of the App constitutes acceptance of the updated policy.</p>
        </div>
      )
    }
  }

  return (
    <div className="mobile-first-legal">
      <div className="mobile-first-legal-container">
      <div className="legal-header">
        <button className="btn btn-secondary" onClick={() => navigate('/app/settings')}>
          ← Back to Settings
        </button>
        <h1 style={{ color: '#ffffff' }}>Legal Information</h1>
        <p style={{ color: '#ffffff' }}>Important legal information about using Car Deal Coach</p>
      </div>

      <div className="legal-navigation">
        <button 
          className={`nav-btn ${activeSection === 'disclaimer' ? 'active' : ''}`}
          onClick={() => setActiveSection('disclaimer')}
        >
          Legal Disclaimer
        </button>
        <button 
          className={`nav-btn ${activeSection === 'terms' ? 'active' : ''}`}
          onClick={() => setActiveSection('terms')}
        >
          Terms of Use
        </button>
        <button 
          className={`nav-btn ${activeSection === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveSection('privacy')}
        >
          Privacy Policy
        </button>
      </div>

      <div className="legal-content-wrapper">
        <div className="legal-section-header">
          <h2 style={{ color: '#ffffff' }}>{sections[activeSection].title}</h2>
        </div>
        <div className="legal-section-content">
          {sections[activeSection].content}
        </div>
      </div>
    </div>
  )
}

export default Legal



