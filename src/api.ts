import { createClient } from '@supabase/supabase-js';
import type { Task, TaskInput, Member, Label, Comment, Activity } from './domain';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configured = Boolean(url && key && !url.includes('YOUR_PROJECT') && !key.includes('YOUR_PUBLIC'));
let configError = '';
function setup() { if (!configured) return null; try { const parsed = new URL(url); if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Supabase URL must use HTTPS.'); if (key.startsWith('sb_secret_')) throw new Error('Use a public anon/publishable key, never a secret key.'); return createClient(url, key); } catch (e) { configError = e instanceof Error ? e.message : 'Invalid Supabase configuration.'; return null; } }
export const db = setup();
function client() { if (!db) throw new Error(configError || 'Add your Supabase URL and public anon key to .env, then restart the development server.'); return db; }
export async function guest() { const c = client(); const { data, error } = await c.auth.getSession(); if (error) throw error; if (data.session) return data.session.user.id; const result = await c.auth.signInAnonymously(); if (result.error) throw result.error; return result.data.user!.id; }
async function rows<T>(table: string) { const { data, error } = await client().from(table).select('*').order('created_at', { ascending: true }); if (error) throw error; return data as T[]; }
export async function loadBoard() { const [tasks, members, labels] = await Promise.all([rows<Task>('tasks'), rows<Member>('team_members'), rows<Label>('labels')]); return { tasks, members, labels }; }
export async function saveTask(input: TaskInput, user_id: string, id?: string, version?: string) {
    const q = id ? client().from('tasks').update(input).eq('id', id).eq('updated_at', version!) : client().from('tasks').insert({ ...input, user_id });
    const { data, error } = await q.select().single(); if (error) { if (error.code === 'PGRST116') throw new Error('This task changed in another tab or was deleted. Refresh the board and reopen it before saving.'); throw error; } return data as Task;
}
export async function moveTask(task: Task, status: Task['status']) { const { data, error } = await client().from('tasks').update({ status }).eq('id', task.id).eq('updated_at', task.updated_at).select().single(); if (error) { if (error.code === 'PGRST116') throw new Error('This task changed in another tab. Refresh the board and try again.'); throw error; } return data as Task; }
export async function removeTask(id: string) { const { data, error } = await client().from('tasks').delete().eq('id', id).select('id'); if (error) throw error; if (!data.length) throw new Error('Task already deleted or no longer accessible. Refresh the board.'); }
export async function addEntity(table: 'team_members' | 'labels', name: string, color: string, user_id: string) { const { data, error } = await client().from(table).insert({ name, color, user_id }).select().single(); if (error) throw error; return data as Member & Label; }
export async function details(task_id: string) { const results = await Promise.all([client().from('comments').select('*').eq('task_id', task_id).order('created_at'), client().from('task_activity').select('*').eq('task_id', task_id).order('created_at')]); for (const r of results) if (r.error) throw r.error; return { comments: results[0].data as Comment[], activity: results[1].data as Activity[] }; }
export async function addComment(task_id: string, body: string, user_id: string) { const { data, error } = await client().from('comments').insert({ task_id, body, user_id }).select().single(); if (error) throw error; return data as Comment; }
