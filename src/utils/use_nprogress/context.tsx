import { useContext, createContext, useCallback, ReactNode, useState } from 'react'
import { nprogress } from '@mantine/nprogress';


export type Context = {
  start: (id: string)=>void
  complete: (id: string)=>void
}


const NProgressContext = createContext<Context>({} as Context);

export const NProgressProvider = ({ children }: { children: ReactNode }) => {
  const [ state, set_state ] = useState<string[]>([])
  
  const start = useCallback((id: string) => {
    set_state((s) => {
      const ns = [...s, id]
      if (ns.length === 1) {
        nprogress.start()
      }
      return ns
    })
    
    
  }, [ set_state ])

  const complete = useCallback((id: string) => {
    set_state((s) => {
      const ns = s.filter((x) => x !== id)
      if (ns.length === 0) {
        nprogress.complete()
      }
      return ns
    })
  }, [ set_state ])

  const context: Context = {
    start, 
    complete,
  }

  return <NProgressContext.Provider value={context}>
    {children}
  </NProgressContext.Provider>
}

export const useNProgressContext = () => {
  const context = useContext(NProgressContext);

  if (context === undefined) {
    throw new Error("useNProgressContext must be used within NProgressProvider");
  }

  return context;
};


