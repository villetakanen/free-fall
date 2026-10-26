// Spec: specs/design-system/harm-slot/spec.md
export const HARM_TYPES = ["physical", "psychic", "compromise"] as const;
export type HarmType = (typeof HARM_TYPES)[number];
export type HarmSlot =
  | { state: "empty"; type: null; description: "" }
  | {
      state: "transient" | "permanent";
      type: HarmType;
      description: string;
    };
export const emptyHarm = (): HarmSlot => ({
  state: "empty",
  type: null,
  description: "",
});
export function actionPool(harm: readonly HarmSlot[]): number {
  return Math.max(2, 5 - harm.filter((slot) => slot.state !== "empty").length);
}
