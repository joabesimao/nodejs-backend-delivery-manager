export interface KmEntry {
  id: number;
  km: number;
  date: Date;
}

export const KM_OUT_OF_ORDER_MESSAGE =
  "O km informado não segue a ordem dos outros lançamentos deste veículo: deve ser maior que o lançamento anterior e menor que o seguinte (pela data).";

export const isKmSequenceValid = (entries: KmEntry[]): boolean => {
  const sorted = [...entries].sort(
    (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id,
  );
  return sorted.every(
    (entry, index) => index === 0 || entry.km > sorted[index - 1].km,
  );
};

export interface KmNeighbors {
  previous?: KmEntry;
  next?: KmEntry;
}

export const findKmNeighbors = (
  entries: KmEntry[],
  date: Date,
): KmNeighbors => {
  const time = new Date(date).getTime();
  const sorted = [...entries].sort(
    (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id,
  );
  const nextIndex = sorted.findIndex(
    (entry) => new Date(entry.date).getTime() > time,
  );
  const previousIndex = (nextIndex === -1 ? sorted.length : nextIndex) - 1;
  return {
    previous: previousIndex >= 0 ? sorted[previousIndex] : undefined,
    next: nextIndex === -1 ? undefined : sorted[nextIndex],
  };
};

export const isKmBetweenNeighbors = (
  { previous, next }: KmNeighbors,
  km: number,
): boolean => (!previous || km > previous.km) && (!next || km < next.km);
