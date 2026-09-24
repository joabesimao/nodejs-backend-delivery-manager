export interface KmEntry {
  id: number;
  km: number;
  date: Date;
}

export const KM_OUT_OF_ORDER_MESSAGE =
  "O km informado não segue a ordem dos outros lançamentos deste veículo: deve ser maior que o lançamento anterior e menor que o seguinte (pela data).";

export const isKmSequenceValid = (entries: KmEntry[]): boolean => {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id
  );
  return sorted.every((entry, index) => index === 0 || entry.km > sorted[index - 1].km);
};
