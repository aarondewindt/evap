import _, { update } from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import type { CalendarEvent, State, VolunteerInfo } from "./types"
import { UseFindVolunteersOptions } from "@/server_actions/volunteers/hooks"
import { CUDVolunteersArgs } from "@/server_actions/volunteers/actions"





export const useSelectors = ()=> {
  return useMemo(() => {
    
    const sel_volunteer_id = (state: State) => state.props.volunteer_id
    const sel_has_edit_permission = (state: State) => true

    const sel_get_volunteers_query_params = createSelector(
      sel_volunteer_id,
      (volunteer_id): UseFindVolunteersOptions => ({
        find_many: {
          where: { id: volunteer_id },
          include: { availability_slots: true }        
        }
      })
    )

    const sel_volunteer_query = createSelector(
      (state: State) => state.injected.volunteers_query,
      (query): VolunteerInfo | null => query?.data?.[0] as VolunteerInfo || null
    )

    const sel_volunteer_optimistic = (state: State) => state.memory.optimistic

    const sel_unedited_volunteer = createSelector(
      sel_volunteer_query,
      sel_volunteer_optimistic,
      (from_query, optimistic): VolunteerInfo | null => {
        if (!optimistic?.updated_at) return from_query
        if (!from_query?.updated_at) return null
        console.log("sel_unedited_volunteer", {
          optimistic_chosen: optimistic.updated_at >= from_query.updated_at,
          optimistic_updated_at: optimistic.updated_at,
          from_query_updated_at: from_query.updated_at
        })
        if (optimistic.updated_at >= from_query.updated_at) 
          return optimistic
        else 
          return from_query
      }
    )

    const sel_edit = (state: State) => state.memory.edit
    const sel_volunteer_edit = (state: State) => state.memory.edit?.volunteer

    const sel_is_editing = createSelector(
      sel_volunteer_edit,
      (volunteer_edit) => !!volunteer_edit
    )

    const sel_volunteer = createSelector(
      sel_volunteer_edit,
      sel_unedited_volunteer,
      (volunteer_edit, unedited_volunteer) => volunteer_edit || unedited_volunteer
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
      sel_unedited_volunteer,
      (edit, volunteer_query) => {
        if (!volunteer_query?.availability_slots) return []
        if (!edit) return volunteer_query.availability_slots

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
          resource: slot,
          color: "green"
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
      sel_unedited_volunteer,
      sel_edit,
      (volunteer_query, edit): CUDVolunteersArgs | null => {
        if (!volunteer_query) return null
        if (!edit) return null
        return {
          update: [{
            where: { id: volunteer_query.id },
            data: {
              // ..._.omit(edit.volunteer, "availability_slots", "user_id", "created_at", "updated_at"),
              ..._.pick(edit.volunteer, "name", "notes"),
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
          }],
        }
      }
    )

    const sel_volunteer_with_edits = createSelector(
      sel_unedited_volunteer,
      sel_edit,
      sel_availability_slots,
      (unedited_volunteer, edit, availability_slots): VolunteerInfo | null => {
        if (!unedited_volunteer) return null
        if (!edit) return null
        return {
          ...unedited_volunteer,
          ..._.pick(edit.volunteer, "name", "notes"),
          availability_slots: availability_slots
        }
      }
    )

    const sel_notes = createSelector(
      sel_volunteer,
      (volunteer) => volunteer?.notes || ""
    )

    const sel_volunteer_name = createSelector(
      sel_volunteer,
      (volunteer) => volunteer?.name || ""
    )

    const sel_help_msg_shown_before = (state: State) => state.injected.help_msg_shown_before

    const sel_global_volunteer_settings = (state: State) => state.injected.global_volunteer_settings
    
    const sel_edit_deadline = createSelector(
      sel_global_volunteer_settings,
      (settings) => settings?.data?.edit_deadline ?? null
    )

    const sel_has_deadline_passed = createSelector(
      sel_edit_deadline,
      (deadline) => deadline ? new Date() > deadline : false
    )

    const sel_have_calendar_settings_been_set = (state: State) => state.memory.calendar_settings_set

    const sel_is_fetching = createSelector(
      (state: State) => state.injected.volunteers_query,
      (state: State) => state.injected.global_volunteer_settings,
      (state: State) => state.injected.cud_volunteers_mutation,
      (q1, q2, m1) => {
        return q1?.isFetching || q2?.isFetching || m1?.isPending || false
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
      sel_on_save_args,
      sel_notes,
      sel_volunteer_name,
      sel_help_msg_shown_before,
      sel_edit_deadline,
      sel_has_deadline_passed,
      sel_global_volunteer_settings,
      sel_have_calendar_settings_been_set,
      sel_is_fetching,
      sel_volunteer_with_edits,
    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors = ReturnType<typeof useSelectors>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes = GetSelectorsReturnTypes<Selectors>
export type SelectedValues = { [K in (keyof Selectors extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors[`sel_${K}`]> }

