import confetti from 'canvas-confetti';

/**
 * タスク完了時の紙吹雪エフェクトを発火するフック
 */
export function useConfetti() {
  const fire = (x: number, y: number) => {
    // 左右から同時に発射して派手に見せる
    const shared = {
      particleCount: 80,
      spread: 70,
      startVelocity: 45,
      decay: 0.92,
      scalar: 1.1,
      ticks: 200,
      colors: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'],
    };

    // クリックした要素の位置から発射
    confetti({ ...shared, origin: { x, y }, angle: 60 });
    confetti({ ...shared, origin: { x, y }, angle: 120 });

    // 少し遅れて追加のバースト
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 100,
        startVelocity: 30,
        decay: 0.9,
        scalar: 0.8,
        ticks: 150,
        origin: { x, y: y - 0.1 },
        colors: ['#fbbf24', '#f472b6', '#818cf8'],
      });
    }, 150);
  };

  return { fire };
}
