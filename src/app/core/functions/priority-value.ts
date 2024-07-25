import { NutritionData } from '../interfaces/data.interface';

export function getPriorityValue(data: any): string | null {
  // Пріоритети значень
  const priorities: { [key: string]: number } = {
    is_allergen: 1,
    is_weaknesses: 2,
    is_benefit: 3,
    is_contamintant: 4,
  };

  // Фільтруємо значення, які мають значення true
  const trueValues = Object.keys(data).filter(
    (key) => priorities[key] !== undefined && data[key]
  );

  // Якщо немає значень з true, повертаємо null
  if (trueValues.length === 0) {
    return null;
  }

  // Знаходимо ключ з найвищим пріоритетом
  let highestPriority = trueValues[0];
  for (const key of trueValues) {
    if (priorities[key] < priorities[highestPriority]) {
      highestPriority = key;
    }
  }

  return highestPriority;
}
