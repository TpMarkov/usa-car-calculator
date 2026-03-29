"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Car } from "@/types";

const LOCAL_STORAGE_KEY = "carsCache";

interface CarsContextType {
  cars: Car[];
  setCars: (cars: Car[] | ((prev: Car[]) => Car[])) => void;
  addCars: (newCars: Car[]) => void;
  clearCars: () => void;
  getCarById: (id: string) => Car | undefined;
}

const CarsContext = createContext<CarsContextType | undefined>(undefined);

export function CarsProvider({ children }: { children: ReactNode }) {
  const [cars, setCarsState] = useState<Car[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCarsState(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load cars from localStorage:", error);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage on update
  useEffect(() => {
    if (isInitialized && cars.length > 0) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cars));
      } catch (error) {
        console.error("Failed to save cars to localStorage:", error);
      }
    }
  }, [cars, isInitialized]);

  const setCars = useCallback((carsOrUpdater: Car[] | ((prev: Car[]) => Car[])) => {
    setCarsState((prev) => {
      const newCars = typeof carsOrUpdater === "function" ? carsOrUpdater(prev) : carsOrUpdater;
      return newCars;
    });
  }, []);

  const addCars = useCallback((newCars: Car[]) => {
    setCarsState((prev) => {
      // Merge and avoid duplicates by ID
      const existingIds = new Set(prev.map((c) => c.id));
      const uniqueNewCars = newCars.filter((c) => !existingIds.has(c.id));
      return [...prev, ...uniqueNewCars];
    });
  }, []);

  const clearCars = useCallback(() => {
    setCarsState([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear cars from localStorage:", error);
    }
  }, []);

  const getCarById = useCallback(
    (id: string): Car | undefined => {
      return cars.find((car) => car.id === id);
    },
    [cars]
  );

  return (
    <CarsContext.Provider
      value={{
        cars,
        setCars,
        addCars,
        clearCars,
        getCarById,
      }}
    >
      {children}
    </CarsContext.Provider>
  );
}

export function useCars() {
  const context = useContext(CarsContext);
  if (context === undefined) {
    throw new Error("useCars must be used within a CarsProvider");
  }
  return context;
}