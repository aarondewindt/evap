import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import type { CalendarEvent, State, VolunteerInfo } from "./types"
import { Prisma } from "@prisma/client"
import { CalendarProps, Event as RbcEvent } from "react-big-calendar"
import dayjs from "@/dates"
import { stat } from "fs"
import { VolunteerUpdateArgs } from "@/server_actions/volunteers/action"





export const useSelectors = ()=> {
  return useMemo(() => {
    
    const sel_volunteer_id = (state: State) => state.props.volunteer_id
    const sel_has_edit_permission = (state: State) => state.other.has_edit_permission

    const sel_get_volunteers_query_params = createSelector(
      sel_volunteer_id,
      (volunteer_id): [string[], { availability_slots: true }] => ([
        [ volunteer_id ], 
        { availability_slots: true}
      ])
    )

    const sel_volunteer_query = createSelector(
      (state: State) => state.other.volunteers_query,
      (query): VolunteerInfo | null => query?.data?.[0] as VolunteerInfo || null
    )

    const sel_edit = (state: State) => state.memory.edit
    const sel_volunteer_edit = (state: State) => state.memory.edit?.volunteer

    const sel_is_editing = createSelector(
      sel_volunteer_edit,
      (volunteer_edit) => !!volunteer_edit
    )

    const sel_volunteer = createSelector(
      sel_volunteer_edit,
      sel_volunteer_query,
      (volunteer_edit, volunteer_query) => volunteer_edit || volunteer_query
    )

    const sel_name_input_props = createSelector(
      sel_is_editing,
      sel_volunteer,
      (is_editing, volunteer) => ({
        value: volunteer?.name || "",
        readOnly: !is_editing
      })
    )

    const sel_availability_slots = createSelector(
      sel_edit,
      sel_volunteer_query,
      (edit, volunteer_query) => {
        if (!volunteer_query) return []
        if (!edit) return volunteer_query.availability_slots

        console.log("deleted slots", edit.deleted_availability_slots)

        return (volunteer_query.availability_slots
          .map((slot) => {
            const updated_slot = edit.updated_availability_slots.find((s) => s.id === slot.id)
            return updated_slot || slot
          }) 
          .filter((slot) => !edit.deleted_availability_slots.includes(slot.id)))
          .concat(edit.new_availability_slots)
      }
    )

    const sel_availability_slots_calendar_events = createSelector(
      sel_availability_slots,
      (availability_slots): CalendarEvent[] => {
        return availability_slots.map((slot) => ({
          title: "Available",
          start: slot.start_datetime,
          end: slot.end_datetime,
          resource: slot
        })) || []
    })

    const sel_calender_props = createSelector(
      (state: State) => state.memory.calendar_date,
      (state: State) => state.memory.calendar_view,
      (state: State) => state.memory.selected_slot_id,
      sel_is_editing,
      sel_availability_slots_calendar_events,
      (date, view, selected_slot_id, is_editing, slots) => {
        const selected = selected_slot_id ? slots.find((slot) => slot.resource.id === selected_slot_id) : null
        return {
          date,
          view,
          events: slots,
          selectable: is_editing,
          selected,
        }
    })

    const sel_on_save_args = createSelector(
      sel_volunteer_query,
      sel_edit,
      (volunteer_query, edit): VolunteerUpdateArgs[] | null => {
        if (!volunteer_query) return null
        if (!edit) return null

        return [{
          where: { id: volunteer_query.id },
          data: {
            ..._.omit(edit.volunteer, "availability_slots"),
            availability_slots: {            
              deleteMany: edit.deleted_availability_slots.map((id) => ({ id })),
              create: edit.new_availability_slots.map(slot => _.omit(slot, "id", "volunteer_id")),
              update: edit.updated_availability_slots
                .map((slot) => ({ 
                  where: { id: slot.id }, 
                  data: _.omit(slot, "volunteer_id")
                }))
            }
          }
        }]
      }
    )


    return {
      sel_volunteer_id,
      sel_has_edit_permission,
      sel_get_volunteers_query_params,
      sel_volunteer,
      sel_name_input_props,
      sel_is_editing,
      sel_availability_slots_calendar_events,
      sel_calender_props,
      sel_on_save_args
    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors = ReturnType<typeof useSelectors>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes = GetSelectorsReturnTypes<Selectors>
export type SelectedValues = { [K in (keyof Selectors extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors[`sel_${K}`]> }

