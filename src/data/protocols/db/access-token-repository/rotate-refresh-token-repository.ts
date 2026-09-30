export interface RotateRefreshTokenRepository {
  /**
   * Troca o refresh token somente se o hash atual ainda for `currentHash`
   * (compare-and-swap). Retorna false quando outra requisição já rotacionou.
   */
  rotateRefreshToken(
    id: number,
    currentHash: string,
    newHash: string,
    expiresAt: Date | null,
  ): Promise<boolean>;
}
