"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
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
    autoRemoveSuggestion?: boolean;
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
  | { type: "RESET_DATA" }
  | {
      type: "BULK_UPDATE_ROWS";
      payload: { updates: { id: string; data: Partial<DataRow> }[] };
    };

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
    case "BULK_UPDATE_ROWS":
      const updatesMap = new Map(
        action.payload.updates.map((u) => [u.id, u.data])
      );
      return {
        ...state,
        processedData: state.processedData.map((row) =>
          updatesMap.has(row.id) ? { ...row, ...updatesMap.get(row.id) } : row
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
  isInitialized: boolean;
} | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const hasInitializedRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Save to localStorage
  // useEffect(() => {
  //   if (hasInitializedRef.current) {
  //     localStorage.setItem("dataManagementState", JSON.stringify(state));
  //   }
  // }, [state]);

  // ปรับปรุง useEffect ที่โหลดข้อมูล
  useEffect(() => {
    const saved = localStorage.getItem("dataManagementState");
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        // รับรองว่ามีข้อมูลก่อนทำการ dispatch
        if (
          parsedState &&
          parsedState.rawData &&
          parsedState.rawData.length > 0
        ) {
          // กำหนดค่าทั้ง state แทนที่จะใช้เฉพาะบางส่วน
          dispatch({
            type: "SET_RAW_DATA",
            payload: {
              data: parsedState.rawData,
              columns: parsedState.columns || [],
              fileName: parsedState.fileName || "",
            },
          });

          if (
            parsedState.processedData &&
            parsedState.processedData.length > 0
          ) {
            dispatch({
              type: "SET_PROCESSED_DATA",
              payload: parsedState.processedData,
            });
          }

          if (parsedState.currentStep) {
            dispatch({
              type: "SET_CURRENT_STEP",
              payload: parsedState.currentStep,
            });
          }

          // โหลด validationSettings ถ้ามี
          if (parsedState.validationSettings) {
            // อาจต้องเพิ่ม action สำหรับ SET_VALIDATION_SETTINGS
            Object.entries(parsedState.validationSettings).forEach(
              ([key, setting]) => {
                dispatch({
                  type: "UPDATE_VALIDATION_SETTINGS",
                  payload: {
                    key,
                    action: (setting as any).action,
                    value: (setting as any).value,
                  },
                });
              }
            );
          }
        }
      } catch (error) {
        console.error("Error loading saved state:", error);
      }
      hasInitializedRef.current = true;
      setIsInitialized(true);
    } else {
      setIsInitialized(true); // ต้องตั้งค่าเป็น true แม้ไม่มีข้อมูล
    }
  }, []);

  useEffect(() => {
    if (hasInitializedRef.current) {
      localStorage.setItem(
        "dataManagementState",
        JSON.stringify({
          ...state,
          processedData: state.processedData,
        })
      );
    }
  }, [state.processedData]);

  return (
    // <DataContext.Provider value={{ state, dispatch,  }}>
    <DataContext.Provider value={{ state, dispatch, isInitialized }}>
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
