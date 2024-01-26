// calculateBMR.js
export const calculateBMR = (gender, weight, height, age) => {
    if (gender === 'Female') {
        return Math.floor(655.1 + (4.35 * weight) + (4.7 * height) - (4.676 * age));
    } else {
        return Math.floor(66.47 + (6.24 * weight) + (12.7 * height) - (6.755 * age));
    }
};

export const getActivityFactor = (level) => {
    const activityFactors = {
        sedentary: 1.2,
        lightlyActive: 1.375,
        moderatelyActive: 1.55,
        veryActive: 1.725,
        extremelyActive: 1.9,
    };
    return activityFactors[level] || 1.2; // Default to sedentary if level is not recognized
};
