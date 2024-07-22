import { ReactNode, useState, useEffect, useRef, useCallback, ComponentProps, forwardRef } from 'react';
import { Center, Stack, Loader, Text, Accordion, Tabs, Group, Button, Grid, ButtonProps, createPolymorphicComponent, ActionIconProps, ActionIcon, Tooltip, Box, MenuProps, MenuTargetProps, MenuDropdownProps, Menu, rem, px, PopoverProps, PopoverTargetProps, PopoverDropdownProps, Popover, GroupProps, TextProps, DividerProps, Divider, ButtonVariant } from '@mantine/core';
import _ from "lodash";
import { IconChevronCompactDown, IconChevronDown } from '@tabler/icons-react';


const BUTTON_VARIANT: ButtonVariant = "light"

export interface ToolbarProps {
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
  children?: ReactNode
} 
  
export const Toolbar = ({left, center, right, children}: ToolbarProps) => {
  let justify: GroupProps["justify"] = "space-between"
  if (left && !center && !right) {
    justify = "flex-start"
    children = left

  } else if (!left && center && !right) {
    justify = "center"
    children = center

  } else if (!left && !center && right) {
    justify = "flex-end"
    children = right

  } else if (left && center && !right) {
    children = <>
      <Group gap={2}>{ left }</Group>
      <Group gap={2}>{ center }</Group>
      <div/>
    </> 

  } else if (left && !center && right) {
    children = <>
      <Group gap={2}>{ left }</Group>
      <Group gap={2}>{ right }</Group>
    </> 

  } else if (!left && center && right) {
    children = <>
      <div/>
      <Group gap={2}>{ center }</Group>
      <Group gap={2}>{ right }</Group>
    </> 

  } else if (left && center && right) {
    children = <>
      <Group gap={2}>{ left }</Group>
      <Group gap={2}>{ center }</Group>
      <Group gap={2}>{ right }</Group>
    </> 
  }

  return <Box bd="bottom"
            style={{ background: "var(--mantine-color-gray-1)"}}
            >
    <Group  p={2}
            gap={2}
            justify={justify} 
            style={{
              width: "100%"
            }}>
      {children}             
    </Group>
  </Box>
}



// Button
const _ToolbarButton = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...others }, ref) => {
  others = _.defaults(others, {
    variant: BUTTON_VARIANT,
    color: "gray",
    size: "compact-sm",
  })
  return <Button component="button" {...others} ref={ref}>
    { children }
  </Button>
})

_ToolbarButton.displayName = '_ToolbarButton';

export const ToolbarButton = createPolymorphicComponent<'button', ButtonProps>(_ToolbarButton);



// ActionIcon
export type ToolbarActionIconProps = ActionIconProps & {
  tooltip?: string
}

const _ToolbarActionIcon = forwardRef<HTMLButtonElement, ToolbarActionIconProps>(({ children, tooltip, ...others }, ref) => {
  others = _.defaults(others, {
    variant: BUTTON_VARIANT,
    color: "gray",
    size: "md"
  })

  const action_icon = <ActionIcon component="button" {...others} ref={ref}>
    { children }
  </ActionIcon>

  if (tooltip) {
    return <Tooltip label={tooltip}>{ action_icon }</Tooltip>
  } else {
    return action_icon
  }
})

_ToolbarActionIcon.displayName = '_ToolbarActionIcon';

export const ToolbarActionIcon = createPolymorphicComponent<'button', ToolbarActionIconProps>(_ToolbarActionIcon);



// Menu
export type ToolbarMenuProps = MenuProps & {
  label: ReactNode
  target_props?: MenuTargetProps
  button_props?: ButtonProps
  dropdown_props?: Omit<MenuDropdownProps, "children">
  children?: MenuDropdownProps["children"]
}

export const ToolbarMenu = ({ label, children, target_props, button_props, dropdown_props, ...others }: ToolbarMenuProps) => {
  button_props = _.defaults(button_props, {
    variant: BUTTON_VARIANT,
    rightSection: <IconChevronDown size="1rem"/>,
    styles: {
      "section": {"marginLeft": 0},
    }
  })

  return <Menu {...others}>
    <Menu.Target {...target_props}>
      <ToolbarButton {...button_props}>
        { label }
      </ToolbarButton>
    </Menu.Target>

    <Menu.Dropdown {...dropdown_props}>
      { children }
    </Menu.Dropdown>
  </Menu>
}



// Popover
export type ToolbarPopoverProps = PopoverProps & {
  label: ReactNode
  target_props?: PopoverTargetProps
  button_props?: ButtonProps
  dropdown_props?: Omit<PopoverDropdownProps, "children">
  children?: PopoverDropdownProps["children"]
}


export const ToolbarPopover = ({ label, children, target_props, button_props, dropdown_props, ...others }: ToolbarPopoverProps) => {
  button_props = _.defaults(button_props, {
    variant: BUTTON_VARIANT,
    rightSection: <IconChevronDown size="1rem"/>,
    styles: {
      "section": {"marginLeft": 0},
    }
  })

  return <Popover {...others}>
    <Popover.Target {...target_props}>
      <ToolbarButton {...button_props}>
        { label }
      </ToolbarButton>
    </Popover.Target>

    <Popover.Dropdown {...dropdown_props}>
      { children }
    </Popover.Dropdown>
  </Popover>
}



// Text
export type ToolbarTextProps = TextProps & {
  children: ReactNode
}

const _ToolbarText = forwardRef<HTMLSpanElement, ToolbarTextProps>(({ children, ...others }, ref) => {
  others = _.defaults(others, {
    color: "gray",
    size: "md",
    fw: 700
  })

  return <Text component="span" {...others} ref={ref}>
    { children }
  </Text>
})

_ToolbarText.displayName = '_ToolbarText';

export const ToolbarText = createPolymorphicComponent<'span', ToolbarActionIconProps>(_ToolbarText);


// Divider
export type ToolbarDividerProps = DividerProps


export const ToolbarDivider = ({...props}: ToolbarDividerProps) => {
  props = _.defaults(props, {
    orientation: "vertical",
    variant: "dotted",
    size: "sm",
    mx: 2,
    my: 4,
  })
  return <Divider {...props}/>
}



Toolbar.ActionIcon = ToolbarActionIcon
Toolbar.Button = ToolbarButton
Toolbar.ButtonGroup = Button.Group
Toolbar.Menu = ToolbarMenu
Toolbar.Popover = ToolbarPopover
Toolbar.Text = ToolbarText
Toolbar.Divider = ToolbarDivider


export type ToolbarItem = typeof ToolbarActionIcon | typeof ToolbarButton | typeof Button.Group 
  | typeof ToolbarMenu | typeof ToolbarPopover | typeof ToolbarText | typeof ToolbarDivider
