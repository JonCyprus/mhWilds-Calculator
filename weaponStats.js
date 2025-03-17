import {getInnateWeaponStatsHTML, getInnateWeaponSkillsHTML, getDecorations} from "./htmlGetters.js";

///// Classes & Instantiation regarding a weapon /////

/// For Weapon Stats
// WeaponStats class
class WeaponStats {
    constructor(name, baseAttack, baseAffinity, sharpnessModifier, decorationSlots) {
        this.name = name;
        this.baseAttack = baseAttack;
        this.baseAffinity = baseAffinity;
        this.sharpnessModifier = sharpnessModifier;
        this.decorationSlots = decorationSlots;
    }

    getDecorationSlots(){
        return this.decorationSlots;
    }
}

// Instantiation for WeaponStats
function createWeaponStatsInstanceHTML() {
    const rawData = getInnateWeaponStatsHTML();
    return new WeaponStats(
        rawData.name,
        rawData.baseAttack,
        rawData.baseAffinity,
        rawData.sharpnessModifier,
        rawData.decorationSlots,
    );
}

/// For InnateWeaponSkills

// InnateWeaponSkills class
class InnateWeaponSkills {
    constructor(attackSkill, critEye, critBoost){
        this.attackSkill = attackSkill || 0;
        this.critEye = critEye || 0;
        this.critBoost = critBoost || 0;
    }
    dictionaryInnateWeaponSkills() {
        const skills = {};
        skills["Attack"] = this.attackSkill;
        skills["Expert"] = this.critEye;
        skills["Critical Boost"] = this.critBoost;
        return skills;
    }
}

function createWeaponSkillsInstance() {
    const rawData = getInnateWeaponSkillsHTML();
    return new InnateWeaponSkills(
        rawData.attackSkill,
        rawData.critEye,
        rawData.critBoost,
    );
}

/// For DecoWeaponSkills

// Decorations class
export class Decoration {
    constructor (name, level) {
        this.name = name;
        this.level = level;
    }
}

// Make an empty decoration
export function createEmptyDecoration() {
    return new Decoration("", 0)
}
// DecoWeaponSkills class
export class DecoWeaponSkills {
    constructor(...decorations){
        if (decorations.length > 3) {
            throw new Error("A weapon can only have up to 3 decorations.");
        }

        this.dec1 = decorations[0] || createEmptyDecoration();
        this.dec2 = decorations[1] || createEmptyDecoration();
        this.dec3 = decorations[2] || createEmptyDecoration();
    }

    getDecoArray() {
        return [this.dec1, this.dec2, this.dec3];
    }
}

// Instantiate from HTML data
function createDecoWeaponSkillsInstanceHTML() {
    const rawData = getDecorations();
    let dec1 = new Decoration(rawData.dec1Type, rawData.dec1Level);
    let dec2 = new Decoration(rawData.dec2Type, rawData.dec2Level);
    let dec3 = new Decoration(rawData.dec3Type, rawData.dec3Level);
    return new DecoWeaponSkills(dec1, dec2, dec3);
}

// Weapon Class
export class Weapon {
    constructor(weaponStats, innateWeaponSkills, decoWeaponSkills) {
        this.weaponStats = weaponStats;
        this.innateWeaponSkills = innateWeaponSkills;
        this.decoWeaponSkills = decoWeaponSkills;
    }

    updateDecorations(...decorations) {
        this.decoWeaponSkills = new DecoWeaponSkills(
            decorations[0] || createEmptyDecoration(),
            decorations[1] || createEmptyDecoration(),
            decorations[2] || createEmptyDecoration()
        );
    }


    getDecoSlots() {
        return this.weaponStats.getDecorationSlots()
    }

    sumDecoSkills() {
        let jewels = this.decoWeaponSkills.getDecoArray()
        let skillsTotal = {};
        // Sum the decorations
        for (let jewel of jewels) {
            if (!jewel || jewel.name === "") continue;

            if (skillsTotal[jewel.name]) {
                skillsTotal[jewel.name] += jewel.level;
            } else {
                skillsTotal[jewel.name] = jewel.level;
            }
        }
        return skillsTotal;
    }

    getAffinity() {
        return this.weaponStats.baseAffinity;
    }

    getBaseAttack() {
        return this.weaponStats.baseAttack
    }

    getSharpness() {
        return this.weaponStats.sharpnessModifier
    }
}

//// Create a Weapon from Inputs
export function createWeaponFromInputs(optimize = false) {
    const weaponStats = createWeaponStatsInstanceHTML()
    const innateWeaponSkills = createWeaponSkillsInstance()
    let decoSkills = new DecoWeaponSkills();
    // I'll fix later to get decorations and bundle it into a class
    if (optimize) {
        let emptyDeco = createEmptyDecoration();
        decoSkills.dec1 = emptyDeco;
        decoSkills.dec2 = emptyDeco;
        decoSkills.dec3 = emptyDeco;
    } else {
        // Assign the decorations, this absolutely is not right but I'm only working on optimization rn
        decoSkills = createDecoWeaponSkillsInstanceHTML();
    }

    return new Weapon(weaponStats, innateWeaponSkills, decoSkills);
}
