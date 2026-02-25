import { Meta, StoryObj } from "@storybook/react";

import Divider from "../Divider";

const meta = {
  title: "Composants/Divider/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100px", width: "500px" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Orientation of the divider",
      defaultValue: "horizontal",
    },
    thickness: {
      control: "select",
      options: ["light", "medium", "bold"],
      description: "Thickness of the divider",
      defaultValue: "light",
    },
    appearance: {
      control: "select",
      options: ["default", "inverse", "brand"],
      description: "Color of the divider",
      defaultValue: "default",
    },
    endPoint: {
      control: "select",
      options: ["round", "square"],
      description: "End point style of the divider",
      defaultValue: "round",
    },
    text: {
      control: "text",
      description: "Optional text label displayed before the divider line",
    },
  },
} satisfies Meta<typeof Divider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    orientation: "horizontal",
    thickness: "light",
    appearance: "default",
  },
};

export const Brand: Story = {
  args: {
    orientation: "horizontal",
    thickness: "light",
    appearance: "brand",
  },
};

export const VerticalSizes: Story = {
  args: {
    orientation: "vertical",
    thickness: "light",
    appearance: "default",
  },
  render: (args) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", height: "100px", width: "500px" }}>
      <Divider {...args} thickness="light" />
      <Divider {...args} thickness="medium" />
      <Divider {...args} thickness="bold" />
    </div>
  ),
};

export const HorizontalSizes: Story = {
  args: {
    orientation: "horizontal",
    thickness: "light",
    appearance: "default",
  },
  render: (args) => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "20px", justifyContent: "space-between", width: "500px" }}
    >
      <Divider {...args} thickness="light" />
      <Divider {...args} thickness="medium" />
      <Divider {...args} thickness="bold" />
    </div>
  ),
};

export const SquaredEnd: Story = {
  args: {
    orientation: "horizontal",
    thickness: "light",
    appearance: "default",
    endPoint: "square",
  },
  render: (args) => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "20px", justifyContent: "space-between", width: "500px" }}
    >
      <Divider {...args} thickness="light" />
      <Divider {...args} thickness="medium" />
      <Divider {...args} thickness="bold" />
    </div>
  ),
};

export const WithText: Story = {
  args: {
    orientation: "horizontal",
    thickness: "light",
    appearance: "default",
    text: "23/02/2025",
  },
};

export const WithTextVariants: Story = {
  args: {
    orientation: "horizontal",
    text: "Section title",
  },
  render: (args) => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "20px", justifyContent: "space-between", width: "500px" }}
    >
      <Divider {...args} thickness="light" />
      <Divider {...args} thickness="medium" />
      <Divider {...args} thickness="bold" />
      <Divider {...args} appearance="brand" />
    </div>
  ),
};

export const InverseColor: Story = {
  args: {
    orientation: "horizontal",
    thickness: "light",
    appearance: "inverse",
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: "#214770", width: "100%", padding: "20px" }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "20px", justifyContent: "space-between", width: "500px" }}
    >
      <Divider {...args} thickness="light" />
      <Divider {...args} thickness="medium" />
      <Divider {...args} thickness="bold" />
    </div>
  ),
};
