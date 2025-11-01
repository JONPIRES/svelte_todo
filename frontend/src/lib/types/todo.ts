/**
 * Priority levels for todos
 */
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
	id: string;
	text: string;
	completed: boolean;
	createdAt: Date;
	/** Optional fields for future enhancements */
	dueDate?: Date;
	priority?: TodoPriority;
}

export type TodoFilter = 'all' | 'active' | 'completed';
