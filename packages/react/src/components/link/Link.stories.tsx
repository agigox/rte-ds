import { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect } from "@storybook/test";

import { focusElementBeforeComponent } from "../../../.storybook/testing/testing.utils";

import Link from "./Link";

const meta = {
  title: "Composants/Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    subtle: {
      control: "boolean",
    },
    externalLink: {
      control: "boolean",
    },
    reverse: {
      control: "boolean",
    },
    icon: {
      control: "text",
    },
    iconPosition: {
      control: "radio",
      options: ["left", "right"],
    },
  },
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Link",
    href: "#",
    reverse: false,
  },
};

export const Subtle: Story = {
  args: {
    label: "Subtle Link",
    href: "#",
    subtle: true,
  },
  render: (args) => {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <Link {...args} label="Subtle Link" href="#" />
        <Link {...args} label="Subtle Link" href="#" externalLink />
      </div>
    );
  },
};

export const NotSubtle: Story = {
  args: {
    label: "External Link",
    href: "#",
  },
  render: (args) => {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <Link {...args} label="External Link" href="#" />
        <Link {...args} label="External Link" href="#" externalLink />
      </div>
    );
  },
};

export const Reverse: Story = {
  args: {
    label: "External Link",
    href: "#",
    reverse: true,
    subtle: true,
  },
  render: (args) => {
    return (
      <div style={{ display: "flex", gap: 8, backgroundColor: "black", padding: 16 }}>
        <Link {...args} label="External Link" href="#" />
        <Link {...args} label="External Link" href="#" externalLink />
      </div>
    );
  },
};

export const WithIconLeft: Story = {
  args: {
    label: "Download",
    href: "#",
    icon: "download",
    iconPosition: "left",
  },
};

export const WithIconRight: Story = {
  args: {
    label: "Next page",
    href: "#",
    icon: "arrow-right",
    iconPosition: "right",
  },
};

export const WithIconVariants: Story = {
  args: {
    label: "Link with icon",
    href: "#",
  },
  render: (args) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Link {...args} label="Download file" icon="download" iconPosition="left" />
        <Link {...args} label="Go to next" icon="arrow-right" iconPosition="right" />
        <Link {...args} label="External with icon" icon="link" externalLink />
        <Link {...args} label="Subtle with icon" icon="info" subtle />
      </div>
    );
  },
};

export const KeyboardInteraction: Story = {
  args: {
    label: "Link",
    href: "#",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link");
    focusElementBeforeComponent(canvasElement);
    await userEvent.tab();
    expect(link).toHaveFocus();
  },
};
