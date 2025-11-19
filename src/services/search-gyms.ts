import type { Gym } from "@/generated/client";
import type { GymsRepository } from "@/repositories/gyms-repository";

interface SearchGymsServiceRequest {
  query: string,
  page: number
}
interface SearchGymsServiceResponse {
  gyms: Gym[]
}
export class SearchGymsService {
  constructor(private gymsRepository: GymsRepository) { }

  async execute({
    query,
    page
  }: SearchGymsServiceRequest): Promise<SearchGymsServiceResponse> {

    const gyms = await this.gymsRepository.searchMany(
      query,
      page
    );

    return {
      gyms
    }
  }
}

