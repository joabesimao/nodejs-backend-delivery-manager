export const map = (obj: any): any => {
  const { _id, ...objWithoutId } = obj;
  return Object.assign({}, objWithoutId, { id: _id });
};
