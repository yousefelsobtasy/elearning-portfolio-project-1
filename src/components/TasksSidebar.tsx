import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, X, Clock, Calendar, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const TasksSidebar = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        status: "todo"
    });

    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [user]);

    const fetchTasks = async () => {
        if (!user) return;
        setIsLoading(true);

        const { data } = await supabase
            .from('tasks')
            .select('*')
            .eq('profile_id', user.id)
            .order('created_at', { ascending: false });

        if (data) setTasks(data);
        setIsLoading(false);
    };

    const formatDateTimeForPostgres = (datetimeLocalString) => {
        if (!datetimeLocalString) return null;
        return new Date(datetimeLocalString).toISOString();
    };

    const addTask = async () => {
        if (!user || !newTask.title.trim()) return;
        setIsLoading(true);

        const taskData = {
            profile_id: user.id,
            title: newTask.title,
            description: newTask.description,
            start_time: formatDateTimeForPostgres(newTask.start_time),
            end_time: formatDateTimeForPostgres(newTask.end_time),
            status: newTask.status
        };

        const { data, error } = await supabase
            .from('tasks')
            .insert(taskData)
            .select()
            .single();

        if (error) {
            console.error('Error adding task:', error);
            setIsLoading(false);
            return;
        }

        if (data) {
            setTasks([data, ...tasks]);
            setNewTask({
                title: "",
                description: "",
                start_time: "",
                end_time: "",
                status: "todo"
            });
            setShowAddForm(false);
        }
        setIsLoading(false);
    };

    const updateTaskStatus = async (taskId, status) => {
        const { data } = await supabase
            .from('tasks')
            .update({ status })
            .eq('id', taskId)
            .select()
            .single();

        if (data) {
            setTasks(tasks.map(task => task.id === taskId ? data : task));
        }
    };

    const deleteTask = async (taskId) => {
        await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);

        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setNewTask({
            title: "",
            description: "",
            start_time: "",
            end_time: "",
            status: "todo"
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            todo: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
            working_on: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
            done: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
        };
        return colors[status];
    };

    const isOverdue = (endTime, status) => {
        if (status === 'done') return false;
        if (!endTime) return false;
        return new Date(endTime) < new Date() && new Date(endTime).toDateString() !== new Date().toDateString();
    };

    const isDueToday = (endTime, status) => {
        if (status === 'done') return false;
        if (!endTime) return false;
        return new Date(endTime).toDateString() === new Date().toDateString();
    };

    const formatDateDisplay = (dateString) => {
        if (!dateString) return 'No date';

        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            ...(date.getFullYear() !== today.getFullYear() && { year: 'numeric' })
        });
    };

    if (!tasks) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground mb-2">Loading tasks...</p>
                <p className="text-sm text-muted-foreground">Please wait while we load your tasks</p>
            </div>
        );
    }

    return (
        <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-border/50 shadow-soft flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-lg text-foreground">My Tasks</h3>
                    <p className="text-sm text-muted-foreground">Manage your personal tasks</p>
                </div>
                <Button
                    variant={showAddForm ? "secondary" : "default"}
                    size="icon"
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="h-9 w-9 rounded-full transition-all duration-200 hover:scale-105"
                    disabled={isLoading}
                >
                    {showAddForm ? (
                        <X className="h-4 w-4" />
                    ) : (
                        <Plus className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Add Task Form */}
            {showAddForm && (
                <Card className="p-4 mb-6 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 animate-in fade-in-50 duration-300">
                    <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Task
                    </h4>
                    <div className="space-y-3">
                        <Input
                            placeholder="Task title *"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            className="bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        <Textarea
                            placeholder="Description (optional)"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            className="bg-white dark:bg-slate-800 resize-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />

                        {/* Time Fields - Stacked Vertically */}
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Start Time</label>
                                <Input
                                    type="datetime-local"
                                    value={newTask.start_time}
                                    onChange={(e) => setNewTask({ ...newTask, start_time: e.target.value })}
                                    className="bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Due Date</label>
                                <Input
                                    type="datetime-local"
                                    value={newTask.end_time}
                                    onChange={(e) => setNewTask({ ...newTask, end_time: e.target.value })}
                                    className="bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Status</label>
                            <Select
                                value={newTask.status}
                                onValueChange={(value) =>
                                    setNewTask({ ...newTask, status: value })
                                }
                            >
                                <SelectTrigger className="bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="working_on">In Progress</SelectItem>
                                    <SelectItem value="done">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                onClick={addTask}
                                className="flex-1 transition-all duration-200"
                                disabled={!newTask.title.trim() || isLoading}
                            >
                                {isLoading ? "Adding..." : "Add Task"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCancelAdd}
                                className="flex-1 transition-all duration-200"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Tasks List */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                {isLoading && !showAddForm ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {tasks.map((task) => (
                            <Card
                                key={task.id}
                                className={cn(
                                    "p-4 border-l-4 transition-all duration-200 hover:shadow-md group cursor-pointer",
                                    task.status === 'done'
                                        ? "border-l-green-400 bg-green-50/50 dark:bg-green-950/20 hover:bg-green-100/50 dark:hover:bg-green-950/30"
                                        : task.status === 'working_on'
                                            ? "border-l-blue-400 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/50 dark:hover:bg-blue-950/30"
                                            : isOverdue(task.end_time, task.status)
                                                ? "border-l-red-400 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100/50 dark:hover:bg-red-950/30"
                                                : isDueToday(task.end_time, task.status)
                                                    ? "border-l-orange-400 bg-orange-50/50 dark:bg-orange-950/20 hover:bg-orange-100/50 dark:hover:bg-orange-950/30"
                                                    : "border-l-yellow-400 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/70"
                                )}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-sm text-foreground pr-2 flex-1">
                                        {task.title}
                                    </h4>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteTask(task.id);
                                        }}
                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>

                                {task.description && (
                                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                                        {task.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{formatDateDisplay(task.start_time)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {isOverdue(task.end_time, task.status) && (
                                            <AlertTriangle className="h-3 w-3 text-red-500" />
                                        )}
                                        <Calendar className="h-3 w-3" />
                                        <span className={cn(
                                            isOverdue(task.end_time, task.status) && "text-red-500 font-medium",
                                            isDueToday(task.end_time, task.status) && "text-orange-500 font-medium"
                                        )}>
                                            {formatDateDisplay(task.end_time)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Select
                                        value={task.status}
                                        onValueChange={(value) =>
                                            updateTaskStatus(task.id, value)
                                        }
                                    >
                                        <SelectTrigger className={cn(
                                            "h-7 text-xs p-2 border-0 shadow-none bg-transparent hover:bg-accent/50",
                                            getStatusColor(task.status)
                                        )}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todo">To Do</SelectItem>
                                            <SelectItem value="working_on">In Progress</SelectItem>
                                            <SelectItem value="done">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {isOverdue(task.end_time, task.status) && (
                                        <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300">
                                            Overdue
                                        </Badge>
                                    )}
                                    {isDueToday(task.end_time, task.status) && task.status !== 'done' && (
                                        <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300">
                                            Due Today
                                        </Badge>
                                    )}
                                </div>
                            </Card>
                        ))}

                        {tasks.length === 0 && !showAddForm && (
                            <div className="text-center py-8">
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                    <Plus className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">No tasks yet</p>
                                <p className="text-xs text-muted-foreground">Click the + button to add your first task</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Tasks Summary */}
            {tasks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Total: {tasks.length}</span>
                        <span>In Progress: {tasks.filter(t => t.status === 'working_on').length}</span>
                        <span>Done: {tasks.filter(t => t.status === 'done').length}</span>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default TasksSidebar;