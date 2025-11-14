import type { CheckIn } from "@/generated/client";
import type { CheckInUncheckedCreateInput } from "@/generated/models";
import { randomUUID } from "crypto";
import type { CheckInsRepository } from "../check-ins-repository";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []
  async create(data: CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date()

    }
    this.items.push(checkIn);

    return checkIn
  }
  async findByIdAndDate(userId: string, date: Date): Promise<CheckIn | null> {
    const checkInOnSameDay = this.items.find((item) => item.user_id === userId)

    if (!checkInOnSameDay) return null

    return checkInOnSameDay
  }
}
