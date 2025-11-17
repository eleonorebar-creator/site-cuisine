const recipes = [
    { id: 1, nom: "Salade de tomates", categorie: "Entrées", image: "https://picsum.photos/400/250?random=1", temps: "15 min", portions: "4 personnes", ingredients: ["Tomates", "Concombre", "Huile d'olive", "Basilic"], etapes: ["Couper légumes", "Mélanger", "Assaisonner"], conseil: "Laisser reposer 30 min au frais." },
    { id: 2, nom: "Spaghetti bolognaise", categorie: "Plats", image: "https://picsum.photos/400/250?random=2", temps: "30 min", portions: "4 personnes", ingredients: ["Pâtes", "Viande hachée", "Tomates", "Ail"], etapes: ["Faire revenir viande", "Ajouter sauce tomate", "Cuire pâtes", "Mélanger"], conseil: "Servir avec parmesan râpé." },
    { id: 3, nom: "Tarte aux pommes", categorie: "Desserts", image: "https://picsum.photos/400/250?random=3", temps: "45 min", portions: "6 personnes", ingredients: ["Pâte brisée", "Pommes", "Sucre", "Beurre"], etapes: ["Étaler pâte", "Disposer pommes", "Cuire 30 min"], conseil: "Déguster tiède." },
    // Ajoute ici les autres recettes de 4 à 50
];

function filterRecipes(categorie) {
    const filteredRecipes = recipes.filter(recipe => recipe.categorie === categorie);
    displayRecipes(filteredRecipes);
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = ''; // Vider la liste avant d'afficher

    // Affichage des cartes de recettes
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.onclick = () => openModal(recipe); // Ajouter l'événement au clic pour ouvrir la modale
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.nom}">
            <div class="recipe-info">
                <h3>${recipe.nom}</h3>
                <p>Temps : ${recipe.temps}</p>
                <p>Portions : ${recipe.portions}</p>
            </div>
        `;
        recipeList.appendChild(card);
    });
}

function openModal(recipe) {
    document.getElementById('modal-recipe-name').innerText = recipe.nom;
    document.getElementById('modal-recipe-image').src = recipe.image;
    document.getElementById('modal-recipe-ingredients').innerHTML = recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');
    document.getElementById('modal-recipe-steps').innerHTML = recipe.etapes.map(step => `<li>${step}</li>`).join('');
    document.getElementById('modal-recipe-conseil').innerText = recipe.conseil;
    document.getElementById('recipe-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('recipe-modal').style.display = 'none';
}

// Afficher les recettes par défaut (ex. Entrées)
window.onload = () => {
    filterRecipes('Entrées');
};

// Pour fermer la modale en cliquant en dehors de celle-ci
window.onclick = (event) => {
    const modal = document.getElementById('recipe-modal');
    if (event.target === modal) {
        closeModal();
    }
};
function filterRecipes(categorie) {
    const filteredRecipes = recipes.filter(recipe => recipe.categorie === categorie);
    console.log(filteredRecipes);  // Vérification dans la console
    displayRecipes(filteredRecipes);
}
