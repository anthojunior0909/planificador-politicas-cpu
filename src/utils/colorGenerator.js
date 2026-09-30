export function generateColor(index) {
  // El ángulo áureo separa drásticamente los colores adyacentes
  const hue = Math.round((index * 137.508) % 360);
  return `hsl(${hue}, 75%, 60%)`; // Saturación y brillo óptimos para fondos claros y oscuros
}