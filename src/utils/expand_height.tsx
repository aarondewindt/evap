import { useViewportSize } from "@mantine/hooks";
import { useMemo, useRef } from "react";

export type ExpandHeightProps = {
  children: React.ReactNode
}


export const ExpandHeight = ({ children }: ExpandHeightProps) => {
  const { height: view_port_height } = useViewportSize(); 
  const ref = useRef<HTMLDivElement>(null);

  const element_height = useMemo(() => {
    const element_offset = ref.current?.offsetTop;
    if (element_offset == null) return 0;
    return view_port_height - element_offset;
  }, [ view_port_height ]);

  return <div ref={ref} style={{ minHeight: element_height, display: "flex", flexDirection: "column" }}>
    {children}
  </div>
}