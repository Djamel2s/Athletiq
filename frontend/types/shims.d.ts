import type { $Fetch } from 'ofetch';

declare global {
  // eslint-disable-next-line no-var
  var $fetch: $Fetch;
}

export {};
