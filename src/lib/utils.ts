export function nextTick() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Promise((res, rej)=> {
    setTimeout(res);
  });
}
