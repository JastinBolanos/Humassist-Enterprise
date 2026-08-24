import { useState, useCallback } from 'react';
import { AppRole, UserSession } from '../domain';
import { USER_PROFILES } from '../data/mockData';
import { RBACService } from '../services';

export function useRBACSession(initialRole: AppRole = 'super_admin') {
  const [currentSession, setCurrentSession] = useState<UserSession>(
    USER_PROFILES[initialRole] || USER_PROFILES.super_admin
  );

  const switchRole = useCallback((role: AppRole) => {
    if (USER_PROFILES[role]) {
      setCurrentSession(USER_PROFILES[role]);
    }
  }, []);

  const setCustomSession = useCallback((session: UserSession) => {
    setCurrentSession(session);
  }, []);

  const hasPermission = useCallback((permKey: keyof UserSession['permissions']) => {
    return RBACService.hasPermission(currentSession, permKey);
  }, [currentSession]);

  return {
    currentSession,
    switchRole,
    setCustomSession,
    hasPermission
  };
}
