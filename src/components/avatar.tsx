'use client';

/**
 * DiceBear avatars (free, generated from URL, cached on their CDN).
 * Style "fun-emoji" gives a friendly cartoon look.
 * See https://www.dicebear.com/styles/fun-emoji/
 * Using plain <img> because these are SVGs - no optimization needed.
 */
const SEEDS = ['Aria', 'Felix', 'Maya', 'Liam', 'Zoe', 'Noah', 'Mila', 'Kai'];

export function CartoonAvatar({
  seed,
  size = 36,
  className = '',
}: {
  seed: string;
  size?: number;
  className?: string;
}) {
  const url = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(seed)}&backgroundColor=transparent`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={`Avatar ${seed}`}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
    />
  );
}

export function AvatarStack({ count = 4, size = 32 }: { count?: number; size?: number }) {
  const list = SEEDS.slice(0, count);
  return (
    <div className="flex -space-x-2">
      {list.map((seed) => (
        <div
          key={seed}
          className="rounded-full bg-white shadow-sm border-2 border-white overflow-hidden"
          style={{ width: size, height: size }}
        >
          <CartoonAvatar seed={seed} size={size} />
        </div>
      ))}
    </div>
  );
}
