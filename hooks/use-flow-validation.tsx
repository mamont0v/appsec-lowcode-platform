import { FlowValidationContext } from "@/context/flow-validation-context";
import { useContext } from "react";

export default function useFlowValidation() {
    const context = useContext(FlowValidationContext);
    if (!context) {
        throw new Error("useFlowValidation must be used within a FlowValidationContextProvider");
    }
    return context;
} 