/* -------------------------------------------------------
   NAVIGATION ENTRE SECTIONS
------------------------------------------------------- */
const sections = document.querySelectorAll(".section");
const navButtons = document.querySelectorAll(".main-nav button");

navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.section;

        sections.forEach(sec => sec.classList.remove("active"));
        document.getElementById(target).classList.add("active");

        window.scrollTo(0, 0);
    });
});

/* -------------------------------------------------------
   POPUP FICHE RECETTE
------------------------------------------------------- */
const popup = document.getElementById("recipePopup");
const closePopup = document.getElementById("closePopup");

closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
});

function openPopup(recipe) {
    document.getElementById("popupTitle").textContent = recipe.nom;
    document.getElementById("popupImg").src = recipe.image;
    document.getElementById("popupInfo").textContent =
        `${recipe.temps} – ${recipe.portions} – Niveau : ${recipe.niveau}`;

    const ingList = document.getElementById("popupIngredients");
    ingList.innerHTML = "";
    recipe.ingredients.forEach(i => {
        const li = document.createElement("li");
        li.textContent = i;
        ingList.appendChild(li);
    });

    const stepsList = document.getElementById("popupSteps");
    stepsList.innerHTML = "";
    recipe.etapes.forEach(e => {
        const li = document.createElement("li");
        li.textContent = e;
        stepsList.appendChild(li);
    });

    document.getElementById("popupConseil").textContent = recipe.conseil;

    // bouton favoris
    document.getElementById("addFavorisBtn").onclick = () => addFavoris(recipe.id);

    popup.classList.remove("hidden");
}

/* -------------------------------------------------------
   AFFICHAGE DES RECETTES
------------------------------------------------------- */
const recipesContainer = document.getElementById("recipesContainer");
const favorisContainer = document.getElementById("favorisContainer");

let recettes = []; // sera rempli dans les parties B & C

function afficherRecettes(liste, container) {
    container.innerHTML = "";

    liste.forEach(recette => {
        const card = document.createElement("div");
        card.className = "recipe-card";
        card.innerHTML = `
            <img src="${recette.image}" alt="">
            <div class="recipe-info">
                <h4>${recette.nom}</h4>
                <span class="tag">${recette.categorie}</span>
                <span class="tag">⏱ ${recette.temps}</span>
            </div>
        `;

        card.addEventListener("click", () => openPopup(recette));
        container.appendChild(card);
    });
}

/* -------------------------------------------------------
   RECHERCHE PAR INGREDIENTS
------------------------------------------------------- */
document.getElementById("searchInput").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();

    const filtered = recettes.filter(r =>
        r.ingredients.some(i => i.toLowerCase().includes(q))
    );

    afficherRecettes(filtered, recipesContainer);
});

/* -------------------------------------------------------
   FILTRE NIVÉAU
------------------------------------------------------- */
document.getElementById("filterLevel").addEventListener("change", e => {
    const level = e.target.value;
    if (level === "") {
        afficherRecettes(recettes, recipesContainer);
        return;
    }

    const filtered = recettes.filter(r => r.niveau === level);
    afficherRecettes(filtered, recipesContainer);
});

/* -------------------------------------------------------
   CATÉGORIES (ACCUEIL)
------------------------------------------------------- */
document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const cat = btn.dataset.cat;
        const filtered = recettes.filter(r => r.categorie === cat);

        // aller vers l'onglet recettes
        sections.forEach(sec => sec.classList.remove("active"));
        document.getElementById("recettes").classList.add("active");

        afficherRecettes(filtered, recipesContainer);
        window.scrollTo(0, 0);
    });
});

/* -------------------------------------------------------
   FAVORIS (LOCALSTORAGE)
------------------------------------------------------- */
function loadFavoris() {
    return JSON.parse(localStorage.getItem("favoris") || "[]");
}

function saveFavoris(list) {
    localStorage.setItem("favoris", JSON.stringify(list));
}

function addFavoris(id) {
    const fav = loadFavoris();
    if (!fav.includes(id)) fav.push(id);
    saveFavoris(fav);
    afficherFavoris();
    alert("Ajouté aux favoris !");
}

function afficherFavoris() {
    const fav = loadFavoris();
    const list = recettes.filter(r => fav.includes(r.id));
    afficherRecettes(list, favorisContainer);
}

/* -------------------------------------------------------
   MENU DE LA SEMAINE (7 recettes aléatoires)
------------------------------------------------------- */
document.getElementById("generateMenu").addEventListener("click", () => {
    const selection = [];

    const pool = [...recettes];
    for (let i = 0; i < 7; i++) {
        const index = Math.floor(Math.random() * pool.length);
        selection.push(pool[index]);
        pool.splice(index, 1);
    }

    const container = document.getElementById("menuContainer");
    afficherRecettes(selection, container);
});

/* -------------------------------------------------------
   DÉBUT DU TABLEAU DES 50 RECETTES
   (PARTIE B & PARTIE C À VENIR)
------------------------------------------------------- */

recettes = [
    {
        id: 1,
        nom: "Quiche Lorraine",
        image: "https://picsum.photos/400/250?random=11",
        categorie: "Plats",
        niveau: "Débutant",
        temps: "35 min",
        portions: "4 personnes",
        ingredients: [
            "1 pâte brisée",
            "200 g de lardons",
            "3 œufs",
            "20 cl de crème fraiche",
            "Sel, poivre",
            "Gruyère râpé"
        ],
        etapes: [
            "Préchauffer le four à 180°C.",
            "Étaler la pâte dans un moule.",
            "Faire revenir les lardons.",
            "Mélanger œufs + crème + assaisonnement.",
            "Assembler puis enfourner 30 min."
        ],
        conseil: "Ajoute un peu de muscade pour plus de goût."
    },

    {
        id: 2,
        nom: "Poulet rôti aux herbes",
        image: "https://picsum.photos/400/250?random=12",
        categorie: "Plats",
        niveau: "Débutant",
        temps: "1h10",
        portions: "4 personnes",
        ingredients: [
            "1 poulet entier",
            "Herbes de Provence",
            "Beurre",
            "Sel, poivre"
        ],
        etapes: [
            "Préchauffer le four à 200°C.",
            "Badigeonner le poulet de beurre.",
            "Assaisonner généreusement.",
            "Cuire 1h en arrosant régulièrement."
        ],
        conseil: "Ajoute quelques gousses d’ail pour parfumer."
    },

    /* → Les recettes 3 à 25 seront envoyées dans la PARTIE B
       → Les recettes 26 à 50 seront envoyées dans la PARTIE C */
];

/* À L'INITIALISATION */
afficherRecettes(recettes, recipesContainer);
afficherFavoris();
    {
        id: 3,
        nom: "Soupe à l’oignon gratinée",
        image
      "https://picsum.photos/400/250?random=13",
        categorie: "Entrées",
        niveau: "Intermédiaire",
        temps: "45 min",
        portions: "4 personnes",
        ingredients: [
            "6 oignons",
            "50 g de beurre",
            "1 L de bouillon",
            "1 baguette",
            "Gruyère râpé",
            "Sel, poivre"
        ],
        etapes: [
            "Émincer les oignons et les faire caraméliser.",
            "Ajouter le bouillon et mijoter 30 min.",
            "Verser en bols, ajouter le pain et le gruyère.",
            "Gratiner 10 min au four."
        ],
        conseil: "Ajoute un peu de vin blanc pour plus d'arôme."
    },

    {
        id: 4,
        nom: "Salade niçoise",
        image: "https://picsum.photos/400/250?random=14",
        categorie: "Entrées",
        niveau: "Débutant",
        temps: "20 min",
        portions: "2 personnes",
        ingredients: [
            "2 tomates",
            "1 poivron vert",
            "150 g de haricots verts",
            "2 œufs durs",
            "1 boîte de thon",
            "Olives noires"
        ],
        etapes: [
            "Cuire les haricots verts.",
            "Couper les légumes.",
            "Assembler avec thon, olives et œufs.",
            "Assaisonner."
        ],
        conseil: "Un filet d’huile d’olive AOP fait la différence."
    },

    {
        id: 5,
        nom: "Crêpes sucrées",
        image: "https://picsum.photos/400/250?random=15",
        categorie: "Desserts",
        niveau: "Débutant",
        temps: "25 min",
        portions: "12 crêpes",
        ingredients: [
            "250 g de farine",
            "3 œufs",
            "50 cl de lait",
            "1 sachet de sucre vanillé",
            "Beurre pour la cuisson"
        ],
        etapes: [
            "Mélanger les ingrédients.",
            "Laisser reposer 15 min.",
            "Cuire chaque crêpe 1 min par côté."
        ],
        conseil: "Ajoute un peu de rhum pour parfumer."
    },

    {
        id: 6,
        nom: "Madeleines au citron",
        image: "https://picsum.photos/400/250?random=16",
        categorie: "Desserts",
        niveau: "Intermédiaire",
        temps: "30 min",
        portions: "20 madeleines",
        ingredients: [
            "120 g de beurre",
            "100 g de sucre",
            "150 g de farine",
            "2 œufs",
            "1 citron"
        ],
        etapes: [
            "Mélanger sucre, œufs et beurre fondu.",
            "Ajouter farine et zeste.",
            "Cuire 10 min à 200°C."
        ],
        conseil: "Mettre la pâte 30 min au frigo : bosse garantie."
    },

    {
        id: 7,
        nom: "Tarte aux pommes",
        image: "https://picsum.photos/400/250?random=17",
        categorie: "Desserts",
        niveau: "Débutant",
        temps: "40 min",
        portions: "6 personnes",
        ingredients: [
            "1 pâte feuilletée",
            "4 pommes",
            "Compote de pommes",
            "Sucre",
            "Cannelle"
        ],
        etapes: [
            "Étaler la pâte.",
            "Mettre une couche de compote.",
            "Disposer les pommes.",
            "Saupoudrer et cuire 30 min."
        ],
        conseil: "Un peu de beurre sur les pommes donne un beau doré."
    },

    {
        id: 8,
        nom: "Ratatouille maison",
        image: "https://picsum.photos/400/250?random=18",
        categorie: "Plats",
        niveau: "Intermédiaire",
        temps: "1h",
        portions: "4 personnes",
        ingredients: [
            "2 courgettes",
            "1 aubergine",
            "3 tomates",
            "1 poivron",
            "Herbes de Provence"
        ],
        etapes: [
            "Couper tous les légumes.",
            "Faire revenir séparément.",
            "Mijoter ensemble 30 min."
        ],
        conseil: "Encore meilleure le lendemain."
    },

    {
        id: 9,
        nom: "Croque-monsieur",
        image: "https://picsum.photos/400/250?random=19",
        categorie: "Rapide",
        niveau: "Débutant",
        temps: "10 min",
        portions: "1 personne",
        ingredients: [
            "2 tranches de pain de mie",
            "Jambon",
            "Fromage",
            "Beurre"
        ],
        etapes: [
            "Beurrer le pain.",
            "Ajouter jambon et fromage.",
            "Griller 3–4 min."
        ],
        conseil: "Ajoute un peu de moutarde douce."
    },

    {
        id: 10,
        nom: "Gratin dauphinois",
        image: "https://picsum.photos/400/250?random=20",
        categorie: "Plats",
        niveau: "Intermédiaire",
        temps: "1h10",
        portions: "6 personnes",
        ingredients: [
            "1 kg de pommes de terre",
            "40 cl de crème",
            "Ail",
            "Sel, poivre"
        ],
        etapes: [
            "Émincer les pommes de terre.",
            "Frotter le plat à l’ail.",
            "Superposer et verser la crème.",
            "Cuire 1h."
        ],
        conseil: "Ne jamais mettre de fromage dans un VRAI gratin dauphinois."
    },

    {
        id: 11,
        nom: "Omelette aux fines herbes",
        image: "https://picsum.photos/400/250?random=21",
        categorie: "Rapide",
        niveau: "Débutant",
        temps: "7 min",
        portions: "1 personne",
        ingredients: [
            "3 œufs",
            "Ciboulette",
            "Persil",
            "Beurre"
        ],
        etapes: [
            "Battre les œufs.",
            "Cuire à feu doux.",
            "Ajouter les herbes."
        ],
        conseil: "Ne pas surcuire : elle doit rester moelleuse."
    },

    {
        id: 12,
        nom: "Mousse au chocolat",
        image: "https://picsum.photos/400/250?random=22",
        categorie: "Desserts",
        niveau: "Intermédiaire",
        temps: "15 min + repos",
        portions: "4 personnes",
        ingredients: [
            "200 g chocolat",
            "3 œufs",
            "1 pincée de sel"
        ],
        etapes: [
            "Faire fondre le chocolat.",
            "Incorporer jaunes + blancs montés.",
            "Repos 2h au frais."
        ],
        conseil: "Plus le chocolat est noir, meilleure elle est."
    },

    {
        id: 13,
        nom: "Blanquette de veau",
        image: "https://picsum.photos/400/250?random=23",
        categorie: "Plats",
        niveau: "Expert",
        temps: "2h",
        portions: "6 personnes",
        ingredients: [
            "1 kg de veau",
            "Carottes",
            "Poireaux",
            "Crème",
            "Bouillon"
        ],
        etapes: [
            "Faire revenir la viande.",
            "Ajouter légumes et bouillon.",
            "Mijoter 1h30.",
            "Lier avec crème."
        ],
        conseil: "Servir avec du riz."
    },

    {
        id: 14,
        nom: "Salade de chèvre chaud",
        image: "https://picsum.photos/400/250?random=24",
        categorie: "Entrées",
        niveau: "Débutant",
        temps: "15 min",
        portions: "2 personnes",
        ingredients: [
            "Salade verte",
            "Pain grillé",
            "Chèvre",
            "Miel"
        ],
        etapes: [
            "Griller le pain + chèvre.",
            "Monter l’assiette.",
            "Ajouter miel."
        ],
        conseil: "Ajoute noix ou lardons."
    },

    {
        id: 15,
        nom: "Tarte au chocolat",
        image: "https://picsum.photos/400/250?random=25",
        categorie: "Desserts",
        niveau: "Intermédiaire",
        temps: "40 min",
        portions: "6 personnes",
        ingredients: [
            "Pâte sablée",
            "200 g chocolat",
            "20 cl crème"
        ],
        etapes: [
            "Cuire la pâte à blanc.",
            "Verser ganache chocolat.",
            "Refroidir 1h."
        ],
        conseil: "Décore avec copeaux de chocolat."
    },

    {
        id: 16,
        nom: "Pâtes carbonara (française)",
        image: "https://picsum.photos/400/250?random=26",
        categorie: "Plats",
        niveau: "Débutant",
        temps: "20 min",
        portions: "2 personnes",
        ingredients: [
            "200 g pâtes",
            "Crème",
            "Lardons",
            "Parmesan"
        ],
        etapes: [
            "Cuire les pâtes.",
            "Faire revenir lardons.",
            "Mélanger crème + parmesan.",
            "Assembler."
        ],
        conseil: "Ne pas trop saler, les lardons s’en chargent."
    },

    {
        id: 17,
        nom: "Cake au citron",
        image: "https://picsum.photos/400/250?random=27",
        categorie: "Desserts",
        niveau: "Débutant",
        temps: "45 min",
        portions: "6 personnes",
        ingredients: [
            "3 œufs",
            "150 g sucre",
            "150 g farine",
            "1 citron"
        ],
        etapes: [
            "Mélanger tous les ingrédients.",
            "Cuire 35 min à 180°C."
        ],
        conseil: "Arroser de sirop au citron en sortie du four."
    },

    {
        id: 18,
        nom: "Bruschetta tomates-basilic",
        image: "https://picsum.photos/400/250?random=28",
        categorie: "Entrées",
        niveau: "Débutant",
        temps: "10 min",
        portions: "2 personnes",
        ingredients: [
            "Pain grillé",
            "Tomates",
            "Basilic",
            "Ail"
        ],
        etapes: [
            "Frotter le pain à l’ail.",
            "Ajouter tomates + basilic.",
            "Un filet d’huile d’olive."
        ],
        conseil: "Choisir des tomates bien mûres."
    },

    {
        id: 19,
        nom: "Poulet basquaise",
        image: "https://picsum.photos/400/250?random=29",
        categorie: "Plats",
        niveau: "Intermédiaire",
        temps: "1h",
        portions: "4 personnes",
        ingredients: [
            "Poulet",
            "Poivrons",
            "Tomates",
            "Oignons"
        ],
        etapes: [
            "Faire revenir le poulet.",
            "Ajouter légumes.",
            "Mijoter 40 min."
        ],
        conseil: "Servir avec du riz."
    },

    {
        id: 20,
        nom: "Clafoutis aux cerises",
        image: "https://picsum.photos/400/250?random=30",
        categorie: "Desserts",
        niveau: "Débutant",
        temps: "50 min",
        portions: "6 personnes",
        ingredients: [
            "Cerises",
            "Lait",
            "Œufs",
            "Farine",
            "Sucre"
        ],
        etapes: [
            "Mélanger appareil.",
            "Ajouter cerises.",
            "Cuire 40 min."
        ],
        conseil: "Ne dénoyaute pas les cerises : meilleur goût."
    },

    {
        id: 21,
        nom: "Velouté de courgettes",
        image: "https://picsum.photos/400/250?random=31",
        categorie: "Entrées",
        niveau: "Débutant",
        temps: "20 min",
        portions: "4 personnes",
        ingredients: [
            "4 courgettes",
            "Crème",
            "Oignon",
            "Sel"
        ],
        etapes: [
            "Cuire courgettes + oignon.",
            "Mixer.",
            "Ajouter crème."
        ],
        conseil: "Idéal chaud ou froid."
    },

    {
        id: 22,
        nom: "Bœuf bourguignon",
        image: "https://picsum.photos/400/250?random=32",
        categorie: "Plats",
        niveau: "Expert",
        temps: "3h",
        portions: "6 personnes",
        ingredients: [
            "1 kg bœuf",
            "Carottes",
            "Vin rouge",
            "Oignons",
            "Champignons"
        ],
        etapes: [
            "Faire revenir la viande.",
            "Ajouter légumes + vin.",
            "Cuire 2h30."
        ],
        conseil: "Encore meilleur réchauffé."
    },

    {
        id: 23,
        nom: "Tarte flambée (façon française)",
        image: "https://picsum.photos/400/250?random=33",
        categorie: "Plats",
        niveau: "Intermédiaire",
        temps: "25 min",
        portions: "4 personnes",
        ingredients: [
            "Pâte fine",
            "Crème",
            "Lardons",
            "Oignons"
        ],
        etapes: [
            "Étaler crème.",
            "Ajouter oignons + lardons.",
            "Cuire 12 min à 250°C."
        ],
        conseil: "Servez bien croustillant."
    },

    {
        id: 24,
        nom: "Galettes bretonnes",
        image: "https://picsum.photos/400/250?random=34",
        categorie: "Plats",
        niveau: "Intermédiaire",
        temps: "30 min",
        portions: "6 galettes",
        ingredients: [
            "Farine de sarrasin",
            "Œufs",
            "Eau",
            "Sel"
        ],
        etapes: [
            "Préparer la pâte.",
            "Cuire les galettes.",
            "Garnir selon envie."
        ],
        conseil: "Classique : jambon, œuf, fromage."
    },

    {
        id: 25,
        nom: "Crème brûlée",
        image: "https://picsum.photos/400/250?random=35",
        categorie: "Desserts",
        niveau: "Intermédiaire",
        temps: "50 min",
        portions: "4 personnes",
        ingredients: [
            "Crème",
            "Jaunes d’œufs",
            "Sucre",
            "Vanille"
        ],
        etapes: [
            "Préparer appareil.",
            "Cuire au bain-marie.",
            "Caraméliser au chalumeau."
        ],
        conseil: "Utiliser une vraie gousse de vanille."
    },
    {
        id: 26,
        nom: "Panna cotta vanille",
        image: "https://picsum.photos/400/250?random=36",
        categorie: "Desserts",
        niveau: "Débutant",
        temps: "15 min + repos",
        portions: "4 personnes",
        ingredients: [
            "25 cl crème",
            "25 cl lait",
            "50 g sucre",
            "Gousse de vanille",
            "2 feuilles de gélatine"
        ],
        etapes: [
            "Faire chauffer crème + lait + sucre + vanille.",
            "Ajouter gélatine ramollie.",
            "Verser dans verrines, réfrigérer 4h."
        ],
        conseil: "Servir avec coulis de fruits rouges."
    },
    {
        id: 27,
        nom: "Soufflé au fromage",
        image: "https://picsum.photos/400/250?random=37",
        categorie: "Plats",
        niveau: "Expert",
        temps: "40 min",
        portions: "4 personnes",
        ingredients: [
            "40 g beurre",
            "40 g farine",
            "25 cl lait",
            "3 œufs",
            "100 g fromage râpé"
        ],
        etapes: [
            "Préparer béchamel.",
            "Ajouter jaunes + fromage.",
            "Incorporer blancs montés.",
            "Cuire 25 min."
        ],
        conseil: "Ne pas ouvrir le four avant la fin."
    },
    {
        id: 28,
        nom: "Gaspacho andalou",
        image: "https://picsum.photos/400/250?random=38",
        categorie: "Entrées",
        niveau: "Débutant",
        temps: "15 min",
        portions: "4 personnes",
        ingredients: [
            "6 tomates",
            "1 poivron",
            "1 concombre",
            "Huile d’olive",
            "Vinaigre"
        ],
        etapes: [
            "Mixer tous les légumes.",
            "Assaisonner.",
            "Servir frais."
        ],
        conseil: "Ajouter pain rassis pour plus de texture."
    },
    {
        id: 29,
        nom: "Poulet rôti aux herbes",
        image: "https://picsum.photos/400/250?random=39",
        categorie: "Plats",
        niveau: "Intermédiaire",
        temps: "1h15",
        portions: "4 personnes",
        ingredients: [
            "1 poulet",
            "Herbes de Provence",
            "Beurre",
            "Ail"
        ],
        etapes: [
            "Badigeonner le poulet de beurre + herbes.",
            "Cuire au four 1h.",
            "Arroser régulièrement."
        ],
        conseil: "Laisser reposer 10 min avant de découper."
    },
    {
        id: 30,
        nom: "Tiramisu",
        image: "https://picsum.photos/400/250?random=40",
        categorie: "Desserts",
        niveau: "Intermédiaire",
        temps: "30 min + repos",
        portions: "6 personnes",
        ingredients: [
            "250 g mascarpone",
            "3 œufs",
            "100 g sucre",
            "Biscuits à la cuillère",
            "Café"
        ],
        etapes: [
            "Séparer jaunes et blancs.",
            "Mélanger jaunes + mascarpone + sucre.",
            "Monter blancs et incorporer.",
            "Tremper biscuits et monter les couches."
        ],
        conseil: "Saupoudrer cacao juste avant de servir."
    },
    {
        id: 31,
        nom: "Quiche lorraine",
        image: "https://picsum.photos/400/250?random=41",
        categorie: "Plats",
        niveau: "Débutant",
        temps: "40 min",
        portions: "6 personnes",
        ingredients: [
            "1 pâte brisée",
            "200 g lardons",
            "3 œufs",
            "20 cl crème",
            "Sel, poivre"
        ],
        etapes: [
            "Cuire lardons.",
            "Mélanger œufs + crème.",
            "Verser sur pâte avec lardons.",
            "Cuire 30 min."
        ],
        conseil: "Laisser tiédir pour mieux trancher."
    },
    {
        id: 32,
        nom: "Salade césar",
        image: "https://picsum.photos/400/250?random=42",
        categorie: "Entrées",
        niveau: "Débutant",
        temps: "15 min",
        portions: "2 personnes",
        ingredients: [
            "Salade romaine",
            "Poulet grillé",
            "Parmesan",
            "Croutons",
            "Sauce césar"
        ],
        etapes: [
            "Découper salade + poulet.",
            "Ajouter croutons et parmesan.",
            "Assaisonner."
        ],
        conseil: "Ajoutez un œuf poché pour plus de gourmandise."
    },
    {
        id: 33,
        nom: "Soufflé au chocolat",
        image: "https://picsum.photos/400/250?random=43",
        categorie: "Desserts",
        niveau: "Expert",
        temps: "25 min + cuisson",
        portions: "4 personnes",
        ingredients: [
            "100 g chocolat",
            "3 œufs",
            "30 g sucre",
            "Beurre"
        ],
        etapes: [
            "Faire fondre chocolat.",
            "Ajouter jaunes + sucre.",
            "Incorporer blancs montés.",
            "Cuire 12 min."
        ],
        conseil: "Servir immédiatement."
    },
    {
        id: 34,
        nom: "Minestrone",
        image: "https://picsum.photos/400/250?random=44",
        categorie: "Plats",
        niveau: "Intermédiaire",
        temps: "45 min",
        portions: "4 personnes",
        ingredients: [
            "Carottes",
            "Courgettes",
            "Haricots blancs",
            "Tomates",
            "Pâtes"
        ],
        etapes: [
            "Faire revenir légumes.",
            "Ajouter bouillon + pâtes.",
            "Cuire 20 min."
        ],
        conseil: "Ajouter parmesan râpé."
    },
    {
        id: 35,
        nom: "Brownies au chocolat",
        image: "https://picsum.photos/400/250?random=45",
        categorie: "Desserts",
        niveau: "Débutant",
        temps: "30 min",
        portions: "12 parts",
        ingredients: [
            "200 g chocolat",
            "150 g beurre",
            "150 g sucre",
            "3 œufs",
            "100 g farine"
        ],
        etapes: [
            "Faire fondre chocolat + beurre.",
            "Ajouter sucre, œufs, farine.",
            "Cuire 20 min à 180°C."
        ],
        conseil: "Ne pas trop cuire pour garder moelleux."
    },
    {
        id: 36,
        nom: "Salade grecque",
        image: "https://picsum.photos/400/250?random=46",
        categorie: "Entrées",
        niveau: "Débutant",
        temps: "10 min",
        portions: "2 personnes",
        ingredients: [
            "Tomates",
            "Concombre",
            "Feta",
            "Olives",
            "Oignon rouge"
        ],
        etapes: [
            "Couper légumes + feta.",
            "Ajouter olives.",
            "Assaisonner huile d’olive + origan."
        ],
        conseil: "Servir très frais."
    },
    {
        id: 37,
        nom: "Lasagnes à la bolognaise",
        image: "https://picsum.photos/400/250?random=47",
        categorie: "Plats",
        niveau: "Intermédiaire",
        temps: "1h30",
        portions: "6 personnes",
        ingredients: [
            "Feuilles de lasagne",
            "Viande hachée",
            "Tomates",
            "Béchamel",
            "Parmesan"
        ],
        etapes: [
            "Préparer sauce bolognaise.",
            "Monter les couches : lasagne, sauce, béchamel.",
            "Cuire 45 min."
        ],
        conseil: "Laisser reposer 10 min avant de servir."
    },
    {
        id: 38,
        nom: "Soupe de potiron",
        image: "https://picsum.photos/400/250?random=48",
        categorie: "Entrées",
        niveau: "Débutant",
        temps: "30 min",
        portions: "4 personnes",
        ingredients: [
            "1 kg potiron",
            "1 oignon",
            "Bouillon",
            "Crème"
        ],
        etapes: [
            "Cuire potiron + oignon dans bouillon.",
            "Mixer.",
            "Ajouter crème."
        ],
        conseil: "Parfait avec un peu de noix de muscade."
    },
    {
        id: 39,
        nom: "Poulet curry rapide",
        image: "https://picsum.photos/400/250?random=49",
        categorie: "Rapide",
        niveau: "Débutant",
        temps: "20 min",
        portions: "2 personnes",
        ingredients: [
            "2 blancs de poulet",
            "Curry",
            "Crème",
            "Oignons"
        ],
        etapes: [
            "Faire revenir oignons + poulet.",
            "Ajouter curry + crème.",
            "Cuire 10 min."
        ],
        conseil: "Servir avec riz basmati."
    },
    {
        id: 40,
        nom: "Crêpes salées jambon-fromage",
        image: "https://picsum.photos/400/250?random=50",
        categorie: "Rapide",
        niveau: "Débutant",
        temps: "15 min",
        portions: "4 crêpes",
        ingredients: [
            "Pâte à crêpe",
            "Jambon",
            "Fromage",
            "Beurre"
        ],
        etapes: [
            "Cuire crêpes.",
            "Ajouter garniture.",
            "Plier et servir."
        ],
        conseil: "Accompagner d’une petite salade."
    },
    {
        id: 41,
        nom: "Chili sin carne",
        image: "https://picsum.photos/400/250?random=51",
        categorie: "Plats",
        niveau: "Intermédiaire",
        temps: "35 min",
        portions: "4 personnes",
        ingredients: [
            "Haricots rouges",
            "Maïs",
            "Tomates",
            "Épices chili"
        ],
        etapes: [
            "Faire revenir légumes.",
            "Ajouter haricots + épices.",
            "Cuire 20 min."
        ],
        conseil: "Servir avec riz ou tortillas."
    },
    {
        id: 42,
        nom: "Clafoutis aux poires",
        image: "https://picsum.photos/400/250?random=52",
        categorie: "Desserts",
        niveau: "Débutant",
        temps: "45 min",
        portions: "6 personnes",
        ingredients: [
            "Poires",
            "Farine",
            "Sucre",
            "Œufs",
            "Lait"
        ],
        etapes: [
            "Mélanger appareil.",
            "Ajouter poires coupées.",
            "Cuire 40 min."
        ],
        conseil: "Saupoudrer sucre glace à la sortie du four."
    },
    {
        id: 43,
        nom: "Taboulé",
        image: "https://picsum.photos/400/250?random=53",
        categorie: "Entrées",
        niveau: "Débutant",
        temps: "15 min",
        portions: "4 personnes",
        ingredients: [
            "Boulgour",
            "Tomates",
            "Concombre",
            "Menthe",
            "Citron"
        ],
        etapes: [
            "Cuire boulgour.",
            "Ajouter légumes et herbes.",
            "Assaisonner citron + huile."
        ],
        conseil: "Laisser reposer 1h au frais."
    },
    {
        id: 44,
        nom: "Poulet rôti à la moutarde",
        image: "https://picsum.photos/400/250?random=54",
        categorie: "Plats",
        niveau: "Intermédiaire",
        temps: "1h10",
        portions: "4 personnes",
        ingredients: [
            "1 poulet",
            "Moutarde",
            "Crème",
            "Herbes"
        ],
        etapes: [
            "Enduire poulet de moutarde.",
            "Cuire 1h.",
            "Ajouter crème 10 min avant la fin."
        ],
        conseil: "Servir avec pommes de terre sautées."
    },
    {
        id: 45,
        nom: "Tarte tatin",
        image: "https://picsum.photos/400/250?random=55",
        categorie: "Desserts",
        niveau: "Intermédiaire",
        temps: "50 min",
        portions: "6 personnes",
        ingredients: [
            "Pâte brisée",
            "Pommes",
            "Sucre",
            "Beurre"
        ],
        etapes: [
            "Caraméliser sucre + beurre.",
            "Ajouter pommes.",
            "Cuire 30 min.",
            "Recouvrir pâte, cuire 15 min."
        ],
        conseil: "Démouler tiède."
    },
    {
        id: 46,
        nom: "Soupe miso",
        image: "https://picsum.photos/400/250?random=56",
        categorie: "Entrées",
        niveau: "Débutant",
        temps: "15 min",
        portions: "2 personnes",
        ingredients: [
            "Pâte miso",
            "Tofu",
            "Algues",
            "Oignons verts",
            "Bouillon dashi"
        ],
        etapes: [
            "Porter bouillon à ébullition.",
            "Ajouter tofu + algues.",
            "Diluer miso juste avant de servir."
        ],
        conseil: "Ne pas faire bouillir le miso pour garder les saveurs."
    },
    {
        id: 47,
        nom: "Gnocchis à la sauce tomate",
        image: "https://picsum.photos/400/250?random=57",
        categorie: "Plats",
        niveau: "Débutant",
        temps: "25 min",
        portions: "2 personnes",
        ingredients: [
            "Gnocchis",
            "Tomates",
            "Ail",
            "Basilic",
            "Parmesan"
        ],
        etapes: [
            "Cuire gnocchis.",
            "Préparer sauce tomate.",
            "Mélanger et servir avec parmesan."
        ],
        conseil: "Ajouter un filet d’huile d’olive."
    },
    {
        id: 48,
        nom: "Mousse aux fruits rouges",
        image: "https://picsum.photos/400/250?random=58",
        categorie: "Desserts",
        niveau: "Débutant",
        temps: "20 min + repos",
        portions: "4 personnes",
        ingredients: [
            "Fruits rouges",
            "Sucre",
            "Crème fouettée",
            "Gélatine"
        ],
        etapes: [
            "Mixer fruits + sucre.",
            "Ajouter gélatine ramollie.",
            "Incorporer crème fouettée et réfrigérer."
        ],
        conseil: "Servir très frais."
    },
    {
        id: 49,
        nom: "Couscous végétarien",
        image: "https://picsum.photos/400/250?random=59",
        categorie: "Cuisine du monde",
        niveau: "Intermédiaire",
        temps: "50 min",
        portions: "4 personnes",
        ingredients: [
            "Semoule",
            "Carottes",
            "Courgettes",
            "Pois chiches",
            "Épices couscous"
        ],
        etapes: [
            "Cuire légumes avec épices.",
            "Préparer semoule.",
            "Servir légumes sur semoule."
        ],
        conseil: "Ajouter harissa si vous aimez piquant."
    },
    {
        id: 50,
        nom: "Crêpes au Nutella",
        image: "https://picsum.photos/400/250?random=60",
        categorie: "Desserts",
        niveau: "Débutant",
        temps: "20 min",
        portions: "4 crêpes",
        ingredients: [
            "Pâte à crêpe",
            "Nutella"
        ],
        etapes: [
            "Cuire crêpes.",
            "Étaler Nutella et plier.",
            "Servir immédiatement."
        ],
        conseil: "Ajouter banane tranchée pour varier."
    }
];

/* → FIN DU FICHIER script.js */
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

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.onclick = () => openModal(recipe);
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
filterRecipes('Entrées');
