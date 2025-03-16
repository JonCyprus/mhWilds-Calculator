import { getArmorSkillInputValues } from "./htmlGetters.js";

// Class definitions for armorStats

class ArmorSkills {
    constructor(weaknessExploit, partBreaker) {
        this.weaknessExploit = weaknessExploit;
        this.partBreaker = partBreaker;
    }

    dictionaryArmorSkills() {
        let skills = {};
        skills["Weakness Exploit"] = this.weaknessExploit;
        skills["Partbreaker"] = this.partBreaker;
        return skills;
    }
}

// Instantiation from html
export function createArmorSkillsInstance() {
    const rawData = getArmorSkillInputValues();
    return new ArmorSkills(
        rawData.weaknessExploit,
        rawData.partBreaker,
    )
}