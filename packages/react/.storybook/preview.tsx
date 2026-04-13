import type { Preview } from "@storybook/react";
import "@rte-ds/react/style.css";
import "@rte-ds/core/css/rte-fonts.css";

import "./preview.scss";
import "../storybook-docs/styles/CodeBlocks.css";

import ThemeSelector from "./template/ThemeSelector/ThemeSelector";

export const decorators: Preview["decorators"] = [
  (Story, context) => {
    return (
      <div
        style={{
          padding: "16px 16px 80px 50px",
          backgroundColor: "var(--background-default)",
          width: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "96px",
        }}
      >
        <ThemeSelector />
        <div
          style={{
            margin: "auto",
          }}
        >
          <Story {...context} />
        </div>
      </div>
    );
  },
];

const preview: Preview = {
  decorators: decorators,
  globalTypes: {
    modeDev: {
      name: "Mode Dev",
      description: "Mode Dev pour les composants",
      toolbar: {
        icon: "eye",
        title: "Vue",
        items: [
          { value: "utilisateur", right: "hide stories", title: "Utilisateur" },
          { value: "dev", right: "show stories", title: "Dev" },
        ],
        showName: true,
      },
    },
  },
  initialGlobals: {
    modeDev: "utilisateur",
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    docs: {
      toc: {
        headingSelector: "h2",
        disable: false,
      },
    },
    options: {
      storySort: {
        order: [
          "Design system",
          [
            "Accueil",
            "Luciole",
            "Get Started - Kit de démarrage",
            ["Design", "React"],
            "Get Started - Kit de migration",
            ["Général", "Pour les designers", "React"],
            "Get Started - Contribuer",
            ["Gouvernance", "Évolutions et nouveaux composants", "Bugs et Anomalies", "Icônes"],
          ],
          "Guidelines",
          "Fondations",
          "Composants",
        ],
        method: "alphabetical",
        locales: "fr-FR",
      },
    },
  },
};

document.querySelector("html")?.setAttribute("data-theme", "bleu_iceberg");
document.querySelector("html")?.setAttribute("data-mode", "light");

export default preview;
