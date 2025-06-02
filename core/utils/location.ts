/**
 * Получает расстояние между двумя точками на земной поверхности
 * @param lat1 - Широта первой точки
 * @param lon1 - Долгота первой точки
 * @param lat2 - Широта второй точки
 * @param lon2 - Долгота второй точки
 * @returns Расстояние в километрах
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Радиус Земли в километрах
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Получает форматированное расстояние между двумя точками на земной поверхности
 * @param distance - Расстояние в километрах
 * @returns Форматированное расстояние
 */
export const getFormattedDistance = (distance: number) => {
  if (distance < 1) {
    return `${distance.toFixed(0)} м`;
  } else {
    return `${distance.toFixed(1)} км`;
  }
}

/**
 * Получает форматированное расстояние между двумя точками на земной поверхности
 * @param lat1 - Широта первой точки
 * @param lon1 - Долгота первой точки
 * @param lat2 - Широта второй точки
 * @param lon2 - Долгота второй точки
 * @returns Форматированное расстояние
 */
export const calculateFormattedDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return getFormattedDistance(distance);
}
