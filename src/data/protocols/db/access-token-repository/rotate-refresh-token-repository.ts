export interface RotateRefreshTokenRepository {
  rotateRefreshToken(
    id: number,
    currentHash: string,
    newHash: string,
    expiresAt: Date | null,
  ): Promise<boolean>;
}
