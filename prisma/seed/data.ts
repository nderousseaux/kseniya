import type { Board } from '@/src/types/Board';
import type { Group } from '@/src/types/Group';
import type { Item } from '@/src/types/Item';

const items1: Item[] = [
  { name: "Item 1", description: "Court.", img: "/img/dog.jpg" },
  { name: "Item 2", description: "Description un peu plus longue pour cet item.", img: "/img/dog.jpg" },
  { name: "Item 3", description: "Voici une description de taille moyenne, ni trop courte ni trop longue.", img: "/img/dog.jpg" },
  { name: "Item 4", description: "Un texte très court.", img: "/img/dog.jpg" },
  { name: "Item 5", description: "Ceci est une description beaucoup plus longue destinée à tester l'affichage de textes de différentes tailles dans l'interface utilisateur. Elle contient plusieurs phrases pour simuler un contenu réel.", img: "/img/dog.jpg" },
  { name: "Item 6", description: "Moyenne longueur.", img: "/img/dog.jpg" }
];

const items2: Item[] = [
  { name: "Item A", description: "Très court.", img: "/img/dog.jpg" },
  { name: "Item B", description: "", img: "/img/dog.jpg" }
];

const groups: Group[] = [
  { name: "Groupe 1", quote: "Ceci est une citation d'exemple pour le groupe 1.", items: items1 },
  { name: "Groupe 2", quote: "", items: items2 }
];

const data: Omit<Board, 'password'> = {
  title: "Page d'exemple",
  description: "Un exemple de page avec des textes de description de longueurs variées.",
  groups
};

export default data;
