import {
  UserProfile,
  InsurancePolicy,
  Claim,
  UploadedDocument,
  AppealLetter,
  FollowUpRecord,
  AppNotification,
  PolicyClause,
  PreAuthorisationForm,
  DenialAnalysis
} from '../types';
import {
  DEMO_USER_PROFILE,
  DEMO_POLICY,
  DEMO_CLAIM,
  DEMO_UPLOADED_DOCUMENTS,
  DEMO_APPEAL_LETTER,
  DEMO_FOLLOW_UPS,
  DEMO_NOTIFICATIONS
} from '../data/mockData';
import { supabase } from '../lib/supabaseClient';

const STORAGE_KEYS = {
  PROFILE: 'claimsathi_profiles_v1',
  POLICIES: 'claimsathi_policies_v1',
  DOCUMENTS: 'claimsathi_documents_v1',
  CLAIMS: 'claimsathi_claims_v1',
  APPEALS: 'claimsathi_appeals_v1',
  FOLLOW_UPS: 'claimsathi_followups_v1',
  NOTIFICATIONS: 'claimsathi_notifications_v1',
  CURRENT_USER_ID: 'claimsathi_current_user_id_v1',
  DEMO_MODE: 'claimsathi_demo_mode_v1'
};

const REMOTE_DATA_KEYS = [
  STORAGE_KEYS.PROFILE,
  STORAGE_KEYS.POLICIES,
  STORAGE_KEYS.DOCUMENTS,
  STORAGE_KEYS.CLAIMS,
  STORAGE_KEYS.APPEALS,
  STORAGE_KEYS.FOLLOW_UPS,
  STORAGE_KEYS.NOTIFICATIONS
] as const;

class StorageService {
  private remoteUserId: string | null = null;
  private hydratingRemoteData = false;
  private remoteSaveQueue: Promise<void> = Promise.resolve();

  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
      this.resetToDemo();
    }
  }

  private queueRemoteSave(): void {
    if (!this.remoteUserId || this.hydratingRemoteData) return;
    this.remoteSaveQueue = this.remoteSaveQueue
      .then(() => this.persistRemoteData())
      .catch((error) => console.error('Could not save app data to Supabase:', error));
  }

  private async persistRemoteData(): Promise<void> {
    if (!this.remoteUserId) return;
    const data: Record<string, unknown> = {};
    for (const key of REMOTE_DATA_KEYS) {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        try {
          data[key] = JSON.parse(raw);
        } catch {
          data[key] = raw;
        }
      }
    }

    const { error } = await supabase.from('user_app_data').upsert(
      { user_id: this.remoteUserId, data, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
    if (error) throw error;
  }

  public async activateRemoteUser(userId: string, email: string): Promise<void> {
    this.remoteUserId = userId;
    this.hydratingRemoteData = true;
    try {
      const { data: saved, error } = await supabase
        .from('user_app_data')
        .select('data')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;

      if (saved?.data) {
        const snapshot = saved.data as Record<string, unknown>;
        for (const key of REMOTE_DATA_KEYS) {
          if (snapshot[key] !== undefined) {
            localStorage.setItem(key, JSON.stringify(snapshot[key]));
          }
        }
      } else {
        // Keep the current demo workspace as a starter for the first signed-in session.
        const profile = { ...this.getProfile(), id: userId, email };
        const policies = this.getPolicies().map((item) => ({ ...item, userId }));
        const documents = this.getDocuments().map((item) => ({ ...item, userId }));
        const claims = this.getClaims().map((item) => ({ ...item, userId }));
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify([profile]));
        localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(policies));
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
        localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
      }

      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
      localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'false');
    } finally {
      this.hydratingRemoteData = false;
    }

    await this.persistRemoteData();
  }

  public clearRemoteUser(): void {
    this.remoteUserId = null;
  }

  public resetToDemo(): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify([DEMO_USER_PROFILE]));
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify([DEMO_POLICY]));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(DEMO_UPLOADED_DOCUMENTS));
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify([DEMO_CLAIM]));
    localStorage.setItem(STORAGE_KEYS.APPEALS, JSON.stringify([DEMO_APPEAL_LETTER]));
    localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(DEMO_FOLLOW_UPS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEMO_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, DEMO_USER_PROFILE.id);
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'true');
    this.queueRemoteSave();
  }

  public clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.POLICIES);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.CLAIMS);
    localStorage.removeItem(STORAGE_KEYS.APPEALS);
    localStorage.removeItem(STORAGE_KEYS.FOLLOW_UPS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'false');
    this.queueRemoteSave();
  }

  public isDemoMode(): boolean {
    return localStorage.getItem(STORAGE_KEYS.DEMO_MODE) !== 'false';
  }

  public setDemoMode(isDemo: boolean): void {
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, String(isDemo));
    this.queueRemoteSave();
  }

  // Row Level Security (RLS) simulation: filters records by current user
  public getCurrentUserId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || DEMO_USER_PROFILE.id;
  }

  public setCurrentUserId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
  }

  // Profile
  public getProfile(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEMO_USER_PROFILE;
    try {
      const profiles: UserProfile[] = JSON.parse(raw);
      const currentId = this.getCurrentUserId();
      return profiles.find((p) => p.id === currentId) || profiles[0] || DEMO_USER_PROFILE;
    } catch {
      return DEMO_USER_PROFILE;
    }
  }

  public saveProfile(profile: UserProfile): void {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    let profiles: UserProfile[] = raw ? JSON.parse(raw) : [];
    const index = profiles.findIndex((p) => p.id === profile.id);
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profiles));
    this.setCurrentUserId(profile.id);
    this.queueRemoteSave();
  }

  // Policies
  public getPolicies(): InsurancePolicy[] {
    const raw = localStorage.getItem(STORAGE_KEYS.POLICIES);
    if (!raw) return [DEMO_POLICY];
    try {
      const currentId = this.getCurrentUserId();
      const all: InsurancePolicy[] = JSON.parse(raw);
      // RLS Policy: auth.uid() = policy.user_id
      return all.filter((p) => p.userId === currentId);
    } catch {
      return [DEMO_POLICY];
    }
  }

  public savePolicy(policy: InsurancePolicy): void {
    const raw = localStorage.getItem(STORAGE_KEYS.POLICIES);
    let policies: InsurancePolicy[] = raw ? JSON.parse(raw) : [];
    const index = policies.findIndex((p) => p.id === policy.id);
    if (index >= 0) {
      policies[index] = policy;
    } else {
      policies.push(policy);
    }
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(policies));
    this.queueRemoteSave();
  }

  // Documents
  public getDocuments(): UploadedDocument[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!raw) return DEMO_UPLOADED_DOCUMENTS;
    try {
      const currentId = this.getCurrentUserId();
      const docs: UploadedDocument[] = JSON.parse(raw);
      return docs.filter((d) => d.userId === currentId);
    } catch {
      return DEMO_UPLOADED_DOCUMENTS;
    }
  }

  public saveDocument(doc: UploadedDocument): void {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    let docs: UploadedDocument[] = raw ? JSON.parse(raw) : [];
    const index = docs.findIndex((d) => d.id === doc.id);
    if (index >= 0) {
      docs[index] = doc;
    } else {
      docs.unshift(doc);
    }
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
    this.queueRemoteSave();
  }

  public deleteDocument(docId: string): void {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!raw) return;
    let docs: UploadedDocument[] = JSON.parse(raw);
    docs = docs.filter((d) => d.id !== docId);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
    this.queueRemoteSave();
  }

  // Claims
  public getClaims(): Claim[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CLAIMS);
    if (!raw) return [DEMO_CLAIM];
    try {
      const currentId = this.getCurrentUserId();
      const claims: Claim[] = JSON.parse(raw);
      return claims.filter((c) => c.userId === currentId);
    } catch {
      return [DEMO_CLAIM];
    }
  }

  public getClaimById(id: string): Claim | undefined {
    return this.getClaims().find((c) => c.id === id);
  }

  public saveClaim(claim: Claim): void {
    const raw = localStorage.getItem(STORAGE_KEYS.CLAIMS);
    let claims: Claim[] = raw ? JSON.parse(raw) : [];
    const index = claims.findIndex((c) => c.id === claim.id);
    if (index >= 0) {
      claims[index] = claim;
    } else {
      claims.unshift(claim);
    }
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
    this.queueRemoteSave();
  }

  // Appeals
  public getAppeals(): AppealLetter[] {
    const raw = localStorage.getItem(STORAGE_KEYS.APPEALS);
    if (!raw) return [DEMO_APPEAL_LETTER];
    try {
      return JSON.parse(raw);
    } catch {
      return [DEMO_APPEAL_LETTER];
    }
  }

  public saveAppeal(appeal: AppealLetter): void {
    const raw = localStorage.getItem(STORAGE_KEYS.APPEALS);
    let appeals: AppealLetter[] = raw ? JSON.parse(raw) : [];
    const index = appeals.findIndex((a) => a.id === appeal.id);
    if (index >= 0) {
      appeals[index] = appeal;
    } else {
      appeals.unshift(appeal);
    }
    localStorage.setItem(STORAGE_KEYS.APPEALS, JSON.stringify(appeals));
    this.queueRemoteSave();
  }

  // Follow Ups
  public getFollowUps(): FollowUpRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FOLLOW_UPS);
    if (!raw) return DEMO_FOLLOW_UPS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEMO_FOLLOW_UPS;
    }
  }

  public saveFollowUp(fu: FollowUpRecord): void {
    const raw = localStorage.getItem(STORAGE_KEYS.FOLLOW_UPS);
    let list: FollowUpRecord[] = raw ? JSON.parse(raw) : [];
    const index = list.findIndex((f) => f.id === fu.id);
    if (index >= 0) {
      list[index] = fu;
    } else {
      list.unshift(fu);
    }
    localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(list));
    this.queueRemoteSave();
  }

  // Notifications
  public getNotifications(): AppNotification[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return DEMO_NOTIFICATIONS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEMO_NOTIFICATIONS;
    }
  }

  public markNotificationAsRead(id: string): void {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return;
    let notifs: AppNotification[] = JSON.parse(raw);
    notifs = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    this.queueRemoteSave();
  }

  public addNotification(notif: Omit<AppNotification, 'id' | 'time'>): void {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    let notifs: AppNotification[] = raw ? JSON.parse(raw) : [];
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      time: 'Just now'
    };
    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    this.queueRemoteSave();
  }
}

export const storage = new StorageService();
