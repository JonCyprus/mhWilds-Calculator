// Calculations regarding handicraft increasing sharpness level are currently not considered. Instead change the sharpness
// and then just remove the appropriate jewel slot

import { createWeaponFromInputs, Weapon, Decoration, createEmptyDecoration, DecoWeaponSkills } from "./weaponStats.js";
import { createArmorSkillsInstance } from "./armorStats.js";

// Will return top 3 optimizations from highest to lowest
export function optimizeRawWeapon() {
    // Instantiate weapon with no slots
    const weapon = createWeaponFromInputs(true);
    const armor = createArmorSkillsInstance();
    let bestSetup = null;
    let results = [];

    // Get optimal combinations
    let jewelSetups = generateOptimalDecorationCombinations(weapon);

    // Check the dmg on each and accumulate in results
    for (let setup of jewelSetups) {
        let weaponCopy = Object.create(Object.getPrototypeOf(weapon), Object.getOwnPropertyDescriptors(weapon));
        weaponCopy.decoWeaponSkills = new DecoWeaponSkills(); // Reset decorations

        weaponCopy.updateDecorations(...setup)
        let weaponRaw = calculateRawDamage(weaponCopy, armor);
        results.push([weaponCopy, weaponRaw])
    }

    // Sort based on damage
    results.sort((a, b) => b[1] - a[1]);

    return results;
}

// Calculate the Raw damage the weapon given armor and weapon, (ASSUMES HITTING WEAKPOINTS BUT NOT WOUNDS)
export function calculateRawDamage(weapon, armor) {
    // Get the bonuses from skills
    const skills = calculateTotalSkills(weapon, armor);
    let attackSkillBonus = skillMultipliers["Attack"][skills["Attack"]][0] || 0;
    let attackSkillMult = skillMultipliers["Attack"][skills["Attack"]][1] || 1.00;
    let sharpnessMult = skillMultipliers["Sharpness"][weapon.getSharpness()] || 1.00;
    let expertSkillCrit = skillMultipliers["Expert"][skills["Expert"]] || 0;
    let weaknessExploitCrit = skillMultipliers["Weakness Exploit"][skills["Weakness Exploit"]] || 0;
    let critBoost = skillMultipliers["Critical Boost"][skills["Critical Boost"]] || 0;

    // Calculate Multiplier bonus
    let totalPreMultiplier = attackSkillMult * sharpnessMult;
    let baseAttack = weapon.getBaseAttack();
    let boostedBaseAttack = (baseAttack * totalPreMultiplier) + attackSkillBonus;
    let baseAffinity = weapon.getAffinity();

    // Calculate Affinity things
    let totalAffinity = (baseAffinity/100) + expertSkillCrit + weaknessExploitCrit;
    let baseCritBoost
    if (totalAffinity < 0) {
        baseCritBoost = 0.75;
        totalAffinity = -totalAffinity;
    } else {
        baseCritBoost = 1.25;
    }

    //Total Calculation for expectation value of RAW attack
    return (1 - totalAffinity)*boostedBaseAttack + totalAffinity * (boostedBaseAttack * (baseCritBoost + critBoost));
}

// Calculate weapon/jewel setup damage
function calculateTotalSkills(weapon, armor) {
    let wepDecoSkills = weapon.sumDecoSkills();
    let wepInnateSkills = weapon.innateWeaponSkills.dictionaryInnateWeaponSkills();
    let armorSkills = armor.dictionaryArmorSkills(); // change to sum w/ armors later

    // Sum all this skills up
    let results = sumSkillDictionaries(sumSkillDictionaries(wepDecoSkills, wepInnateSkills), armorSkills);

    // Clean the results to maximums, currently hardcoded but can fix later
    for (let skill in results) {
        if (results[skill] > 5) {
            results[skill] = 5;
        }
    }
    return results;
}

// helper for summing skills
function sumSkillDictionaries(dict1, dict2) {
    let result = { ...dict1 };

    for (let skill in dict2) {
        if (result[skill]) {
            result[skill] += dict2[skill];
        } else {
            result[skill] = dict2[skill];
        }
    }

    return result;
}


// generates potential optimal jewel combinations
function generateOptimalDecorationCombinations(weapon) {
    // Valid jewel types to check for
    const jewelTypes = ["Attack", "Expert", "Critical Boost"];

    // Getting slot sizes
    const slots = weapon.getDecoSlots();
    const size1 = slots[0];
    const size2 = slots[1];
    const size3 = slots[2];

    let results = new Set();
    for (let i = 0; i < jewelTypes.length; i++) {
        for (let j = 0; j < jewelTypes.length; j++) {
            for (let k = 0; k < jewelTypes.length; k++) {

                // Ternary operations for assignment of jewels
                let jewel1 = (size1 < 1) ? createEmptyDecoration() : new Decoration(jewelTypes[i], size1)
                let jewel2 = (size2 < 1) ? createEmptyDecoration() : new Decoration(jewelTypes[j], size2)
                let jewel3 = (size3 < 1) ? createEmptyDecoration() : new Decoration(jewelTypes[j], size3)

                // Get the jewel Setup
                let jewelSetup = [jewel1, jewel2, jewel3].sort((a, b) => {
                    if (a.name === "" && b.name !== "") return 1;  // Empty goes last
                    if (b.name === "" && a.name !== "") return -1; // Empty goes last
                    return a.name.localeCompare(b.name); // Alphabetical otherwise
                });

                // Stringify the results to add to a set
                results.add(JSON.stringify(jewelSetup));
            }
        }
    }

    // Return unstringified set to array
    return Array.from(results).map(combination => JSON.parse(combination));
}

/// Jewel values for calculations
const skillMultipliers = {
    "Attack": { 0: [0, 1.00], 1: [3, 1.00], 2: [5, 1.00], 3: [7, 1.00], 4: [8, 1.02], 5: [9, 1.04] },
    "Expert": { 0: 0, 1: 0.04, 2: 0.08, 3: 0.12, 4: 0.16, 5: 0.20},
    "Critical Boost": { 0: 0, 1: 0.03, 2: 0.06, 3: 0.09, 4: 0.12, 5: 0.15 },
    "Weakness Exploit": { 0: 0, 1: 0.05, 2: 0.10, 3: 0.15, 4: 0.20, 5: 0.30 },
    "Sharpness": { "Red": 0.5, "Yellow": 1.00, "Green": 1.05, "Blue": 1.20, "White": 1.33, "Bowgun": 1.00}
};


