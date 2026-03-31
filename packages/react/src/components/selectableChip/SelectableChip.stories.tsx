import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import SelectableChip from "./SelectableChip";

const meta = {
  title: "Composants/SelectableChip",
  id: "SelectableChip",
  component: SelectableChip,
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: { control: "color" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof SelectableChip>;

export default meta;
type Story = StoryObj<typeof meta>;

const roleOptions = [
  { label: "Utilisateur", value: "user", icon: "user" },
  { label: "Admin", value: "admin", icon: "admin-panel-settings" },
];

export const Default: Story = {
  args: {
    id: "selectable-chip-default",
    label: "Utilisateur",
    icon: "user",
    options: roleOptions,
    backgroundColor: "#e6f2a4",
  },
  render: (args) => {
    const [value, setValue] = useState("user");
    const selected = roleOptions.find((o) => o.value === value);
    return (
      <SelectableChip
        {...args}
        value={value}
        onChange={setValue}
        label={selected?.label ?? args.label}
        icon={selected?.icon ?? args.icon}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    id: "selectable-chip-disabled",
    label: "Utilisateur",
    icon: "user",
    options: roleOptions,
    backgroundColor: "#e6f2a4",
    disabled: true,
    value: "user",
  },
};

export const CustomColor: Story = {
  args: {
    id: "selectable-chip-custom",
    label: "Status",
    icon: "info-outlined",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Pending", value: "pending" },
    ],
    backgroundColor: "#a4d4f2",
  },
  render: (args) => {
    const [value, setValue] = useState("active");
    const selected = args.options.find((o) => o.value === value);
    return <SelectableChip {...args} value={value} onChange={setValue} label={selected?.label ?? args.label} />;
  },
};
