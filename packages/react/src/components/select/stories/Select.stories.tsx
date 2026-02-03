import { TESTING_DOWN_KEY, TESTING_ENTER_KEY } from "@rte-ds/core/constants/keyboard/keyboard-test.constants";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect } from "@storybook/test";
import { useState } from "react";

import { focusElementBeforeComponent } from "../../../../.storybook/testing/testing.utils";
import Select from "../Select";

const meta = {
  title: "Composants/Select/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    labelPosition: { control: { type: "select" }, options: ["top", "side"] },
    showLabel: { control: "boolean" },
    isError: { control: "boolean" },
    assistiveAppearance: {
      control: { type: "select" },
      options: ["description", "error", "success", "link"],
    },
    showAssistiveIcon: { control: "boolean" },
    assistiveTextLabel: { control: "text" },
    showLabelRequirement: { control: "boolean" },
    required: { control: "boolean" },
    options: { control: "object" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    showResetButton: { control: "boolean" },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "select1",
    label: "Choisir une option",
    showLabel: true,
    isError: false,
    assistiveAppearance: "description",
    showAssistiveIcon: false,
    assistiveTextLabel: "This is a description for the select component.",
    options: [
      { value: "option-1", label: "Option 1" },
      { value: "option-2", label: "Option 2" },
      { value: "option-3", label: "Option 3" },
    ],
    disabled: false,
    readonly: false,
    showResetButton: false,
  },
  render: (args) => {
    const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>();

    const handleOnChange = (value: string) => {
      setSelectedOption(args.options.find((option) => option.value === value));
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "280px" }}>
        <Select {...args} onChange={handleOnChange} value={selectedOption?.value} />
        <span style={{ fontFamily: "Arial", color: "var(--content-primary)" }}>
          Selected value : {selectedOption?.label || "No value"}
        </span>
      </div>
    );
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    isError: true,
  },
  render: (args) => {
    const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>();

    const handleOnChange = (value: string) => {
      setSelectedOption(args.options.find((option) => option.value === value));
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "280px" }}>
        <Select {...args} onChange={handleOnChange} value={selectedOption?.value} />
        <span style={{ fontFamily: "Arial", color: "var(--content-primary)" }}>
          Selected value : {selectedOption?.label || "No value"}
        </span>
      </div>
    );
  },
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    readonly: true,
  },
  render: (args) => {
    const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>();

    const handleOnChange = (value: string) => {
      setSelectedOption(args.options.find((option) => option.value === value));
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "280px" }}>
        <Select {...args} onChange={handleOnChange} value={selectedOption?.value} />
        <span style={{ fontFamily: "Arial", color: "var(--content-primary)" }}>
          Selected value : {selectedOption?.label || "No value"}
        </span>
      </div>
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox");
    await userEvent.tab();
    expect(select).not.toHaveFocus();
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
  render: (args) => {
    const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>();

    const handleOnChange = (value: string) => {
      setSelectedOption(args.options.find((option) => option.value === value));
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "280px" }}>
        <Select {...args} onChange={handleOnChange} value={selectedOption?.value} />
        <span style={{ fontFamily: "Arial", color: "var(--content-primary)" }}>
          Selected value : {selectedOption?.label || "No value"}
        </span>
      </div>
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox");
    await userEvent.tab();
    expect(select).not.toHaveFocus();
  },
};

export const KeyboardInteraction: Story = {
  args: {
    ...Default.args,
    showResetButton: true,
  },
  render: (args) => {
    const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>();

    const handleOnChange = (value: string) => {
      setSelectedOption(args.options.find((option) => option.value === value));
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "280px" }}>
        <Select {...args} onChange={handleOnChange} value={selectedOption?.value} />
        <span style={{ fontFamily: "Arial", color: "var(--content-primary)" }}>
          Selected value : {selectedOption?.label || "No value"}
        </span>
      </div>
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox");
    focusElementBeforeComponent(canvasElement);
    await userEvent.tab();
    expect(select).toHaveFocus();
    await userEvent.keyboard(TESTING_ENTER_KEY);
    await userEvent.tab();
    await userEvent.keyboard(TESTING_DOWN_KEY);
    await userEvent.keyboard(TESTING_ENTER_KEY);
    expect(select).toHaveTextContent("Option 2");

    const clearButton = select.querySelector("button");
    const toggleIcon = select.querySelector("[data-testid='trigger-icon']");

    await userEvent.click(clearButton!);
    expect(select).toHaveTextContent("");

    await userEvent.click(toggleIcon!);

    await userEvent.tab();
    await userEvent.tab();

    await userEvent.keyboard(TESTING_DOWN_KEY);
    await userEvent.keyboard(TESTING_DOWN_KEY);
    await userEvent.keyboard(TESTING_ENTER_KEY);
    expect(select).toHaveTextContent("Option 3");
  },
};

export const WithIcons: Story = {
  args: {
    id: "select-with-icons",
    label: "Choisir une catégorie",
    showLabel: true,
    isError: false,
    assistiveAppearance: "description",
    showAssistiveIcon: false,
    assistiveTextLabel: "Select an option with an icon.",
    options: [
      { value: "home", label: "Accueil", icon: "building-home" },
      { value: "settings", label: "Paramètres", icon: "action-settings" },
      { value: "user", label: "Utilisateur", icon: "user-single" },
      { value: "folder", label: "Dossiers", icon: "content-folder" },
    ],
    disabled: false,
    readonly: false,
    showResetButton: true,
  },
  render: (args) => {
    const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>();

    const handleOnChange = (value: string) => {
      setSelectedOption(args.options.find((option) => option.value === value));
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "280px" }}>
        <Select {...args} onChange={handleOnChange} value={selectedOption?.value} />
        <span style={{ fontFamily: "Arial", color: "var(--content-primary)" }}>
          Selected value : {selectedOption?.label || "No value"}
        </span>
      </div>
    );
  },
};

export const ControlledFromOutside: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState<string>("");

    const handleOnChange = (value: string) => {
      setSelectedValue(value);
    };

    const setToOption1 = () => setSelectedValue("option-1");
    const setToOption2 = () => setSelectedValue("option-2");
    const setToOption3 = () => setSelectedValue("option-3");
    const resetValue = () => setSelectedValue("");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "400px" }}>
        <Select {...args} onChange={handleOnChange} value={selectedValue} />
        <span style={{ fontFamily: "Arial", color: "var(--content-primary)" }}>
          Selected value : {selectedValue || "No value"}
        </span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button data-testid="set-option-1" onClick={setToOption1}>
            Set Option 1
          </button>
          <button data-testid="set-option-2" onClick={setToOption2}>
            Set Option 2
          </button>
          <button data-testid="set-option-3" onClick={setToOption3}>
            Set Option 3
          </button>
          <button data-testid="reset-value" onClick={resetValue}>
            Reset
          </button>
        </div>
      </div>
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox");

    // Initially, the select should be empty
    expect(select).toHaveTextContent("");

    // Click button to set Option 1 from outside
    const setOption1Button = canvas.getByTestId("set-option-1");
    await userEvent.click(setOption1Button);
    expect(select).toHaveTextContent("Option 1");

    // Click button to set Option 2 from outside
    const setOption2Button = canvas.getByTestId("set-option-2");
    await userEvent.click(setOption2Button);
    expect(select).toHaveTextContent("Option 2");

    // Click button to set Option 3 from outside
    const setOption3Button = canvas.getByTestId("set-option-3");
    await userEvent.click(setOption3Button);
    expect(select).toHaveTextContent("Option 3");

    // Reset the value from outside
    const resetButton = canvas.getByTestId("reset-value");
    await userEvent.click(resetButton);
    expect(select).toHaveTextContent("");

    // Now select via the dropdown to ensure both ways work
    await userEvent.click(select);
    const option2 = canvas.getByText("Option 2");
    await userEvent.click(option2);
    expect(select).toHaveTextContent("Option 2");

    // Then change from outside again to verify controlled behavior overrides internal state
    await userEvent.click(setOption1Button);
    expect(select).toHaveTextContent("Option 1");
  },
};

export const Multiple: Story = {
  args: {
    id: "select-multiple",
    label: "Sélection multiple",
    showLabel: true,
    isError: false,
    assistiveAppearance: "description",
    showAssistiveIcon: false,
    assistiveTextLabel: "Vous pouvez sélectionner plusieurs options.",
    options: [
      { value: "option-1", label: "Option 1" },
      { value: "option-2", label: "Option 2" },
      { value: "option-3", label: "Option 3" },
      { value: "option-4", label: "Option 4" },
      { value: "option-5", label: "Option 5" },
    ],
    disabled: false,
    readonly: false,
    showResetButton: true,
    multiple: true,
  },
  render: (args) => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const handleMultipleChange = (values: string[]) => {
      setSelectedValues(values);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "280px" }}>
        <Select {...args} multipleValue={selectedValues} onMultipleChange={handleMultipleChange} />
        <span style={{ fontFamily: "Arial", color: "var(--content-primary)" }}>
          Selected values : {selectedValues.length > 0 ? selectedValues.join(", ") : "No value"}
        </span>
      </div>
    );
  },
};

export const MultipleWithIcons: Story = {
  args: {
    id: "select-multiple-icons",
    label: "Sélection multiple avec icônes",
    showLabel: true,
    isError: false,
    assistiveAppearance: "description",
    showAssistiveIcon: false,
    assistiveTextLabel: "Sélectionnez plusieurs catégories.",
    options: [
      { value: "home", label: "Accueil", icon: "building-home" },
      { value: "settings", label: "Paramètres", icon: "action-settings" },
      { value: "user", label: "Utilisateur", icon: "user-single" },
      { value: "folder", label: "Dossiers", icon: "content-folder" },
      { value: "search", label: "Recherche", icon: "action-search" },
    ],
    disabled: false,
    readonly: false,
    showResetButton: true,
    multiple: true,
  },
  render: (args) => {
    const [selectedValues, setSelectedValues] = useState<string[]>(["home", "settings"]);

    const handleMultipleChange = (values: string[]) => {
      setSelectedValues(values);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "320px" }}>
        <Select {...args} multipleValue={selectedValues} onMultipleChange={handleMultipleChange} />
        <span style={{ fontFamily: "Arial", color: "var(--content-primary)" }}>
          Selected values : {selectedValues.length > 0 ? selectedValues.join(", ") : "No value"}
        </span>
      </div>
    );
  },
};
