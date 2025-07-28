"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";

export interface DataRow {
  id: string;
  [key: string]: any;
  refCode?: string;
  createdDate?: string;
  issues?: {
    missing: string[];
    null: string[];
    duplicate: boolean;
  };
}

export interface DataState {
  rawData: DataRow[];
  processedData: DataRow[];
  columns: string[];
  currentStep: number;
  fileName: string;
  validationSettings: {
    [key: string]: {
      action: "delete" | "replace" | "manual" | "keep";
      value?: string;
    };
  };
}

type DataAction =
  | {
      type: "SET_RAW_DATA";
      payload: { data: DataRow[]; columns: string[]; fileName: string };
    }
  | { type: "SET_PROCESSED_DATA"; payload: DataRow[] }
  | { type: "SET_CURRENT_STEP"; payload: number }
  | {
      type: "UPDATE_VALIDATION_SETTINGS";
      payload: { key: string; action: string; value?: string };
    }
  | { type: "UPDATE_ROW"; payload: { id: string; data: Partial<DataRow> } }
  | { type: "DELETE_ROW"; payload: string }
  | { type: "RESET_DATA" };

const initialState: DataState = {
  rawData: [],
  processedData: [],
  columns: [],
  currentStep: 1,
  fileName: "",
  validationSettings: {},
};

function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case "SET_RAW_DATA":
      return {
        ...state,
        rawData: action.payload.data,
        processedData: action.payload.data,
        columns: action.payload.columns,
        fileName: action.payload.fileName,
      };
    case "SET_PROCESSED_DATA":
      return {
        ...state,
        processedData: action.payload,
      };
    case "SET_CURRENT_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };
    case "UPDATE_VALIDATION_SETTINGS":
      return {
        ...state,
        validationSettings: {
          ...state.validationSettings,
          [action.payload.key]: {
            action: action.payload.action as any,
            value: action.payload.value,
          },
        },
      };
    case "UPDATE_ROW":
      return {
        ...state,
        processedData: state.processedData.map((row) =>
          row.id === action.payload.id
            ? { ...row, ...action.payload.data }
            : row
        ),
      };
    case "DELETE_ROW":
      return {
        ...state,
        processedData: state.processedData.filter(
          (row) => row.id !== action.payload
        ),
      };
    case "RESET_DATA":
      return initialState;
    default:
      return state;
  }
}

const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<DataAction>;
} | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const hasInitializedRef = useRef(false);

  // Save to localStorage
  useEffect(() => {
     if (hasInitializedRef.current) {
      localStorage.setItem("dataManagementState", JSON.stringify(state));
    }
  }, [state]);

  // Load from localStorage
  useEffect(() => {
    // if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dataManagementState");
      if (saved) {
        try {
          const parsedState = JSON.parse(saved);
          if (parsedState.rawData.length > 0) {
            dispatch({
              type: "SET_RAW_DATA",
              payload: {
                data: parsedState.rawData,
                columns: parsedState.columns,
                fileName: parsedState.fileName,
              },
            });
            dispatch({
              type: "SET_CURRENT_STEP",
              payload: parsedState.currentStep,
            });
          }
        } catch (error) {
          console.error("Error loading saved state:", error);
        }
      }
    // }
  }, []);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
