import { QualificationInUseError } from "../../errors";
import { Validation } from "../../protocols/validation";

export interface QualificationDuplicateValidator {
  validate(numberQualification: string): Promise<boolean>;
}

export class QualificationDuplicateValidation implements Validation {
  constructor(private readonly qualificationValidator: QualificationDuplicateValidator) {}

  async validate(input: any): Promise<Error | null> {
    const numberQualification = input.numberQualification;

    if (!numberQualification) {
      return null;
    }

    const isQualificationDuplicate = await this.qualificationValidator.validate(numberQualification);

    if (isQualificationDuplicate) {
      return new QualificationInUseError();
    }

    return null;
  }
}
