import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import DateTimePicker from "./DateTimePicker";

const meta = {
  title: "Composants/DateTimePicker",
  id: "DateTimePicker",
  component: DateTimePicker,
  tags: ["autodocs"],
  argTypes: {
    showTime: { control: "boolean" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    error: { control: "boolean" },
  },
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateOnly: Story = {
  args: {
    id: "date-only",
    label: "Date",
    showTime: false,
  },
  render: (args) => {
    const [value, setValue] = useState<Date | null>(null);
    return <DateTimePicker {...args} value={value} onChange={setValue} />;
  },
};

export const DateTime: Story = {
  args: {
    id: "date-time",
    label: "Heure et Date",
    showTime: true,
    required: true,
  },
  render: (args) => {
    const [value, setValue] = useState<Date | null>(new Date(2026, 3, 2, 2, 15));
    return <DateTimePicker {...args} value={value} onChange={setValue} />;
  },
};

export const WithError: Story = {
  args: {
    id: "date-error",
    label: "Date",
    error: true,
    assistiveText: "Ce champ est requis",
    required: true,
  },
  render: (args) => {
    const [value, setValue] = useState<Date | null>(null);
    return <DateTimePicker {...args} value={value} onChange={setValue} />;
  },
};

export const Disabled: Story = {
  args: {
    id: "date-disabled",
    label: "Date",
    disabled: true,
    showTime: true,
  },
  render: (args) => {
    const [value] = useState<Date | null>(new Date());
    return <DateTimePicker {...args} value={value} />;
  },
};
