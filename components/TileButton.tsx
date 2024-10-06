import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { TileKey } from '@/lib/mahjong-utils'

interface TileButtonProps {
  tile: TileKey;
  onClick: (tile: TileKey) => void;
  disabled?: boolean;
  className?: string;
}

export default function TileButton({ tile, onClick, disabled, className }: TileButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={() => onClick(tile)}
      disabled={disabled}
      className={`p-0 w-[66px] h-[90px] relative ${className}`}
    >
      <Image
        src="/0m.png"
        alt={tile}
        width={66}
        height={90}
        className="object-contain"
      />
      <span className="absolute bottom-1 right-1 text-xs bg-background bg-opacity-70 px-1 rounded">
        {tile}
      </span>
    </Button>
  )
}