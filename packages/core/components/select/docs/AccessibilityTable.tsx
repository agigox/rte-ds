import AccessibilityTable from "../../../../react/storybook-docs/ComponentDocs/Overview/AccessibilityTable/AccessibilityTable";
import type { AccessibilityCategory } from "../../../../react/storybook-docs/ComponentDocs/Overview/AccessibilityTable/AccessibilityTable";

const selectAccessibilityData: AccessibilityCategory[] = [
  {
    category: "Navigation clavier 🖥️",
    criteria: [
      {
        criterion: "L'utilisateur peut naviguer vers le Select avec Tab",
        expectedResult: "Le champ reçoit le focus",
        testMethod: "Navigation clavier avec TAB / SHIFT+TAB",
      },
      {
        criterion: "L'utilisateur peut ouvrir la liste avec Entrée / Espace",
        expectedResult: "La liste s'affiche",
        testMethod: "Clavier",
      },
      {
        criterion: "L'utilisateur peut parcourir les options avec les flèches",
        expectedResult: "Les options se sélectionnent sans fermer la liste",
        testMethod: "Clavier",
      },
      {
        criterion: "L'utilisateur peut fermer la liste avec ESC",
        expectedResult: "La liste se referme sans sélectionner",
        testMethod: "Clavier",
      },
    ],
  },
  {
    category: "Focus visible 👀",
    criteria: [
      {
        criterion: "L'état focus est visible sur le champ fermé",
        expectedResult: "Un contour est visible lors du focus clavier et est perceptible dans tous les états",
        testMethod: "Navigation clavier avec TAB / SHIFT+TAB",
      },
      {
        criterion: "L'option survolée a un focus clair dans la liste",
        expectedResult: "Soulignement ou surbrillance",
        testMethod: "Clavier",
      },
    ],
  },
  {
    category: "Lecture par un lecteur d'écran 🔊",
    criteria: [
      {
        criterion: "Le champ est lu comme une boîte de sélection",
        expectedResult: "Annonce du label, état, et valeur sélectionnée",
        testMethod: "Test avec NVDA, VoiceOver ou JAWS",
      },
      {
        criterion: "Les options sont énoncées au survol clavier",
        expectedResult: "Chaque ligne est lue avec sa valeur",
        testMethod: "Screen reader",
      },
      {
        criterion: "Si champ obligatoire, l'attribut aria-required est présent",
        expectedResult: "Annonce du caractère requis",
        testMethod: "Inspecteur a11y / ARIA Live Regions",
      },
    ],
  },
  {
    category: "Contraste des couleurs 🎨",
    criteria: [
      {
        criterion: "Le texte et les éléments visuels sont lisibles",
        expectedResult: "Contraste entre fond et texte ≥ 4.5:1 (texte, icônes)",
        testMethod: "Outils de contraste",
      },
    ],
  },
  {
    category: "Taille et espace tactile 📱",
    criteria: [
      {
        criterion: "Les éléments sont accessibles au doigt",
        expectedResult: "Hauteur du champ et des options ≥ 24px (AA)",
        testMethod: "Vérification manuelle ou test mobile ou simulateur tactile",
      },
    ],
  },
  {
    category: "Alternatives textuelles 📝",
    criteria: [
      {
        criterion: "Le label est toujours visible ou accessible",
        expectedResult: "Texte visible ou aria-label",
        testMethod: "Inspecteur HTML",
      },
      {
        criterion: "L'icône d'ouverture est décorative (chevron)",
        expectedResult: 'aria-hidden="true"',
        testMethod: "Inspecteur HTML",
      },
    ],
  },
  {
    category: "État et feedback visuel 🔄",
    criteria: [
      {
        criterion: "L'état sélectionné est visible même sans interaction",
        expectedResult: "Le champ indique la valeur actuelle",
        testMethod: "Visuel / inspection DOM",
      },
      {
        criterion: "Le message d'erreur est lié au champ",
        expectedResult: "aria-describedby utilisé",
        testMethod: "Inspecteur / SR",
      },
    ],
  },
];

const SelectAccessibilityTable = () => {
  return <AccessibilityTable data={selectAccessibilityData} />;
};

export default SelectAccessibilityTable;
