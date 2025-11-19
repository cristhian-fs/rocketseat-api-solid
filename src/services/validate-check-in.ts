import type { CheckIn } from "@/generated/client"; import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { differenceInMinutes } from 'date-fns'
import { LateCheckInValidationTimeError } from "./errors/late-check-in-validation-time-error";
interface ValidateCheckInServiceRequest {
  checkInId: string
}

interface ValidateCheckInServiceResponse {
  checkIn: CheckIn
};

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) { }

  async execute(
    { checkInId }: ValidateCheckInServiceRequest,
  ): Promise<ValidateCheckInServiceResponse> {

    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }


    checkIn.validated_at = new Date();

    const diffFromValidationTimeToCheckInCreation = differenceInMinutes(new Date(), checkIn.created_at);

    if (diffFromValidationTimeToCheckInCreation > 20) {
      throw new LateCheckInValidationTimeError()
    }

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn
    }
  }
}
