// Questions de fin de niveau (10 par niveau). Questions originales, qui reprennent les compétences
// du référentiel sans copier le test Isograd. Les bonnes réponses restent côté serveur.

export type Question = {
  id: string;
  level: 1 | 2 | 3;
  moduleNum: number; // module à revoir en cas d’erreur
  question: string;
  options: [string, string, string];
  answer: 0 | 1 | 2;
  explanation: string;
};

export const QUESTIONS: Question[] = [
  // ===== Niveau 1 · Initial =====
  { id: "n1-q1", level: 1, moduleNum: 1, question: "Quel est le logiciel libre et gratuit que l’on installe soi-même sur un hébergement ?", options: ["WordPress.org", "WordPress.com", "Un thème WordPress"], answer: 0, explanation: "WordPress.org est le logiciel libre. WordPress.com est un service commercial qui héberge les sites à votre place." },
  { id: "n1-q2", level: 1, moduleNum: 1, question: "Quelle fin d’adresse permet d’ouvrir l’administration d’un site WordPress ?", options: ["/dashboard", "/contact", "/wp-admin"], answer: 2, explanation: "On ajoute /wp-admin à l’adresse du site : la page de connexion s’affiche." },
  { id: "n1-q3", level: 1, moduleNum: 2, question: "Quel menu de gauche regroupe les images et les fichiers du site ?", options: ["Médias", "Pages", "Outils"], answer: 0, explanation: "Médias est la bibliothèque de toutes les images, vidéos et fichiers." },
  { id: "n1-q4", level: 1, moduleNum: 2, question: "Dans une version récente de WordPress, quel menu permet de gérer les personnes ayant accès au site ?", options: ["Réglages", "Comptes", "Apparence"], answer: 1, explanation: "Le menu s’appelle Comptes (anciennement Utilisateurs) : c’est exactement la même fonction." },
  { id: "n1-q5", level: 1, moduleNum: 3, question: "Une extension est installée mais pas activée. Que se passe-t-il ?", options: ["Elle fonctionne normalement", "Elle ne fait rien", "Elle est supprimée"], answer: 1, explanation: "Tant qu’elle n’est pas activée, une extension ne fait rien. Il faut cliquer sur « Activer »." },
  { id: "n1-q6", level: 1, moduleNum: 3, question: "Quel lien met une extension en pause sans l’effacer ?", options: ["Désactiver", "Supprimer", "Mettre à jour"], answer: 0, explanation: "Désactiver, c’est mettre en pause. Supprimer, c’est effacer l’extension du site." },
  { id: "n1-q7", level: 1, moduleNum: 4, question: "Où trouve-t-on la page des widgets avec un thème classique ?", options: ["Outils › Widgets", "Apparence › Widgets", "Extensions › Widgets"], answer: 1, explanation: "Les widgets se gèrent dans Apparence, puis Widgets (thèmes classiques)." },
  { id: "n1-q8", level: 1, moduleNum: 5, question: "Comment crée-t-on un nouvel article ?", options: ["Pages › Ajouter une page", "Articles › Ajouter un article", "Médias › Ajouter un fichier"], answer: 1, explanation: "Articles, puis Ajouter un article : l’éditeur par blocs s’ouvre." },
  { id: "n1-q9", level: 1, moduleNum: 5, question: "Que fait le bouton « Enregistrer le brouillon » ?", options: ["Il met l’article en ligne", "Il garde l’article sans le publier", "Il supprime l’article"], answer: 1, explanation: "Le brouillon est conservé, mais personne ne le voit tant que l’article n’est pas publié." },
  { id: "n1-q10", level: 1, moduleNum: 6, question: "Comment reconnaît-on le thème actif dans la liste des thèmes ?", options: ["Il est le premier de la liste", "La mention « Activé » apparaît sur sa vignette", "Il a un bouton « Supprimer »"], answer: 1, explanation: "Un seul thème est actif à la fois : celui qui porte la mention « Activé »." },

  // ===== Niveau 2 · Basique =====
  { id: "n2-q1", level: 2, moduleNum: 1, question: "Où se trouve le bouton « Options de l’écran » ?", options: ["En haut à droite de la page", "Dans le menu Réglages", "Dans le menu Outils"], answer: 0, explanation: "Il se trouve en haut à droite de la plupart des pages de l’administration et permet d’afficher ou de masquer des blocs." },
  { id: "n2-q2", level: 2, moduleNum: 2, question: "Comment s’appelle la barre noire tout en haut de l’écran ?", options: ["La barre de menus", "La barre d’administration", "La barre de réglages"], answer: 1, explanation: "La barre d’administration donne des raccourcis et reste visible quand vous visitez votre site connecté." },
  { id: "n2-q3", level: 2, moduleNum: 3, question: "Où règle-t-on le nom affiché publiquement sous vos articles ?", options: ["Comptes › Profil", "Réglages › Général", "Apparence › Personnaliser"], answer: 0, explanation: "Dans Comptes, puis Profil, avec le champ « Nom à afficher publiquement »." },
  { id: "n2-q4", level: 2, moduleNum: 4, question: "Pour utiliser une nouvelle extension que vous venez d’installer, il faut…", options: ["la désactiver", "l’activer", "la supprimer"], answer: 1, explanation: "On installe, puis on active : sans activation, l’extension ne fait rien." },
  { id: "n2-q5", level: 2, moduleNum: 5, question: "Après avoir ajouté un widget, quel clic l’enregistre ?", options: ["« Mettre à jour »", "« Aperçu »", "« Fermer »"], answer: 0, explanation: "Sans « Mettre à jour », le widget n’est pas enregistré et n’apparaît pas sur le site." },
  { id: "n2-q6", level: 2, moduleNum: 6, question: "Que faut-il faire avant toute mise à jour ?", options: ["Supprimer les anciennes extensions", "Faire une sauvegarde du site", "Changer de thème"], answer: 1, explanation: "La sauvegarde est la seule façon de revenir en arrière si quelque chose se passe mal." },
  { id: "n2-q7", level: 2, moduleNum: 7, question: "Un article qui n’a pas été publié est à l’état…", options: ["Corbeille", "Brouillon", "Programmé"], answer: 1, explanation: "Un article non publié reste en brouillon : il n’est pas visible par les visiteurs." },
  { id: "n2-q8", level: 2, moduleNum: 8, question: "Comment dépublier un article sans le supprimer ?", options: ["Le repasser en brouillon", "Le mettre à la corbeille", "Le renommer"], answer: 0, explanation: "On change l’état de « Publié » à « Brouillon » puis on enregistre : l’article est conservé mais plus visible." },
  { id: "n2-q9", level: 2, moduleNum: 8, question: "Dans la corbeille, que fait « Supprimer définitivement » ?", options: ["L’article pourra être restauré plus tard", "L’article est effacé de façon irréversible", "L’article repasse en brouillon"], answer: 1, explanation: "C’est irréversible. Pour récupérer l’article, il faut cliquer sur « Restaurer »." },
  { id: "n2-q10", level: 2, moduleNum: 9, question: "Quel thème voient les visiteurs de votre site ?", options: ["Tous les thèmes installés", "Seulement le thème actif", "Le dernier thème installé"], answer: 1, explanation: "Un seul thème est actif à la fois : c’est celui que voient les visiteurs." },

  // ===== Niveau 3 · Opérationnel =====
  { id: "n3-q1", level: 3, moduleNum: 1, question: "Pour masquer un bloc du tableau de bord, on utilise…", options: ["Réglages › Général", "« Options de l’écran », en haut de la page", "Outils › Importer"], answer: 1, explanation: "Le bouton « Options de l’écran » affiche ou masque les blocs : aucune donnée n’est supprimée." },
  { id: "n3-q2", level: 3, moduleNum: 4, question: "Quel rôle peut publier et gérer tous les articles, y compris ceux des autres ?", options: ["Auteur", "Contributeur", "Éditeur"], answer: 2, explanation: "L’éditeur gère tous les contenus ; l’auteur ne gère que les siens." },
  { id: "n3-q3", level: 3, moduleNum: 4, question: "Un contributeur peut…", options: ["rédiger des brouillons sans les publier", "publier ses propres articles", "installer des extensions"], answer: 0, explanation: "Le contributeur rédige ; la publication appartient à un éditeur ou à un administrateur." },
  { id: "n3-q4", level: 3, moduleNum: 7, question: "Avant de pouvoir supprimer une extension, il faut d’abord…", options: ["la désactiver", "vider la corbeille", "la mettre à jour"], answer: 0, explanation: "Le lien « Supprimer » n’apparaît qu’après la désactivation de l’extension." },
  { id: "n3-q5", level: 3, moduleNum: 8, question: "Pour retirer un widget d’une zone, on…", options: ["désactive le thème", "supprime le bloc de la zone, puis « Mettre à jour »", "vide le cache du site"], answer: 1, explanation: "On supprime le bloc dans sa zone, puis on enregistre avec « Mettre à jour »." },
  { id: "n3-q6", level: 3, moduleNum: 9, question: "Quelle est la différence entre catégories et étiquettes ?", options: ["Aucune, ce sont deux noms pour la même chose", "Les catégories structurent le site (hiérarchiques), les étiquettes sont des mots-clés transversaux", "Les étiquettes sont obligatoires, pas les catégories"], answer: 1, explanation: "Les catégories sont la structure du site, avec des sous-catégories ; les étiquettes relient des articles de rubriques différentes." },
  { id: "n3-q7", level: 3, moduleNum: 10, question: "À quoi sert le texte alternatif d’une image ?", options: ["À décorer la page", "À l’accessibilité et au référencement", "À renommer le fichier"], answer: 1, explanation: "Il est lu par les lecteurs d’écran et compris par les moteurs de recherche : il doit décrire réellement l’image." },
  { id: "n3-q8", level: 3, moduleNum: 4, question: "Une stagiaire rédige des articles qui doivent être relus avant publication. Quel rôle lui donner ?", options: ["Contributeur", "Éditeur", "Administrateur"], answer: 0, explanation: "Principe du moindre privilège : le contributeur rédige ses brouillons, un éditeur les met en ligne." },
  { id: "n3-q9", level: 3, moduleNum: 12, question: "Que devient le site quand on active un nouveau thème ?", options: ["Les articles sont supprimés", "Les contenus sont conservés, mais certains réglages d’apparence sont à refaire", "Les widgets sont conservés à l’identique"], answer: 1, explanation: "Les contenus (articles, pages, médias) restent ; les réglages de personnalisation sont propres à chaque thème." },
  { id: "n3-q10", level: 3, moduleNum: 12, question: "Dans le Personnaliseur, vos modifications sont appliquées au site seulement quand…", options: ["on a cliqué sur « Publier »", "on a fermé la fenêtre", "on a regardé l’aperçu"], answer: 0, explanation: "Sans « Publier », les modifications du Personnaliseur sont perdues." },
];

export const questionsByLevel = (level: number) => QUESTIONS.filter((q) => q.level === level);
