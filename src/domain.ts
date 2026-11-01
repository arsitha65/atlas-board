export const columns = [{id:'todo', name:'To Do'}, {id:'in_progress',name:'In Progress'}, {id:'in_review',name:'In Review'}, {id:'done',name:'Done'}] as const;
export type Status = typeof columns[number]['id'];
export type Priority = 'low'|'normal'|'high';
export interface Task { id:string; user_id:string; title:string; description:string; status:Status; priority:Priority; due_date:string|null; assignee_ids:string[]; label_ids:string[]; created_at:string; updated_at:string; }
export interface Member {id:string; user_id:string; name:string; color:string}
export interface Label {id:string; user_id:string; name:string; color:string}
export interface Comment {id:string; task_id:string; user_id:string; body:string; created_at:string}
export interface Activity {id:string; task_id:string; user_id:string; message:string; created_at:string}
export type TaskInput = Pick<Task,'title'|'description'|'status'|'priority'|'due_date'|'assignee_ids'|'label_ids'>;
export function localDate(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function urgency(task:Pick<Task,'due_date'|'status'>, today=localDate()) {
 if(!task.due_date || task.status==='done') return 'none';
 if(task.due_date<today) return 'overdue';
 const end=new Date(`${today}T12:00:00`);end.setDate(end.getDate()+2);
 return task.due_date<=localDate(end)?'soon':'none';
}
export function filterTasks(tasks:Task[], search:string, priority:string, member:string, label:string) {
 const q=search.trim().toLocaleLowerCase();
 return tasks.filter(t=>(!q||t.title.toLocaleLowerCase().includes(q))&&(!priority||t.priority===priority)&&(!member||t.assignee_ids.includes(member))&&(!label||t.label_ids.includes(label)));
}
export function errorText(error:unknown) { return error && typeof error==='object' && 'message' in error ? String(error.message) : 'Something went wrong. Please try again.'; }
