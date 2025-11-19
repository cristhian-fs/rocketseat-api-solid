import type { CheckIn } from "@/generated/client";
import type { CheckInUncheckedCreateInput } from "@/generated/models";
import type { CheckInsRepository } from "../check-ins-repository";
import { prisma } from "@/lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId
      },
      skip: (page - 1) * 20,
      take: 20
    })

    return checkIns
  }

  async save(data: CheckIn): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data: data
    })

    return checkIn
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId
      }
    })
    return count
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id
      }
    })

    return checkIn
  }

  async findByIdAndDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfDate = startOfDay(date);
    const endOfDate = endOfDay(date);

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfDate.toDateString(),
          lte: endOfDate.toDateString(),
        }
      }
    })

    return checkIn
  }
}
