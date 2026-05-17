import type { ControlId } from './instrument';

export type InputBinding = {
  inputCode: string;
  inputLabel: string;
  controlId: ControlId;
};

export function createInputMapping(bindings: InputBinding[]) {
  const controlIdByInputCode = new Map(bindings.map((binding) => [binding.inputCode, binding.controlId]));
  const labelByControlId = new Map(bindings.map((binding) => [binding.controlId, binding.inputLabel]));

  return {
    bindings,
    controlIdForInput(inputCode: string) {
      return controlIdByInputCode.get(inputCode);
    },
    labelForControl(controlId: ControlId) {
      return labelByControlId.get(controlId);
    },
  };
}
