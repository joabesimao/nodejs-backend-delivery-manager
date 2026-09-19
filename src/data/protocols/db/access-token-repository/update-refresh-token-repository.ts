export interface UpdateRefreshTokenRepository {
  updateRefreshToken(
    id: number,
    refreshTokenHash: string | null,
    expiresAt: Date | null,
  ): Promise<void>;
}
