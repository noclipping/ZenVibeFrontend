export const calculateBMR = (gender, weight, height, age) => {
  return gender === "Female"
    ? Math.floor(655.1 + 4.35 * weight + 4.7 * height - 4.676 * age)
    : Math.floor(66.47 + 6.24 * weight + 12.7 * height - 6.755 * age);
};
