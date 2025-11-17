/* script.js - logique: recettes d'exemple, recherche, filtres, favoris (localStorage), modal, menu semaine */
const exampleRecipes = [
  {
    id: "r1",
    title: "Pâtes Carbonara (version maison)",
    category: "Plats",
    level: "Débutant",
    time: "15 min",
    portions: 2,
    img: "https://via.placeholder.com/600x400?text=Carbonara",
    ingredients: ["200g pâtes", "100g lardons", "2 oeufs", "50g parmesan", "poivre"],
    steps: ["Cuire les pâtes.","Faire revenir les lardons.","Mélanger oeufs+parmesan hors du feu.","Ajouter aux pâtes chaudes et servir."],
    advice: "Remplacez les lardons par champignons pour version végétarienne.",
    video: "" // lien youtube optionnel
  },
  {
    id: "r2",
    title: "Tiramisu rapide",
    category: "Desserts",
    level: "Intermédiaire",
    time: "20 min (+ repos)",
    portions: 4,
    img: "https://via.placeholder.com/600x400?text=Tiramisu",
    ingredients: ["250g mascarpone", "3 oeufs", "100g sucre", "biscuits à la cuillère","café"],
    steps: ["Séparer jaunes/blancs.","Monter blancs.","Mélanger jaunes+sucre+mascarpone.","Tremper biscuits et monter le tiramisu.","Réserver au frais."],
    advice: "Mettre au moins 2h au frais.",
    video: ""
  },
  {
    id: "r3",
    title: "Salade Méditerranéenne (végétarienne)",
    category: "Entrées",
    level: "Débutant",
    time: "10 min",
    portions: 2,
    img: "https://via.placeholder.com/600x400?text=Salade+Méditerranéenne",
    ingredients: ["Tomates", "Concombre", "Olives", "Feta", "Huile d'olive"],
    steps: ["Couper légumes.","Assembler et arroser d'huile d'olive.","Ajouter feta émiettée."],
    advice: "Parfaite en accompagnement.",
    video: ""
  }
];

let recipes = exampleRecipes.slice();
const recipesGrid = document.getElementById('recipes-grid');
const favsGrid = document.getElementById('favs-grid');
const modal = document.getElementById('recipe-modal');
const modalBody = document.getElementById('modal-body');
const searchInput = document.getElementById('search');
const levelFilter = document.getElementById('level-filter');
const weekList = document.getElementById('week-list');

function getFavs(){
  try{ return JSON.parse(localStorage.getItem('favs')) || []; } catch { return []; }
}
function saveFavs(arr){ localStorage.setItem('favs', JSON.stringify(arr)); }

function renderRecipes(list = recipes, container = recipesGrid){
  container.innerHTML = "";
  if(list.length === 0){ container.innerHTML = "<p>Aucune recette trouvée.</p>"; return; }
  list.forEach(r=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${r.img}" alt="${r.title}">
      <div class="card-body">
        <h4>${r.title}</h4>
        <div class="meta">${r.time} • ${r.portions} portions</div>
        <div class="card-actions">
          <span class="level-badge">${r.level}</span>
          <div>
            <button class="btn view-btn" data-id="${r.id}">Voir</button>
            <button class="btn fav-btn" data-id="${r.id}">⭐</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function openModal(recipe){
  modalBody.innerHTML = `
    <h2>${recipe.title}</h2>
    <img src="${recipe.img}" alt="${recipe.title}" style="width:100%;height:260px;object-fit:cover;border-radius:8px">
    <p class="meta">${recipe.time} • ${recipe.portions} parts • ${recipe.category}</p>
    <h4>Ingrédients</h4>
    <ul class="recipe-ingredients">${recipe.ingredients.map(i=>`<li>${i}</li>`).join('')}</ul>
    <h4>Étapes</h4>
    <ol class="recipe-steps">${recipe.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
    ${recipe.video ? `<div class="recipe-video"><iframe width="100%" height="315" src="${recipe.video}" frameborder="0" allowfullscreen></iframe></div>` : ''}
    <p><strong>Conseil :</strong> ${recipe.advice || ''}</p>
  `;
  modal.classList.remove('hidden');
}

document.addEventListener('click', (e)=>{
  if(e.target.matches('.view-btn')){
    const id = e.target.dataset.id;
    const r = recipes.find(x=>x.id===id);
    if(r) openModal(r);
  }
  if(e.target.matches('.fav-btn')){
    const id = e.target.dataset.id;
    const favs = getFavs();
    if(favs.includes(id)){
      const idx = favs.indexOf(id); favs.splice(idx,1);
    } else { favs.push(id); }
    saveFavs(favs);
    renderFavs();
  }
  if(e.target.id === 'close-modal' || e.target.classList.contains('modal')){
    modal.classList.add('hidden');
  }
  if(e.target.matches('.cat-btn')){
    const cat = e.target.dataset.cat;
    if(cat === "Rapide"){
      renderRecipes(recipes.filter(r => r.time.toLowerCase().includes('min') && parseInt(r.time) <= 20));
    } else {
      renderRecipes(recipes.filter(r => r.category === cat));
    }
  }
});

function renderFavs(){
  const favs = getFavs();
  const favRecipes = recipes.filter(r => favs.includes(r.id));
  renderRecipes(favRecipes, favsGrid);
}

// search & level filter
document.getElementById('search-btn').addEventListener('click', ()=>{
  const q = searchInput.value.trim().toLowerCase();
  const res = recipes.filter(r => r.title.toLowerCase().includes(q) || r.ingredients.join(' ').toLowerCase().includes(q));
  renderRecipes(res);
});
levelFilter.addEventListener('change', ()=>{
  const val = levelFilter.value;
  if(val === 'all') renderRecipes();
  else renderRecipes(recipes.filter(r=>r.level === val));
});

// nav
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('recipes-section').classList.toggle('hidden', btn.id !== 'nav-recipes' && btn.id !== 'nav-all');
    document.getElementById('week-menu').classList.toggle('hidden', btn.id !== 'nav-week');
    document.getElementById('fav-section').classList.toggle('hidden', btn.id !== 'nav-favs');
    if(btn.id === 'nav-all'){ renderRecipes(); }
    if(btn.id === 'nav-week'){ generateWeekMenu(); }
    if(btn.id === 'nav-favs'){ renderFavs(); }
  });
});

// generate week menu (simple random)
function generateWeekMenu(){
  const days = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
  weekList.innerHTML = "";
  const chosen = [];
  for(let i=0;i<7;i++){
    const r = recipes[Math.floor(Math.random()*recipes.length)];
    chosen.push(r);
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `<div class="card-body"><h4>${days[i]}: ${r.title}</h4><div class="meta">${r.time}</div></div>`;
    weekList.appendChild(el);
  }
}

// initial render
renderRecipes();
renderFavs();
