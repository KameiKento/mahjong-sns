export const tileTypes = ['m', 'p', 's', 'z'] as const;
export type TileType = typeof tileTypes[number];

export const tileMap = {
  '1m': '🀇', '2m': '🀈', '3m': '🀉', '4m': '🀊', '5m': '🀋', '0m': '🀋', '6m': '🀌', '7m': '🀍', '8m': '🀎', '9m': '🀏',
  '1p': '🀙', '2p': '🀚', '3p': '🀛', '4p': '🀜', '5p': '🀝', '0p': '🀝', '6p': '🀞', '7p': '🀟', '8p': '🀠', '9p': '🀡',
  '1s': '🀐', '2s': '🀑', '3s': '🀒', '4s': '🀓', '5s': '🀔', '0s': '🀔', '6s': '🀕', '7s': '🀖', '8s': '🀗', '9s': '🀘',
  '1z': '🀀', '2z': '🀁', '3z': '🀂', '4z': '🀃', '5z': '🀆', '6z': '🀅', '7z': '🀄'
};

export type TileKey = keyof typeof tileMap;

export function isValidTile(tile: string): tile is TileKey {
  return tile in tileMap;
}

export function convertToEmoji(hand: string): string {
  return hand.split(' ').map(tile => tileMap[tile as TileKey] || tile).join('');
}

export function validateHand(hand: TileKey[]): string | null {
  if (hand.length > 14) return "手牌は14枚を超えることはできません";
  
  const tileCounts: { [key: string]: number } = {};
  for (const tile of hand) {
    if (!isValidTile(tile)) return `無効な牌です: ${tile}`;
    tileCounts[tile] = (tileCounts[tile] || 0) + 1;
    if (tileCounts[tile] > 4) return `${tile}の牌が多すぎます（最大4枚）`;
    if (tile[0] === '0' && tileCounts[tile] > 1) return `${tile[1]}の赤ドラが多すぎます（最大1枚）`;
  }

  return null; // 手牌は有効です
}

export function generateTileButtons(type: TileType): TileKey[] {
  if (type === 'z') {
    return ['1z', '2z', '3z', '4z', '5z', '6z', '7z'];
  }
  return ['1', '2', '3', '4', '5', '0', '6', '7', '8', '9'].map(n => `${n}${type}` as TileKey);
}