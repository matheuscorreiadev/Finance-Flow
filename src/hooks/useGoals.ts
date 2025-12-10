import { useState, useEffect } from 'react';
import { Goal } from '@/types/goal';

const STORAGE_KEY = 'financeflow_goals';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setGoals(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    }
  }, []);

  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGoals));
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    saveGoals([...goals, newGoal]);
  };

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id));
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    saveGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  return {
    goals,
    addGoal,
    deleteGoal,
    updateGoal,
  };
};
