import {describe,it,expect} from 'vitest';
import {urgency,localDate,filterTasks,type Task} from '../src/domain';
const task:Task={id:'1',user_id:'a',title:'Fix Search',description:'',status:'todo',priority:'high',due_date:null,assignee_ids:['m'],label_ids:['l'],created_at:'',updated_at:''};
describe('calendar urgency',()=>{
 it('uses local calendar dates',()=>expect(localDate(new Date(2026,0,2,23,59))).toBe('2026-01-02'));
 it('marks earlier dates overdue',()=>expect(urgency({...task,due_date:'2026-10-31'},'2026-11-01')).toBe('overdue'));
 it('includes today and two days ahead',()=>{for(const day of ['2026-11-01','2026-11-02','2026-11-03'])expect(urgency({...task,due_date:day},'2026-11-01')).toBe('soon');});
 it('handles year boundaries',()=>expect(urgency({...task,due_date:'2027-01-01'},'2026-12-31')).toBe('soon'));
 it('ignores finished and undated tasks',()=>{expect(urgency({...task,status:'done',due_date:'2020-01-01'},'2026-11-01')).toBe('none');expect(urgency(task)).toBe('none');});
 it('leaves future dates neutral',()=>expect(urgency({...task,due_date:'2026-11-04'},'2026-11-01')).toBe('none'));
});
describe('combined filters',()=>{
 it('trims search and ignores case',()=>expect(filterTasks([task],' FIX ', '', '', '')).toEqual([task]));
 it('requires all filters to match',()=>{expect(filterTasks([task],'search','high','m','l')).toEqual([task]);expect(filterTasks([task],'search','low','m','l')).toEqual([]);expect(filterTasks([task],'','high','other','l')).toEqual([]);expect(filterTasks([task],'','high','m','other')).toEqual([]);});
 it('handles empty boards',()=>expect(filterTasks([],'','','','')).toEqual([]));
});
