import type { Gym } from "@/generated/client";

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
}
