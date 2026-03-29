"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Car } from "@/types";

// CarsContext type definition
interface CarsContextType {
  cars: Car[];
  addCars: (cars: Car[]) => void;
  removeCar: (carId: string) => void;
  clearCars: () => void;
}

// Create context with default values
const CarsContext = createContext<CarsContextType | undefined>(undefined);

// Provider component
interface CarsProviderProps {
  children: ReactNode;
}

export function CarsProvider({ children }: CarsProviderProps) {
  const [cars, setCars] = useState<Car[]>([]);

  const addCars = useCallback((newCars: Car[]) => {
    setCars((prevCars) => {
      // Avoid adding duplicates based on car id
      const existingIds = new Set(prevCars.map((c) => c.id));
      const uniqueNewCars = newCars.filter((car) => !existingIds.has(car.id));
      return [...prevCars, ...uniqueNewCars];
    });
  }, []);

  const removeCar = useCallback((carId: string) => {
    setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
  }, []);

  const clearCars = useCallback(() => {
    setCars([]);
  }, []);

  const value: CarsContextType = {
    cars,
    addCars,
    removeCar,
    clearCars,
  };

  return <CarsContext.Provider value={value}>{children}</CarsContext.Provider>;
}

// Custom hook for using the cars context
export function useCars(): CarsContextType {
  const context = useContext(CarsContext);
  if (context === undefined) {
    throw new Error("useCars must be used within a CarsProvider");
  }
  return context;
}
