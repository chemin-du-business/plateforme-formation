// Catalogue des niveaux et des modules vidéo.
// `file` = nom de base du fichier dans le bucket Supabase « videos » :
//   <file>_16x9.mp4 (ordinateur), <file>_9x16.mp4 (mobile), <file>.vtt (sous-titres).

export type Module = { key: string; num: number; title: string; file: string; exercise: string[] };
export type Level = { n: 1 | 2 | 3; slug: string; name: string; tagline: string; modules: Module[] };

const EX: Record<string, string[]> = {
  "1-1": ["Retrouvez la page de téléchargement sur wordpress.org", "Ouvrez la page de connexion de votre site de démonstration"],
  "1-2": ["Passez la souris sur chaque menu de la colonne de gauche", "Repérez les sous-menus de chacun"],
  "1-3": ["Ouvrez la liste des extensions", "Activez Hello Dolly pour voir ce qu’elle affiche, puis désactivez-la"],
  "1-4": ["Ouvrez Apparence, puis Widgets", "Repérez la zone du pied de page et les widgets qu’elle contient"],
  "1-5": ["Créez un article avec un titre et deux paragraphes", "Mettez un mot en gras, puis enregistrez le brouillon"],
  "1-6": ["Ouvrez la page des thèmes et comptez les thèmes installés", "Repérez le thème actif"],
  "2-1": ["Passez en revue chaque menu de la colonne de gauche", "Masquez un bloc du tableau de bord avec les Options de l’écran"],
  "2-2": ["Survolez chaque élément de la barre d’administration", "Visitez le site : la barre est toujours là"],
  "2-3": ["Renseignez votre prénom et votre nom, choisissez le nom affiché publiquement", "Changez le jeu de couleurs, puis enregistrez"],
  "2-4": ["Ouvrez la liste des extensions", "Activez Hello Dolly pour voir ce qu’elle fait, puis désactivez-la"],
  "2-5": ["Ajoutez le widget « Derniers articles » dans la zone Pied de page", "Enregistrez, puis visitez votre site pour le voir"],
  "2-6": ["Ouvrez la page des mises à jour et repérez la version de WordPress", "Y a-t-il des extensions ou des thèmes à mettre à jour ?"],
  "2-7": ["Créez un article : un titre, deux paragraphes, un sous-titre et une liste", "Mettez un mot en gras, puis enregistrez le brouillon"],
  "2-8": ["Publiez votre article, puis modifiez son titre", "Repassez-le en brouillon, mettez-le à la corbeille, puis restaurez-le"],
  "2-9": ["Ouvrez la page des thèmes et repérez le thème actif", "Prévisualisez un autre thème, sans l’activer"],
  "2-10": ["Relisez la checklist de la vidéo et cochez ce que vous savez faire sans aide", "Refaites l’exercice du module correspondant pour chaque doute"],
  "3-1": ["Masquez deux blocs du tableau de bord, déplacez « Activité » en haut", "Changez le jeu de couleurs de votre profil, enregistrez, puis revenez au réglage initial"],
  "3-2": ["Ouvrez Tableau de bord, puis Mises à jour", "Notez la version et l’état des extensions et des thèmes"],
  "3-3": ["Créez un compte de test avec le rôle « Contributeur »", "Supprimez-le en attribuant ses contenus éventuels à un autre compte"],
  "3-4": ["Quel rôle pour une rédactrice autonome, pour ses propres articles ?", "Quel rôle pour un stagiaire dont les articles sont relus ? Et pour la personne qui administre le site ?"],
  "3-5": ["Besoin : afficher une galerie photo. Recherchez deux extensions et comparez leurs fiches", "Notez votre choix avec deux arguments"],
  "3-6": ["Installez et activez « Classic Widgets »", "Ouvrez Apparence, puis Widgets : qu’est-ce qui a changé ?"],
  "3-7": ["Désactivez une extension de test, vérifiez le site, puis réactivez-la", "Supprimez une extension dont vous n’avez plus l’usage"],
  "3-8": ["Ajoutez un bloc « Recherche » dans la zone Pied de page, avec un titre", "Mettez à jour, vérifiez sur le site, puis retirez le bloc"],
  "3-9": ["Créez deux catégories dont une sous-catégorie, et deux étiquettes", "Classez un article, enregistrez, puis vérifiez sur le site"],
  "3-10": ["Téléversez une image et retrouvez-la avec la recherche", "Renseignez titre, légende et texte alternatif, puis insérez-la dans un article de test"],
  "3-11": ["Créez une page de test et changez son modèle", "Ajoutez un bloc Colonnes avec deux contenus côte à côte, puis comparez le rendu"],
  "3-12": ["Installez un thème sans l’activer et lancez son aperçu en direct", "Dans Personnaliser, changez la couleur principale, puis publiez ou annulez"],
  "3-13": ["Relisez la checklist de la vidéo et cochez ce que vous savez faire sans aide", "Refaites l’exercice du module correspondant pour chaque doute"],
};
const m = (lvl: number, num: number, title: string, file: string): Module => ({ key: `n${lvl}-m${num}`, num, title, file, exercise: EX[`${lvl}-${num}`] ?? [] });
// Identifiant de la slide « pas à pas » d’un module (ou de la révision) dans le diaporama du niveau.
export const slideIdFor = (levelN: number, num: number) => (levelN === 2 && num === 10) || (levelN === 3 && num === 13) ? "revision" : `m${num}-pas`;

export const LEVELS: Level[] = [
  {
    n: 1,
    slug: "initial",
    name: "Initial",
    tagline: "Révision des premiers pas : installer, se repérer, écrire un premier article.",
    modules: [
      m(1, 1, "Télécharger WordPress, créer son compte, l’ouvrir", "N1-V1.1-telecharger-creer-un-compte-ouvrir"),
      m(1, 2, "Le tableau de bord et ses menus", "N1-V1.2-le-tableau-de-bord-et-ses-menus"),
      m(1, 3, "Les extensions natives", "N1-V1.3-les-extensions-natives"),
      m(1, 4, "Les widgets", "N1-V1.4-les-widgets"),
      m(1, 5, "Mon premier article", "N1-V1.5-mon-premier-article"),
      m(1, 6, "Reconnaître un thème", "N1-V1.6-reconnaitre-un-theme"),
    ],
  },
  {
    n: 2,
    slug: "basique",
    name: "Basique",
    tagline: "Se repérer, gérer extensions et widgets, rédiger et publier.",
    modules: [
      m(2, 1, "Naviguer dans le tableau de bord", "N2-V2.1-tableau-de-bord"),
      m(2, 2, "La barre d’administration", "N2-V2.2-barre-d-administration"),
      m(2, 3, "Gérer son compte et son profil", "N2-V2.3-compte-et-profil"),
      m(2, 4, "Les extensions", "N2-V2.4-les-extensions"),
      m(2, 5, "Les widgets", "N2-V2.5-les-widgets"),
      m(2, 6, "Les mises à jour", "N2-V2.6-les-mises-a-jour"),
      m(2, 7, "Ajouter et mettre en forme un article", "N2-V2.7-ajouter-un-article"),
      m(2, 8, "Publier, modifier, dépublier, supprimer", "N2-V2.8-publier-modifier-supprimer"),
      m(2, 9, "Les thèmes", "N2-V2.9-les-themes"),
      m(2, 10, "Révision du niveau Basique", "N2-V2.10-revision-du-niveau-basique"),
    ],
  },
  {
    n: 3,
    slug: "operationnel",
    name: "Opérationnel",
    tagline: "Utilisateurs, extensions, contenus et thèmes : administrer un site au quotidien.",
    modules: [
      m(3, 1, "Personnaliser son tableau de bord et son profil", "N3-V3.1-tableau-de-bord-et-profil"),
      m(3, 2, "Les mises à jour de WordPress", "N3-V3.2-les-mises-a-jour"),
      m(3, 3, "Créer des utilisateurs", "N3-V3.3-creer-des-utilisateurs"),
      m(3, 4, "Les rôles et les droits", "N3-V3.4-les-roles-et-les-droits"),
      m(3, 5, "Identifier un besoin et rechercher une extension", "N3-V3.5-identifier-un-besoin-et-rechercher-une-extension"),
      m(3, 6, "Installer, activer et configurer une extension", "N3-V3.6-installer-activer-configurer-une-extension"),
      m(3, 7, "Mettre à jour, désactiver, supprimer une extension", "N3-V3.7-mettre-a-jour-desactiver-supprimer-une-extension"),
      m(3, 8, "Ajouter, configurer et retirer un widget", "N3-V3.8-ajouter-configurer-retirer-un-widget"),
      m(3, 9, "Catégories, étiquettes et classement d’un article", "N3-V3.9-categories-etiquettes-classement"),
      m(3, 10, "La médiathèque et les informations d’une image", "N3-V3.10-mediatheque-et-informations-d-une-image"),
      m(3, 11, "Les modèles de page et la mise en page", "N3-V3.11-modeles-de-page-et-mise-en-page"),
      m(3, 12, "Rechercher, installer et personnaliser un thème", "N3-V3.12-rechercher-installer-personnaliser-un-theme"),
      m(3, 13, "Révision du niveau Opérationnel", "N3-V3.13-revision-du-niveau-operationnel"),
    ],
  },
];

export const levelByN = (n: number) => LEVELS.find((l) => l.n === n);
export const moduleByKey = (key: string) => {
  for (const l of LEVELS) {
    const mod = l.modules.find((x) => x.key === key);
    if (mod) return { level: l, module: mod };
  }
  return undefined;
};
