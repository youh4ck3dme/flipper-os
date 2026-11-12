import { useEffect } from "react";
import { useOs } from "@/lib/store";

export function Boot() {
  useEffect(() => {
    void useOs.persist.rehydrate();
  }, []);
  return null;
}
