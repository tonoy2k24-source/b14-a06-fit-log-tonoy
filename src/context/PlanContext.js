"use client";
import { createContext, useContext, useEffect, useState } from "react";

const PlanContext = createContext(null);

export const PLAN_LIMIT = 5;

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function PlanProvider({ children }) {
  const [plan, setPlan] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPlan(read("fitlog-plan"));
      setSaved(read("fitlog-saved"));
      setLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("fitlog-plan", JSON.stringify(plan));
    localStorage.setItem("fitlog-saved", JSON.stringify(saved));
  }, [plan, saved, loaded]);

  const addToPlan = (workout) => {
    if (plan.some((item) => item.id === workout.id)) return "exists";
    if (plan.length >= PLAN_LIMIT) return "full";
    setPlan([...plan, { ...workout, done: false }]);
    return "added";
  };

  const saveForLater = (workout) => {
    if (saved.some((item) => item.id === workout.id)) return "exists";
    setSaved([...saved, workout]);
    return "saved";
  };

  const removeFromPlan = (id) => {
    setPlan(plan.filter((item) => item.id !== id));
  };

  const removeFromSaved = (id) => {
    setSaved(saved.filter((item) => item.id !== id));
  };

  const markDone = (id) => {
    setPlan(plan.map((item) => (item.id === id ? { ...item, done: true } : item)));
  };

  return (
    <PlanContext.Provider
      value={{
        plan,
        saved,
        loaded,
        addToPlan,
        saveForLater,
        removeFromPlan,
        removeFromSaved,
        markDone,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export const usePlan = () => useContext(PlanContext);