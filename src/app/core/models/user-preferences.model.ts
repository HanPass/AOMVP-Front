export interface UserPreferences {
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  dashboardDefaultView: 'funnel' | 'list';
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  language: 'fr',
  theme: 'light',
  emailNotifications: true,
  dashboardDefaultView: 'funnel'
};
