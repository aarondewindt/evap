import { TextInput, ActionIcon, NumberInput, Loader, Overlay, MultiSelect, createTheme, Select, Autocomplete, PillsInput } from '@mantine/core';
import contained_input_classes from "@/styles/contained_input.module.css"
import { DateTimePicker } from '@mantine/dates';


export const theme = createTheme({
  // shadows: {
  //     xs: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
  //     sm: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
  //     md: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
  //     lg: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
  //     xl: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
  // },
  // colors: {
  //   white: ['#FFF', "#FFF", "#FFF", "#FFF", "#FFF", "#FFF", "#FFF", "#FFF", "#FFF", "#FFF"],
  // },
  
  black: "#2C2E33",
  white: "#f8f9fa",

  components: {
    Loader: Loader.extend({
      defaultProps: { 
        type: "bars",
      }
    }),

    Overlay: Overlay.extend({
      defaultProps: { 
        backgroundOpacity: 0.5,
        color: "#eee",
        blur: 3,
      }
    }),

    ActionIcon: ActionIcon.extend({
      defaultProps: { 
        variant: "light",
      }
    }),

    TextInput: TextInput.extend({
      defaultProps: {
        classNames: contained_input_classes
      }
    }),

    MultiSelect: MultiSelect.extend({
      defaultProps: {
        classNames: contained_input_classes,
        styles: {
          inputField: {
            minWidth: "2rem",
          }
        }
      }
    }),

    Select: Select.extend({
      defaultProps: {
        classNames: contained_input_classes
      }
    }),

    NumberInput: NumberInput.extend({
      defaultProps: {
        classNames: contained_input_classes
      }
    }),

    Autocomplete: Autocomplete.extend({
      defaultProps: {
        classNames: contained_input_classes
      }
    }),

    Textarea: TextInput.extend({
      defaultProps: {
        classNames: contained_input_classes
      }
    }),

    PillsInput: PillsInput.extend({
      defaultProps: {
        classNames: contained_input_classes,
      }
    }),

    DateTimePicker: DateTimePicker.extend({
      defaultProps: {
        classNames: contained_input_classes,
        valueFormat: "DD MMM YYYY hh:mm A"
      }
    }),

  },
})


