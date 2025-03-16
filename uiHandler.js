import { optimizeRawWeapon, calculateRawDamage } from "./calculations.js";
import { createArmorSkillsInstance } from "./armorStats.js";

// Function to display the best (top 1) weapon optimization
function displayBestOptimizedResult() {
    console.log("Running optimization...");

    const resultsContainer = document.getElementById("result");
    resultsContainer.innerHTML = ""; // Clear previous results

    const results = optimizeRawWeapon();
    const topResults = results.slice(0, 3); // Get top 3 unique setups

    if (topResults.length === 0) {
        resultsContainer.innerHTML = "No optimized results found.";
        return;
    }

    let resultHTML = "<h3>Top 3 Optimized Setups (Click to Save):</h3><ol>";
    topResults.forEach(([weapon, rawDamage], index) => {
        let sortedDecorations = weapon.decoWeaponSkills.getDecoArray().sort((a, b) => {
            if (a.name === "" && b.name !== "") return 1;
            if (b.name === "" && a.name !== "") return -1;
            return a.name.localeCompare(b.name);
        });

        // Clickable list item
        resultHTML += `
            <li class="clickable-weapon" data-index="${index}">
                <strong>Rank ${index + 1}:</strong> ${weapon.weaponStats.name} <br>
                <strong>Raw Damage:</strong> ${rawDamage.toFixed(2)} <br>
                <strong>Sharpness:</strong> ${weapon.getSharpness()} <br>
                <strong>Decorations:</strong> ${sortedDecorations
            .map(deco => deco.name ? `${deco.name} (Lv${deco.level})` : "Empty Slot")
            .join(", ")}
            </li>
            <br>
        `;
    });
    resultHTML += "</ol>";

    resultsContainer.innerHTML = resultHTML;

    // ✅ Add event listeners to save weapon when clicked
    document.querySelectorAll(".clickable-weapon").forEach((item, index) => {
        item.addEventListener("click", () => saveWeapon(topResults[index][0])); // Pass weapon object
    });
}

// Function to save weapon to saved weapons list
function saveWeaponToList(weapon) {
    const weaponList = document.getElementById("weaponList");
    const listItem = document.createElement("li");

    listItem.innerHTML = `
        <strong>${weapon.weaponStats.name}</strong> - 
        Attack: ${weapon.weaponStats.baseAttack}, 
        Affinity: ${weapon.weaponStats.baseAffinity}
    `;

    weaponList.appendChild(listItem);
}

//Attach event listener to button
document.getElementById("optimizeBtn").addEventListener("click", displayBestOptimizedResult);

let savedWeapons = []; //Stores saved weapons

function saveWeapon(weapon) {
    console.log("✅ Saving weapon:", weapon);

    if (savedWeapons.length >= 10) {
        alert("You can only save up to 5 weapons!");
        return;
    }

    savedWeapons.push(weapon);
    updateSavedWeaponsDisplay();
}

function updateSavedWeaponsDisplay() {
    const weaponList = document.getElementById("weaponList");
    weaponList.innerHTML = ""; // Clear previous list

    savedWeapons.forEach((weapon, index) => {
        let sortedDecorations = weapon.decoWeaponSkills.getDecoArray().sort((a, b) => {
            if (a.name === "" && b.name !== "") return 1;
            if (b.name === "" && a.name !== "") return -1;
            return a.name.localeCompare(b.name);
        });

        // Get raw damage for weapon
        let rawDamage = calculateRawDamage(weapon, createArmorSkillsInstance()).toFixed(2);

        let listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${weapon.weaponStats.name}</strong> <br>
            <strong>Attack:</strong> ${weapon.weaponStats.baseAttack} <br>
            <strong>Affinity:</strong>${weapon.getAffinity()}<br>
            <strong>Sharpness:</strong>${weapon.getSharpness()}<br>
            <strong>Decorations:</strong> ${sortedDecorations
            .map(deco => deco.name ? `${deco.name} (Lv${deco.level})` : "Empty Slot")
            .join(", ")}<br>
            <strong>TOTAL RAW:</strong>${rawDamage}<br>
            <button onclick="removeSavedWeapon(${index})">❌ Remove</button>
        `;

        weaponList.appendChild(listItem);
    });
}

function removeSavedWeapon(index) {
    savedWeapons.splice(index, 1); // Remove weapon at index
    updateSavedWeaponsDisplay(); // Refresh list
}
