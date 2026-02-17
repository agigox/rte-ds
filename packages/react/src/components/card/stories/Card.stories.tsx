import {
  cardStoryArgTypes,
  sizeExamples,
  cardTypeExamples,
  defaultStoryArgs,
  clickableStoryArgs,
  disabledStoryArgs,
} from "@rte-ds/core/components/card/card.stories.shared";
import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import { useState } from "react";

import Button from "../../button/Button";
import Card from "../Card";

const meta = {
  title: "Composants/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    ...cardStoryArgTypes,
    onClick: { action: "clicked" },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultContent = (
  <div style={{ padding: "16px" }}>
    <h2 style={{ margin: "0 0 12px 0", fontSize: "20px", fontWeight: "600" }}>Card Title</h2>
    <p style={{ margin: "0 0 16px 0", color: "#666", lineHeight: "1.5" }}>
      This is a sample card with some content. You can add any content you want here, including text, images, buttons,
      or other components.
    </p>
  </div>
);

export const Default: Story = {
  args: {
    ...defaultStoryArgs,
    children: defaultContent,
  },
};

export const Sizes: Story = {
  args: defaultStoryArgs,
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {sizeExamples.map((example) => (
        <Card key={example.size} {...args} size={example.size}>
          <div style={{ padding: "16px" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "600" }}>{example.label}</h3>
            <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>{example.width}</p>
          </div>
        </Card>
      ))}
    </div>
  ),
};

export const CardTypes: Story = {
  args: defaultStoryArgs,
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {cardTypeExamples.map((example) => (
        <Card key={example.cardType} {...args} cardType={example.cardType}>
          <div style={{ padding: "16px" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>{example.title}</h3>
            <p style={{ margin: "0", color: "#666", lineHeight: "1.5" }}>{example.description}</p>
          </div>
        </Card>
      ))}
    </div>
  ),
};

export const Clickable: Story = {
  args: clickableStoryArgs,
  render: (args) => (
    <Card {...args} onClick={args.onClick}>
      <div style={{ padding: "16px" }}>
        <h2 style={{ margin: "0 0 12px 0", fontSize: "20px", fontWeight: "600" }}>Clickable Card</h2>
        <p style={{ margin: "0 0 16px 0", color: "#666", lineHeight: "1.5" }}>
          This card is clickable. Click anywhere on the card to trigger an action.
        </p>
        <p style={{ margin: "0", color: "#999", fontSize: "14px" }}>
          Check the console or Actions panel to see the click event.
        </p>
      </div>
    </Card>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const cardText = canvas.getByText("Clickable Card");
    const card = cardText.closest("[data-clickable='true']") as HTMLElement;
    expect(card).toBeInTheDocument();
    await userEvent.click(card);
    expect(args.onClick).toHaveBeenCalled();
  },
};

export const Disabled: Story = {
  args: disabledStoryArgs,
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Card {...args} cardType="default">
        <div style={{ padding: "16px" }}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "20px", fontWeight: "600" }}>Disabled Default Card</h2>
          <p style={{ margin: "0", color: "#666", lineHeight: "1.5" }}>This card is disabled and cannot be clicked.</p>
        </div>
      </Card>
      <Card {...args} cardType="outlined">
        <div style={{ padding: "16px" }}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "20px", fontWeight: "600" }}>Disabled Outlined Card</h2>
          <p style={{ margin: "0", color: "#666", lineHeight: "1.5" }}>This outlined card is also disabled.</p>
        </div>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cards = canvasElement.querySelectorAll("[data-disabled='true']");
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      expect(card).toHaveAttribute("data-disabled", "true");
    });
  },
};

export const WithButtons: Story = {
  args: defaultStoryArgs,
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Card {...args}>
        <div style={{ padding: "16px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: "600" }}>Primary Button</h3>
          <p style={{ margin: "0 0 16px 0", color: "#666", lineHeight: "1.5" }}>Card with primary button variant</p>
          <Button variant="primary" label="Primary Action" onClick={() => console.log("Primary clicked")} />
        </div>
      </Card>
      <Card {...args}>
        <div style={{ padding: "16px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: "600" }}>Secondary Button</h3>
          <p style={{ margin: "0 0 16px 0", color: "#666", lineHeight: "1.5" }}>Card with secondary button variant</p>
          <Button variant="secondary" label="Secondary Action" onClick={() => console.log("Secondary clicked")} />
        </div>
      </Card>
      <Card {...args}>
        <div style={{ padding: "16px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: "600" }}>Multiple Buttons</h3>
          <p style={{ margin: "0 0 16px 0", color: "#666", lineHeight: "1.5" }}>Card with multiple button actions</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button variant="primary" label="Save" onClick={() => console.log("Save clicked")} />
            <Button variant="neutral" label="Cancel" onClick={() => console.log("Cancel clicked")} />
          </div>
        </div>
      </Card>
    </div>
  ),
};

export const ClickableWithContent: Story = {
  args: clickableStoryArgs,
  render: (args) => (
    <Card {...args}>
      <div style={{ padding: "16px" }}>
        <h2 style={{ margin: "0 0 12px 0", fontSize: "20px", fontWeight: "600" }}>Clickable Card with Button</h2>
        <p style={{ margin: "0 0 16px 0", color: "#666", lineHeight: "1.5" }}>
          This card is clickable. Click anywhere on the card to trigger the card click event. The button inside will
          stop propagation, so clicking it won't trigger the card click.
        </p>
        <Button
          variant="primary"
          label="Action Button"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Button clicked inside card");
          }}
        />
      </div>
    </Card>
  ),
};

export const Selected: Story = {
  args: {
    ...defaultStoryArgs,
    selected: true,
  },
  render: (args) => (
    <Card {...args}>
      <div style={{ padding: "16px" }}>
        <h2 style={{ margin: "0 0 12px 0", fontSize: "20px", fontWeight: "600" }}>Selected Card</h2>
        <p style={{ margin: "0", color: "#666", lineHeight: "1.5" }}>
          This card is in selected state with a blue background and brand border.
        </p>
      </div>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector("[data-selected='true']") as HTMLElement;
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("data-selected", "true");
  },
};

export const States: Story = {
  args: defaultStoryArgs,
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Card {...args}>
        <div style={{ padding: "16px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>Default State</h3>
          <p style={{ margin: "0", color: "#666", lineHeight: "1.5" }}>White background with elevation shadow.</p>
        </div>
      </Card>
      <Card {...args} clickable>
        <div style={{ padding: "16px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>Hover State</h3>
          <p style={{ margin: "0", color: "#666", lineHeight: "1.5" }}>Hover over this card to see the hover effect.</p>
        </div>
      </Card>
      <Card {...args} selected>
        <div style={{ padding: "16px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>Selected State</h3>
          <p style={{ margin: "0", color: "#666", lineHeight: "1.5" }}>
            Blue background with brand border indicating selection.
          </p>
        </div>
      </Card>
      <Card {...args} pressed>
        <div style={{ padding: "16px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>Pressed State</h3>
          <p style={{ margin: "0", color: "#666", lineHeight: "1.5" }}>
            Darker background indicating the card is being pressed.
          </p>
        </div>
      </Card>
    </div>
  ),
};

export const Pressed: Story = {
  args: {
    ...defaultStoryArgs,
    pressed: true,
  },
  render: (args) => (
    <Card {...args}>
      <div style={{ padding: "16px" }}>
        <h2 style={{ margin: "0 0 12px 0", fontSize: "20px", fontWeight: "600" }}>Pressed Card</h2>
        <p style={{ margin: "0", color: "#666", lineHeight: "1.5" }}>
          This card is in pressed state with a darker background.
        </p>
      </div>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector("[data-pressed='true']") as HTMLElement;
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("data-pressed", "true");
  },
};

export const Selectable: Story = {
  args: {
    ...clickableStoryArgs,
  },
  render: (args) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const cards = [
      { id: "card1", title: "E2-4_vol_01", description: "Fuite d'huile dans le transformateur principal" },
      { id: "card2", title: "E1-3_eau_02", description: "Consommation d'eau excessive sur le site de production" },
      { id: "card3", title: "E3-1_bio_01", description: "Impact sur la biodiversit\u00e9 locale" },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} data-testid="selectable-cards">
        {cards.map((card) => (
          <Card
            key={card.id}
            {...args}
            selected={selectedId === card.id}
            onClick={() => setSelectedId(selectedId === card.id ? null : card.id)}
          >
            <div style={{ padding: "12px 16px" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#727272" }}>{card.id}</p>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "600" }}>{card.title}</h3>
              <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.5", color: "#11161a" }}>{card.description}</p>
            </div>
          </Card>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByTestId("selectable-cards");
    const cards = container.querySelectorAll("[data-clickable='true']");

    expect(cards[0]).toHaveAttribute("data-selected", "false");
    await userEvent.click(cards[0]);
    expect(cards[0]).toHaveAttribute("data-selected", "true");
    expect(cards[1]).toHaveAttribute("data-selected", "false");

    await userEvent.click(cards[1]);
    expect(cards[0]).toHaveAttribute("data-selected", "false");
    expect(cards[1]).toHaveAttribute("data-selected", "true");

    await userEvent.click(cards[1]);
    expect(cards[1]).toHaveAttribute("data-selected", "false");
  },
};
