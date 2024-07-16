// https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams

"use client"

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { build_url_safe } from './build_url'
import JsonURL from "@jsonurl/jsonurl";


export const useURLState = <T extends object>(key: string | null, initial: T): [T, (value: T) => void] => {
  const [state, set_state] = useState<T | null>(null)
  const router = useRouter()
  const path_name = usePathname()
  const search_params = useSearchParams()

  const set_url_and_state = useCallback((value: T) => {
    if (path_name && search_params && key) {
      const new_params = new URLSearchParams(search_params)
      const raw_values = JsonURL.stringify(value, { AQF: true })
      if (raw_values != null) {
        new_params.set(key, raw_values)
        const url = build_url_safe(path_name, new_params)
        // window.history.pushState(null, document.title, url);
        router.replace(url)
        set_state(value)
      }
    }
  }, [ path_name, key, search_params ])
  
  useEffect(() => {
    if (key == null) {
      set_state(null)
      return
    }

    if (state != null) return
    if (search_params == null) return

    const raw_value = search_params.get(key)
    if (raw_value != null) {
      try {
        const value = JsonURL.parse(raw_value, { AQF: true })
        set_state(value)
        return
      } catch { }
    }

    set_url_and_state(initial)

  }, [state, search_params, initial, set_url_and_state, key])

  return [state ?? initial, set_url_and_state]
}
