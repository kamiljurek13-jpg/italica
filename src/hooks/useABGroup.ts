import { useState } from 'react';

export type ABGroup = 'A' | 'B';

export function getABGroup(): ABGroup {
  const match = document.cookie.match(/(?:^|;\s*)ab_group=([AB])/);
  return (match?.[1] as ABGroup) ?? 'A';
}

export function useABGroup(): ABGroup {
  const [group] = useState<ABGroup>(() => getABGroup());
  return group;
}
