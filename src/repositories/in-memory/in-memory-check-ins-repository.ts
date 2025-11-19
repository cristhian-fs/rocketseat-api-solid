import type { CheckIn } from "@/generated/client";
import type { CheckInUncheckedCreateInput } from "@/generated/models";
import { randomUUID } from "crypto";
import type { CheckInsRepository } from "../check-ins-repository";
import { endOfDay, isAfter, isBefore, startOfDay } from "date-fns";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []
  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.items.filter(item => item.user_id === userId).slice((page - 1) * 20, page * 20)
  }
  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.items.find(item => item.id === id);

    if (!checkIn) return null;

    return checkIn
  }
  async save(data: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.items.findIndex(checkIn => checkIn.id === data.id)

    if (checkInIndex > 0) {
      this.items[checkInIndex] = data
    }

    return data
  }
  async countByUserId(userId: string): Promise<number> {
    return this.items.filter(item => item.user_id === userId).length
  }
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

    const startOfDate = startOfDay(date);
    const endOfDate = endOfDay(date);

    const checkInOnSameDay = this.items.find((item) => {

      const isTheSameDay = isAfter(item.created_at, startOfDate) && isBefore(item.created_at, endOfDate)

      return item.user_id === userId && isTheSameDay
    })

    if (!checkInOnSameDay) return null

    return checkInOnSameDay
  }
}
