"use client";

import { useActionState } from "react";
import {
  markAbsentAction,
  timeInAction,
  timeOutAction,
} from "@/app/actions/attendance";
import { emptyActionState } from "@/lib/validation";
import Failed from "@/components/ui/PopUps/Failed";
import SubmitButton from "@/components/ui/Form/SubmitButton";
import Success from "@/components/ui/PopUps/Success";

type AttendanceControlsProps = {
  employeeId: number;
  hasTimeIn: boolean;
  hasTimeOut: boolean;
};

export default function AttendanceControls({
  employeeId,
  hasTimeIn,
  hasTimeOut,
}: AttendanceControlsProps) {
  const [timeInState, timeInFormAction] = useActionState(
    timeInAction,
    emptyActionState,
  );
  const [timeOutState, timeOutFormAction] = useActionState(
    timeOutAction,
    emptyActionState,
  );
  const [absentState, absentFormAction] = useActionState(
    markAbsentAction,
    emptyActionState,
  );
  const state = timeInState.message
    ? timeInState
    : timeOutState.message
      ? timeOutState
      : absentState;

  return (
    <div className="grid gap-2">
      {state.ok ? <Success message={state.message} /> : <Failed message={state.message} />}
      <div className="flex flex-wrap gap-2">
        <form action={timeInFormAction}>
          <input type="hidden" name="employeeId" value={employeeId} />
          <SubmitButton pendingLabel="Saving..." variant="primary">
            {hasTimeIn ? "Timed in" : "Time in"}
          </SubmitButton>
        </form>
        <form action={timeOutFormAction}>
          <input type="hidden" name="employeeId" value={employeeId} />
          <SubmitButton
            pendingLabel="Saving..."
            variant="secondary"
            className={!hasTimeIn || hasTimeOut ? "opacity-50" : ""}
          >
            {hasTimeOut ? "Timed out" : "Time out"}
          </SubmitButton>
        </form>
        <form action={absentFormAction}>
          <input type="hidden" name="employeeId" value={employeeId} />
          <SubmitButton pendingLabel="Saving..." variant="danger">
            Mark absent
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}


