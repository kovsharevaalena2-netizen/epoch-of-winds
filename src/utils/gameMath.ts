import { Team, Card, Answer } from '@/types/game';

/**
 * Рассчитывает итоговые шаги команды после ответа на карточку
 * Формула: Базовые Шаги + (Чижики * 1) + (Пятерочки * 2) + (Перекрестки * 3) - (Стены * Штраф_Эпохи)
 */
export function calculateSteps(
  team: Team,
  card: Card,
  answer: Answer,
  epoch: number
): number {
  const isCorrect = answer === card.correct_answer;
  
  if (!isCorrect) {
    return 0; // Неверный ответ = 0 шагов
  }
  
  const baseSteps = card.base_steps;
  const chizhikBonus = team.chizhik * 1;
  const pyaterochkaBonus = team.pyaterochka * 2;
  const perekrestokBonus = team.perekrestok * 3;
  
  // Штраф стен: Эпоха 1 = 0, Эпохи 2-4 = 1 за стену
  const wallPenalty = epoch >= 2 ? team.walls * 1 : 0;
  
  return baseSteps + chizhikBonus + pyaterochkaBonus + perekrestokBonus - wallPenalty;
}

/**
 * Рассчитывает изменение золота после ответа на карточку
 */
export function calculateGoldChange(
  card: Card,
  answer: Answer
): number {
  const isCorrect = answer === card.correct_answer;
  
  if (isCorrect) {
    return card.gold_reward;
  } else {
    return -card.gold_penalty;
  }
}

/**
 * Проверяет, может ли команда перейти в финальный круг (пройти 30 шагов)
 * Требуется хотя бы 1 Ветряная Мельница
 */
export function canPassGateway(team: Team): boolean {
  return team.windmill > 0;
}

/**
 * Проверяет, достаточно ли ресурсов для покупки здания
 */
export function canAffordBuilding(
  team: Team,
  goldCost: number,
  woodCost: number,
  stoneCost: number,
  blueprintsCost: number
): boolean {
  return (
    team.gold >= goldCost &&
    team.wood >= woodCost &&
    team.stone >= stoneCost &&
    team.blueprints >= blueprintsCost
  );
}

/**
 * Рассчитывает общее количество шагов всех команд
 */
export function calculateTotalSteps(teams: Team[]): number {
  return teams.reduce((sum, team) => sum + team.steps, 0);
}

/**
 * Проверяет, достигнута ли победа (более 150 шагов суммарно)
 */
export function isVictory(teams: Team[]): boolean {
  return calculateTotalSteps(teams) > 150;
}

/**
 * Получает случайный ресурс для награды (для Указов)
 */
export function getRandomResource(): 'wood' | 'stone' | 'blueprints' {
  const resources: Array<'wood' | 'stone' | 'blueprints'> = ['wood', 'stone', 'blueprints'];
  return resources[Math.floor(Math.random() * resources.length)];
}

/**
 * Проверяет, может ли команда разрушить стену
 */
export function canDestroyWall(team: Team): boolean {
  return team.walls > 0;
}

/**
 * Рассчитывает штраф за стены в зависимости от эпохи
 */
export function getWallPenalty(epoch: number): number {
  return epoch >= 2 ? 1 : 0;
}
