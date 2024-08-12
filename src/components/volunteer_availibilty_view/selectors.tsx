import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import { CEvent, volunteer_get_payload_includes, VolunteerInfo, type State } from "./types"
import { UseFindVolunteersOptions } from "@/server_actions/volunteers/hooks"
import { stat } from "fs"
import { Volunteer } from "@prisma/client"


export const useSelectors = ()=> {
  return useMemo(() => {
    
    const sel_volunteer_query_params = ({}: State) => ({
      find_many: {
        include: volunteer_get_payload_includes
      }
    })

    const sel_volunteers = (state: State): VolunteerInfo[] => (state.injected?.volunteers_query?.data ?? []) as VolunteerInfo[]
    const sel_is_loading = (state: State) => state.injected?.volunteers_query?.isFetching ?? false 

    const sel_cevents = createSelector(
      sel_volunteers,
      (volunteers): CEvent[] => volunteers.map((volunteer) => 
        volunteer.availability_slots.map((slot) => ({
            id: slot.id,
            title: volunteer.name,
            start: slot.start_datetime,
            end: slot.end_datetime,
            resource: {}
          }))
        ).flat()
      )

    const sel_calender_props = createSelector(
      sel_cevents,
      (events) => {
        return {
          events,
        }
      }
    )

    return {
      sel_volunteer_query_params,
      sel_cevents,
      sel_is_loading,
      sel_calender_props,
    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors = ReturnType<typeof useSelectors>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes = GetSelectorsReturnTypes<Selectors>
export type SelectedValues = { [K in (keyof Selectors extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors[`sel_${K}`]> }

