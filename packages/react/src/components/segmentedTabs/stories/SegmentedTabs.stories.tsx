import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import { useState } from "react";

import SegmentedTabs from "../SegmentedTabs";

const meta = {
  title: "Composants/SegmentedTabs/SegmentedTabs",
  component: SegmentedTabs,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["s", "l"],
      description: "Size of the segmented tabs",
      table: {
        type: { summary: "'s' | 'l'" },
        defaultValue: { summary: "'l'" },
      },
    },
    width: {
      control: "text",
      description: "Width of the tab bar",
      table: {
        type: { summary: "string | number" },
      },
    },
  },
} satisfies Meta<typeof SegmentedTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [
      { label: "Tab 1", id: "tab1", content: "Content for Tab 1" },
      { label: "Tab 2", id: "tab2", content: "Content for Tab 2" },
      { label: "Tab 3", id: "tab3", content: "Content for Tab 3" },
    ],
    defaultSelectedTab: "tab1",
    width: 420,
  },

  render: (args) => {
    return (
      <div data-testid="segmented-tabs-story">
        <SegmentedTabs {...args} />
      </div>
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByTestId("segmented-tabs-story");
    const tabs = container.querySelectorAll("[role='tab']");

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(canvas.getByText("Content for Tab 1")).toBeInTheDocument();

    await userEvent.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(canvas.getByText("Content for Tab 2")).toBeInTheDocument();

    await userEvent.click(tabs[2]);
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    expect(canvas.getByText("Content for Tab 3")).toBeInTheDocument();
  },
};

export const Controlled: Story = {
  args: {
    tabs: [
      { label: "Tab 1", id: "tab1", content: "Controlled content for Tab 1" },
      { label: "Tab 2", id: "tab2", content: "Controlled content for Tab 2" },
      { label: "Tab 3", id: "tab3", content: "Controlled content for Tab 3" },
    ],
    width: 420,
    onChange: fn(),
  },

  render: (args) => {
    const [selected, setSelected] = useState("tab1");

    const handleChange = (id: string) => {
      setSelected(id);
      args.onChange?.(id);
    };

    return <SegmentedTabs {...args} selectedTab={selected} onChange={handleChange} />;
  },
};

export const VaryingContentHeights: Story = {
  args: {
    tabs: [
      {
        label: "Short",
        id: "short",
        content: <p>Short content.</p>,
      },
      {
        label: "Medium",
        id: "medium",
        content: (
          <div>
            <p>This tab has more content than the first one.</p>
            <p>It spans multiple paragraphs to demonstrate varying heights.</p>
          </div>
        ),
      },
      {
        label: "Long",
        id: "long",
        content: (
          <div>
            <p>This tab has the most content of all three tabs.</p>
            <p>It includes several paragraphs to show how the panel adjusts.</p>
            <p>The container grows to fit the content naturally.</p>
            <p>No fixed height is applied to the panel.</p>
          </div>
        ),
      },
    ],
    defaultSelectedTab: "short",
    width: 420,
  },

  render: (args) => {
    return <SegmentedTabs {...args} />;
  },
};

export const SmallSize: Story = {
  args: {
    tabs: [
      { label: "Tab 1", id: "tab1", content: "Small size tab content 1" },
      { label: "Tab 2", id: "tab2", content: "Small size tab content 2" },
      { label: "Tab 3", id: "tab3", content: "Small size tab content 3" },
    ],
    size: "s",
    defaultSelectedTab: "tab1",
    width: 420,
  },

  render: (args) => {
    return <SegmentedTabs {...args} />;
  },
};

export const WithIcons: Story = {
  args: {
    tabs: [
      { label: "Agenda", id: "agenda", icon: "view-agenda", content: "Agenda view content" },
      { label: "Columns", id: "columns", icon: "view-column", content: "Column view content" },
      { label: "Grid", id: "grid", icon: "view-grid", content: "Grid view content" },
    ],
    defaultSelectedTab: "agenda",
    width: 420,
  },

  render: (args) => {
    return <SegmentedTabs {...args} />;
  },
};
