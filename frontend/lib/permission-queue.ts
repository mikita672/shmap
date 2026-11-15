let queue: Promise<unknown> = Promise.resolve();

export function enqueuePermissionRequest<T>(
  request: () => Promise<T>,
): Promise<T> {
  const result = queue.then(request);
  queue = result.catch(() => undefined);
  return result;
}
