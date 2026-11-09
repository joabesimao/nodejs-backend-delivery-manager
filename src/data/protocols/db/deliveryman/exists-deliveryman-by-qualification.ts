export interface ExistsDeliverymanByQualificationRepository {
  existsByNumberQualification(numberQualification: string): Promise<boolean>;
}
