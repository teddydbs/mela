'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_DATA,
  applyAnswer,
  loadUserData,
  resetUserData,
  saveUserData,
  type AnswerOutcome,
} from '@/lib/storage';
import type { UserData } from '@/lib/types';

export function useUserData() {
  const [data, setData] = useState<UserData>(DEFAULT_DATA);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(loadUserData());
    setLoaded(true);
  }, []);

  const update = useCallback((next: UserData) => {
    setData(next);
    saveUserData(next);
  }, []);

  const recordAnswer = useCallback(
    (outcome: AnswerOutcome) => {
      const next = applyAnswer(data, outcome);
      setData(next);
      saveUserData(next);
      return next;
    },
    [data],
  );

  const reset = useCallback(() => {
    resetUserData();
    setData(DEFAULT_DATA);
  }, []);

  return { data, loaded, update, recordAnswer, reset };
}
