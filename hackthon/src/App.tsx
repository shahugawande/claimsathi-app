/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  InsurancePolicy,
  Claim,
  UploadedDocument,
  AppealLetter,
  FollowUpRecord,
  AppNotification,
  ClaimStatus,
  PreAuthorisationForm
} from './types';
import { storage } from './services/storageService';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { PatientDashboard } from './components/PatientDashboard';
import { DocumentUploadCentre } from './components/DocumentUploadCentre';
import { PolicyUnderstanding } from './components/PolicyUnderstanding';
import { CoverageAnalysis } from './components/CoverageAnalysis';
import { PreAuthGenerator } from './components/PreAuthGenerator';
import { MockInsurerPortal } from './components/MockInsurerPortal';
import { ClaimTracking } from './components/ClaimTracking';
import { DenialAnalysisEngine } from './components/DenialAnalysisEngine';
import { AppealLetterGenerator } from './components/AppealLetterGenerator';
import { FollowUpAgent } from './components/FollowUpAgent';
import { FamilyDashboard } from './components/FamilyDashboard';
import { AuthModal } from './components/AuthModal';
import { LegalDisclaimerModal } from './components/LegalDisclaimerModal';
import { DEMO_UPLOADED_DOCUMENTS } from './data/mockData';
import { supabase } from './lib/supabaseClient';

export default function App() {
  // Navigation state
  const [currentView, setCurrentView] = useState<string>('landing');

  // Core application data loaded from storage service
  const [profile, setProfile] = useState<UserProfile>(() => storage.getProfile());
  const [policies, setPolicies] = useState<InsurancePolicy[]>(() => storage.getPolicies());
  const [documents, setDocuments] = useState<UploadedDocument[]>(() => storage.getDocuments());
  const [claims, setClaims] = useState<Claim[]>(() => storage.getClaims());
  const [appeals, setAppeals] = useState<AppealLetter[]>(() => storage.getAppeals());
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>(() => storage.getFollowUps());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => storage.getNotifications());
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => storage.isDemoMode());
  const [authUser, setAuthUser] = useState<{ id: string; email: string } | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  const activePolicy = policies[0];
  const activeClaim = claims[0];
  const activeAppeal = appeals[0];

  // Refresh all data from storage
  const reloadFromStorage = () => {
    setProfile(storage.getProfile());
    setPolicies(storage.getPolicies());
    setDocuments(storage.getDocuments());
    setClaims(storage.getClaims());
    setAppeals(storage.getAppeals());
    setFollowUps(storage.getFollowUps());
    setNotifications(storage.getNotifications());
    setIsDemoMode(storage.isDemoMode());
  };

  useEffect(() => {
    let mounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (!user) {
        setAuthUser(null);
        storage.clearRemoteUser();
        storage.resetToDemo();
        if (mounted) reloadFromStorage();
        return;
      }

      const signedInUser = { id: user.id, email: user.email ?? '' };
      setAuthUser(signedInUser);
      // Defer database queries until Supabase finishes its auth event callback.
      window.setTimeout(() => {
        storage.activateRemoteUser(signedInUser.id, signedInUser.email)
          .then(() => { if (mounted) reloadFromStorage(); })
          .catch((error) => console.error('Could not load your Supabase data:', error));
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleResetToDemo = () => {
    storage.resetToDemo();
    reloadFromStorage();
    setCurrentView('dashboard');
  };

  const handleUpdateClaimStatus = (newStatus: ClaimStatus) => {
    const updated = {
      ...activeClaim,
      status: newStatus,
      lastUpdated: new Date().toLocaleDateString()
    };
    storage.saveClaim(updated);
    setClaims([updated]);

    storage.addNotification({
      title: `Claim Status: ${newStatus}`,
      message: `Docket ${activeClaim.claimReferenceNumber} transitioned to ${newStatus}.`,
      type: 'info',
      read: false,
      actionRoute: 'tracking'
    });
    setNotifications(storage.getNotifications());
  };

  const handleAddDocument = (doc: UploadedDocument) => {
    storage.saveDocument(doc);
    setDocuments(storage.getDocuments());

    storage.addNotification({
      title: 'Document Extracted',
      message: `${doc.fileName} parsed via browser OCR with ${doc.confidenceScore}% confidence.`,
      type: 'success',
      read: false,
      actionRoute: 'documents'
    });
    setNotifications(storage.getNotifications());
  };

  const handleDeleteDocument = (id: string) => {
    storage.deleteDocument(id);
    setDocuments(storage.getDocuments());
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    storage.saveProfile(newProfile);
    setProfile(newProfile);
  };

  const handleSaveAppeal = (newAppeal: AppealLetter) => {
    storage.saveAppeal(newAppeal);
    setAppeals([newAppeal]);
  };

  const handleAddFollowUp = (record: FollowUpRecord) => {
    storage.saveFollowUp(record);
    setFollowUps(storage.getFollowUps());

    // Also add to timeline of the claim
    const updatedTimeline = [
      ...activeClaim.timeline,
      {
        id: `tl_${Date.now()}`,
        title: record.subjectOrAgenda,
        date: record.date,
        description: `${record.type}: ${record.contentOrScript}`,
        actor: 'ClaimSathi AI' as const,
        statusType: 'info' as const
      }
    ];
    const updatedClaim: Claim = {
      ...activeClaim,
      timeline: updatedTimeline
    };
    storage.saveClaim(updatedClaim);
    setClaims([updatedClaim]);
  };

  const handleClaimSubmittedInPortal = (claimRef: string) => {
    const updatedClaim: Claim = {
      ...activeClaim,
      claimReferenceNumber: claimRef,
      status: 'Submitted',
      lastUpdated: new Date().toLocaleDateString()
    };
    storage.saveClaim(updatedClaim);
    setClaims([updatedClaim]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        notifications={notifications}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onResetDemo={handleResetToDemo}
        isDemoMode={isDemoMode}
        patientName={profile.fullName}
      />

      {/* Main Workspace Body */}
      {currentView === 'landing' ? (
        <LandingPage
          onGetStarted={() => setCurrentView('dashboard')}
          onLoadDemo={handleResetToDemo}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        />
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Left Sidebar */}
          <Sidebar
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            disputedAmount={activeClaim ? activeClaim.disputedAmount : 0}
          />

          {/* Center Main Stage */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {currentView === 'dashboard' && (
              <PatientDashboard
                claims={claims}
                policy={activePolicy}
                documents={documents}
                notifications={notifications}
                onNavigate={(view) => setCurrentView(view)}
                onResetDemo={handleResetToDemo}
              />
            )}

            {currentView === 'documents' && (
              <DocumentUploadCentre
                documents={documents}
                onAddDocument={handleAddDocument}
                onDeleteDocument={handleDeleteDocument}
                onLoadSampleDocs={() => {
                  storage.resetToDemo();
                  reloadFromStorage();
                }}
                onNavigateToCoverage={() => setCurrentView('coverage')}
              />
            )}

            {currentView === 'policy' && (
              <PolicyUnderstanding
                policy={activePolicy}
                onNavigateToCoverage={() => setCurrentView('coverage')}
              />
            )}

            {currentView === 'coverage' && (
              <CoverageAnalysis
                claim={activeClaim}
                policy={activePolicy}
                onNavigateToPreAuth={() => setCurrentView('preauth')}
                onNavigateToDenial={() => setCurrentView('denial')}
              />
            )}

            {currentView === 'preauth' && activeClaim.preAuthData && (
              <PreAuthGenerator
                initialData={activeClaim.preAuthData}
                onTransmitToPortal={(data) => {
                  setCurrentView('mockportal');
                }}
              />
            )}

            {currentView === 'mockportal' && activeClaim.preAuthData && (
              <MockInsurerPortal
                preAuthData={activeClaim.preAuthData}
                onClaimSubmitted={handleClaimSubmittedInPortal}
                onNavigateToTracking={() => setCurrentView('tracking')}
              />
            )}

            {currentView === 'tracking' && (
              <ClaimTracking
                claim={activeClaim}
                onUpdateStatus={handleUpdateClaimStatus}
                onNavigateToDenial={() => setCurrentView('denial')}
                onNavigateToAppeal={() => setCurrentView('appeal')}
              />
            )}

            {currentView === 'denial' && (
              <DenialAnalysisEngine
                claim={activeClaim}
                policy={activePolicy}
                documents={documents}
                onNavigateToAppeal={() => setCurrentView('appeal')}
                onNavigateToFollowUp={() => setCurrentView('followup')}
              />
            )}

            {currentView === 'appeal' && activeAppeal && (
              <AppealLetterGenerator
                initialAppeal={activeAppeal}
                claim={activeClaim}
                onNavigateToFollowUp={() => setCurrentView('followup')}
                onSaveAppeal={handleSaveAppeal}
              />
            )}

            {currentView === 'followup' && (
              <FollowUpAgent
                claim={activeClaim}
                followUps={followUps}
                onAddFollowUp={handleAddFollowUp}
              />
            )}

            {currentView === 'family' && (
              <FamilyDashboard
                claim={activeClaim}
                policy={activePolicy}
                profile={profile}
                onNavigateToTracking={() => setCurrentView('tracking')}
                onNavigateToDenial={() => setCurrentView('denial')}
              />
            )}
          </main>
        </div>
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onResetDemo={handleResetToDemo}
        userEmail={authUser?.email ?? null}
      />

      <LegalDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}
