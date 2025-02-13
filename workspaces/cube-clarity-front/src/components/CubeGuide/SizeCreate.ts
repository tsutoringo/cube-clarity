export const sizeSet = (currentRefElement: HTMLElement) => {
  const width = currentRefElement?.clientWidth;
  const height = currentRefElement?.clientHeight;
  const aspect = width / height;

  const frustumSize = height;
  const left = (frustumSize * aspect) / -2;
  const right = (frustumSize * aspect) / 2;
  const top = frustumSize / 2;
  const bottom = frustumSize / -2;
  return [left, right, top, bottom];
};
