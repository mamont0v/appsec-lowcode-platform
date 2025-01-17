import { FlowToExecutionPlan, FlowToExecutionPlanValidationError } from '@/lib/workflow/execution-plan';
import { AppNode } from '@/types/app-node';
import { useReactFlow } from '@xyflow/react';
import React, { useCallback } from 'react'
import useFlowValidation from './use-flow-validation';
import { toast } from 'sonner';

const useExecutionPlan = () => {
    const { toObject } = useReactFlow(); // extact object nodes,edges an etc.
    const { setInvalidInputs, clearErrors } = useFlowValidation();

    const handleErrors = useCallback((error: any) => {
        switch (error.type) {
            case FlowToExecutionPlanValidationError.MISSING_ENTRY_POINT:
                toast.error("Missing entry point");
                break;
            case FlowToExecutionPlanValidationError.MISSING_INPUTS:
                toast.error("Missing inputs");
                setInvalidInputs(error.invalidElements);
                break;
            case FlowToExecutionPlanValidationError.CYCLIC_DEPENDENCIES:
                toast.error("Cyclic dependencies");
                break;
            default:
                toast.error("Unknown error");
                break;
        }
    }, [setInvalidInputs]);

    const generateExecutionPlan = useCallback(() => {
        const { nodes, edges } = toObject();
        const { executionPlan, error } = FlowToExecutionPlan(
            nodes as AppNode[],
            edges
        );
        if (error) {
            handleErrors(error);
            return null;
        }

        clearErrors();
        return executionPlan;
    }, [toObject, handleErrors, clearErrors]);

    return generateExecutionPlan;
}

export default useExecutionPlan;