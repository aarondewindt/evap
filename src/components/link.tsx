import React, { PropsWithChildren } from 'react';
import { forwardRef } from 'react';
import { Anchor, AnchorProps } from "@mantine/core";
import NextLink from 'next/link'; 

export interface LinkProps extends AnchorProps {
  href?: string;
}


export const Link = forwardRef<HTMLAnchorElement, PropsWithChildren<LinkProps>>(({ href, ...props }: PropsWithChildren<LinkProps>, ref) => {
  return <Anchor ref={ref} component={NextLink} href={href ?? "#"} {...props} />
})

Link.displayName = "Link"
