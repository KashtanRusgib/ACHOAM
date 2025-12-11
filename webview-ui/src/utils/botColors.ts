export const BOT_COLORS = [
  '#8ABEB7', '#A2C880', '#C397D8', '#FFD780', '#FFC880',
  '#EC8B8B', '#80A0C8', '#5E9C91', '#F8F2A8'
] as const;

export const getBotColor = (index: number): string =>
  BOT_COLORS[index % BOT_COLORS.length];
