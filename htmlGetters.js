////// Utility functions for input values

// Gets the innate weapon values
export function getInnateWeaponStats() {
    return {
        name: document.getElementById("weaponName").value,
        baseAttack: parseFloat(document.getElementById("baseAttack").value),
        baseAffinity: parseFloat(document.getElementById("baseAffinity").value),
        sharpnessModifier: document.getElementById("sharpnessModifier").value,
        decorationSlots: [parseInt(document.getElementById("slot1").value) || 0,
            parseInt(document.getElementById("slot2").value) || 0,
            parseInt(document.getElementById("slot3").value) || 0,],
    };
}

// Gets the innate weapon skills
export function getInnateWeaponSkills() {
    return {
        attackSkill: parseInt(document.getElementById("attackSkill").value) || 0,
        critEye: parseInt(document.getElementById("critEye").value) || 0,
        critBoost: parseInt(document.getElementById("critBoost").value) || 0,
    }
}

// Gets the decoration skills for your weapon
// Will make this into a dropdown where you choose decorations
export function getDecorations() {
}

// Gets the relevant armor skills for damage
export function getArmorSkillInputValues() {
    return {
        weaknessExploit: parseFloat(document.getElementById("weaknessExploit").value),
        partBreaker: parseFloat(document.getElementById("partBreaker").value),
    }
}