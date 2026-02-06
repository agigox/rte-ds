import { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect } from "@storybook/test";
import { useState } from "react";

import RadioButtonGroup from "./RadioButtonGroup";

const meta = {
  title: "Composants/RadioButtonGroup",
  component: RadioButtonGroup,
  tags: ["autodocs"],
  argTypes: {
    groupName: {
      control: "text",
      description: "The name of the radio button group.",
      defaultValue: "group1",
    },
    items: {
      control: "object",
      description: "The items in the radio button group.",
      defaultValue: ["Option 1", "Option 2", "Option 3"],
    },
    direction: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "The direction of the radio button group.",
      defaultValue: "horizontal",
    },
    showItemsLabel: {
      control: "boolean",
      description: "Whether to show the label for each item.",
      defaultValue: true,
    },
    groupTitle: {
      control: "text",
      description: "The title of the radio button group.",
      defaultValue: "Radio Button Group Title",
    },
    showGroupTitle: {
      control: "boolean",
      description: "Whether to show the group title.",
      defaultValue: true,
    },
    groupHelpText: {
      control: "text",
      description: "The help text for the radio button group.",
      defaultValue: "This is a help text for the radio button group.",
    },
    showHelpText: {
      control: "boolean",
      description: "Whether to show the help text.",
      defaultValue: true,
    },
    errorMessage: {
      control: "text",
      description: "The error message to display when there is an error. Use `error` prop to trigger this message.",
      defaultValue: "This is an error message. Please select an option.",
    },
    error: {
      control: "boolean",
      description: "Whether to show the error message. Use `errorMessage` prop to set the message.",
      defaultValue: false,
    },
    disabled: {
      control: "boolean",
      description: "Whether the radio button group is disabled. This will disable all radio buttons in the group.",
      defaultValue: false,
    },
    readOnly: {
      control: "boolean",
      description:
        "Whether the radio button group is read-only. This will make all radio buttons in the group read-only.",
      defaultValue: false,
    },
    value: {
      control: "text",
      description: "The currently selected value (controlled mode).",
    },
    defaultValue: {
      control: "text",
      description: "The default selected value (uncontrolled mode).",
    },
    onChange: {
      action: "changed",
      description: "Callback fired when the selected value changes.",
    },
    tooltipTextLabel: {
      control: "text",
      description: "Optional tooltip text that appears on hover.",
    },
  },
} satisfies Meta<typeof RadioButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    groupName: "radio-group",
    items: ["Option 1", "Option 2", "Option 3"],
    direction: "horizontal",
    showItemsLabel: true,
    groupTitle: "Radio Button Group Title",
    showGroupTitle: true,
    groupHelpText: "This is a help text for the radio button group.",
    showHelpText: true,
    errorMessage: "This is an error message. Please select an option.",
    error: false,
    disabled: false,
    readOnly: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButton = canvas.getByRole("radio", { name: "Option 1" });
    await userEvent.click(radioButton);
    expect(radioButton).toBeChecked();
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    groupName: "disabled-radio-group",
    disabled: true,
  },
  render: (args) => {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <RadioButtonGroup {...args} />
      </div>
    );
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    groupName: "error-radio-group",
    error: true,
  },
  render: (args) => {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <RadioButtonGroup {...args} />
      </div>
    );
  },
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    groupName: "readonly-radio-group",
    readOnly: true,
  },
  render: (args) => {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <RadioButtonGroup {...args} />
      </div>
    );
  },
};

export const Directions: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <RadioButtonGroup {...args} direction="horizontal" groupName="horizontal" />
        <RadioButtonGroup {...args} direction="vertical" groupName="vertical" />
      </div>
    );
  },
};

export const WithDefaultValue: Story = {
  args: {
    ...Default.args,
    groupName: "default-value-group",
    defaultValue: "Option 2",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButton2 = canvas.getByRole("radio", { name: "Option 2" });
    expect(radioButton2).toBeChecked();
  },
};

const ControlledExample = () => {
  const [selectedValue, setSelectedValue] = useState("Option 1");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <RadioButtonGroup
        groupName="controlled-group"
        items={["Option 1", "Option 2", "Option 3"]}
        value={selectedValue}
        onChange={setSelectedValue}
        showGroupTitle
        groupTitle="Controlled Radio Group"
      />
      <p>Selected value: <strong>{selectedValue}</strong></p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setSelectedValue("Option 1")}>Select Option 1</button>
        <button onClick={() => setSelectedValue("Option 2")}>Select Option 2</button>
        <button onClick={() => setSelectedValue("Option 3")}>Select Option 3</button>
      </div>
    </div>
  );
};

export const Controlled: Story = {
  args: {
    ...Default.args,
  },
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButton1 = canvas.getByRole("radio", { name: "Option 1" });
    const radioButton2 = canvas.getByRole("radio", { name: "Option 2" });

    expect(radioButton1).toBeChecked();

    await userEvent.click(radioButton2);
    expect(radioButton2).toBeChecked();
    expect(radioButton1).not.toBeChecked();

    const button1 = canvas.getByRole("button", { name: "Select Option 1" });
    await userEvent.click(button1);
    expect(radioButton1).toBeChecked();
  },
};

export const WithTooltip: Story = {
  args: {
    ...Default.args,
    groupName: "tooltip-group",
    tooltipTextLabel: "Please select one of the available options",
  },
};
