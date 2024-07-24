import _, { create } from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import { ActivityCEvent, event_get_payload, EventInfo, TasksCEvent, type State } from "./types"
import { alpha, TextInputProps } from "@mantine/core"
import { DateTimePickerProps } from "@mantine/dates"
import { RichTextProps } from "../rich_text"
// import { EventFindManyArgs } from "@/server_actions/events/actions"
import { prisma } from "@/db"
import { CUDEventsArgs } from "@/server_actions/events/actions"
import { BigCalendarProps } from "../big_calendar/types"


export type EventFindManyArgs = Parameters<typeof prisma.event.findMany<typeof event_get_payload>>[0]


export const useSelectors = ()=> {
  return useMemo(() => {
    
    const sel_events_query_args = (state: State): EventFindManyArgs => ({
      where: { id: state.props.event_id },
      ...event_get_payload
    })

    const sel_events_query = (state: State) => state.injected.events_query

    const sel_event_from_query = createSelector(
      sel_events_query,
      // TODO: Make useFindManyEvents generic to get rid of this cast
      (query): EventInfo | null => (query?.data?.[0] as EventInfo) ?? null  
    )

    const sel_unedited_event = sel_event_from_query

    const sel_is_editing = (state: State) => !!state.memory.edit
    const sel_edit = (state: State) => state.memory.edit

    const sel_activities = createSelector(
      sel_unedited_event,
      sel_edit,
      (unedited_event, edit): EventInfo['activities'] => {
        if (!unedited_event) return []
        if (!edit) return unedited_event.activities

        return unedited_event.activities
          .map(activity => {
            const updated_activity = edit.activities.updated.find(a => a.id === activity.id)
            if (updated_activity) return updated_activity
            return activity
          })
          .filter(activity => !edit.activities.deleted.includes(activity.id))
          .concat(edit.activities.new)
    })

    const sel_tasks = createSelector(
      sel_unedited_event,
      sel_edit,
      (unedited_event, edit): EventInfo['tasks'] => {
        if (!unedited_event) return []
        if (!edit) return unedited_event.tasks

        return unedited_event.tasks
          .map(task => {
            const updated_task = edit.tasks.updated.find(a => a.id === task.id)
            if (updated_task) return updated_task
            return task
          })
          .filter(task => !edit.tasks.deleted.includes(task.id))
          .concat(edit.tasks.new)
    })

    const sel_event = createSelector(
      sel_unedited_event,
      sel_edit,
      sel_activities,
      sel_tasks,
      (unedited_event, edit, activities, tasks): EventInfo | null => {
        if (!unedited_event) return null        
        if (!edit) return unedited_event
       
        return {
          ...edit.event,
          activities,
          tasks
        }
      }
    )
    
    const sel_name_input_props = createSelector(
      sel_event,
      sel_is_editing,
      (event, is_editing): TextInputProps => ({
        value: event?.name ?? "",
        disabled: !is_editing
      })
    )

    const sel_description_input_props = createSelector(
      sel_event,
      sel_is_editing,
      (event, is_editing): TextInputProps => ({
        value: event?.description ?? "",
        disabled: !is_editing
      })
    )

    const sel_start_date_time_picker_props = createSelector(
      sel_event,
      sel_is_editing,
      (event, is_editing): DateTimePickerProps => ({
        value: event?.start_datetime ?? null,
        disabled: !is_editing
      })
    )

    const sel_end_date_time_picker_props = createSelector(
      sel_event,
      sel_is_editing,
      (event, is_editing): DateTimePickerProps => ({
        value: event?.end_datetime ?? null,
        disabled: !is_editing
      })
    )

    const sel_notes_props = createSelector(
      sel_event,
      sel_is_editing,
      (event, is_editing): RichTextProps => ({
        value: event?.notes ?? "",
        editor_enabled: is_editing
      })
    )

    const sel_update_events_args = createSelector(
      sel_unedited_event,
      sel_edit,
      (unedited_event, edit): CUDEventsArgs | null => {
        if (!edit) return null
        if (_.isEqual(unedited_event, edit.event)) return null

        return {
          update: [ 
            {
              where: { id: edit.event.id },
              data: _.pick(edit.event, "name", "description", "start_datetime", "end_datetime", "notes")
            }
          ]
        }
      }
    )

    const sel_has_edit_permission = (state: State) => state.injected.has_edit_permission ?? false


    const sel_activity_calender_props = createSelector(
      sel_event,
      sel_is_editing,
      (event, is_editing): BigCalendarProps<ActivityCEvent>['calendar_props'] => {
        const calendar_events = event?.activities.map(activity => ({
          id: activity.id,
          title: activity.name,
          start: activity.start_datetime,
          end: activity.end_datetime,
          resource: activity,
          alpha: 0.9,
        })) ?? []

        return {
          events: calendar_events,
          selectable: is_editing,
          resizable: is_editing,
          backgroundEvents: [
            {
              title: event?.name,
              start: event?.start_datetime,
              end: event?.end_datetime,
              color: "red",
              resource: {}
            }          
          ],          
        }
    })


    const sel_tasks_calender_props = createSelector(
      sel_event,
      sel_is_editing,
      (event, is_editing): BigCalendarProps<TasksCEvent>['calendar_props'] => {
        const calendar_events = event?.tasks.map(task => ({
          id: task.id,
          title: task.name,
          start: task.start_datetime,
          end: task.end_datetime,
          resource: task,
          alpha: 0.9,
        })) ?? []

        return {
          events: calendar_events,
          selectable: is_editing,
          resizable: is_editing,
          backgroundEvents: [
            {
              title: event?.name,
              start: event?.start_datetime,
              end: event?.end_datetime,
              color: "red",
              resource: {}
            }          
          ],          
        }
    })


    return {
      sel_name_input_props,
      sel_description_input_props,
      sel_start_date_time_picker_props,
      sel_end_date_time_picker_props,
      sel_notes_props,
      sel_events_query_args,
      sel_event,
      sel_update_events_args,
      sel_is_editing,
      sel_has_edit_permission,
      sel_activity_calender_props,
      sel_activities,
      sel_tasks,
      sel_tasks_calender_props,
    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors = ReturnType<typeof useSelectors>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes = GetSelectorsReturnTypes<Selectors>
export type SelectedValues = { [K in (keyof Selectors extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors[`sel_${K}`]> }

