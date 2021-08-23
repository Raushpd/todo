import React, { useState } from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css'
import dateFnsFormat from "date-fns/format";
import setDate from 'date-fns/setDate';
import isAfter from "date-fns/isAfter";
import isBefore from 'date-fns/isBefore';
import addDays from 'date-fns/addDays';
import isToday from 'date-fns/isToday';
import { FaThinkPeaks } from 'react-icons/fa';


const FORMAT = "dd/MM/yyyy";
function formatDate(date, format, locale) {
    return dateFnsFormat(date, format, { locale });
}

const AddTask = ({ onCancel, onAddTask }) => {
    const [task, setTask] = useState('');
    const [date, setDate] = useState(null)
    return (
        <div className="add-task-dialog">
            <input value={task} onChange={(event) => setTask(event.target.value)} />

            <div className="add-task-actions">
                <div className="btns-containers">
                    <button disabled={!task} className="add-btn" onClick={() => {
                        onAddTask(task, date);
                        onCancel();
                        setTask("");
                    }}>Add Task</button>
                    <button className="cancel-btn" onClick={() => {
                        onCancel();
                        setTask("");
                    }}>Cancel</button>
                </div>
                <div className="icon-containers">
                    <DayPickerInput onDayChange={(day) => setDate(day)} placeholder={`${dateFnsFormat(new Date(), FORMAT)}`}
                        formatDate={formatDate}
                        format={FORMAT}
                        dayPickerProps={{
                            modifiers: {
                                disabled: [{ before: new Date() }],
                            },
                        }}
                    />
                </div>
            </div>

        </div>

    );
};

const TASK_HEADER_MAPPING = {
    INBOX: "Inbox",
    TODAY: "Today",
    NEXT_7: "Next 7 Days",
}

const TaskItems = ({ selectedTab, tasks }) => {
    let taskToRender = [...tasks];
    if (selectedTab === "NEXT_7") {
        taskToRender = taskToRender.filter((task) => isAfter(task.date, new Date()) && isBefore(task.date, addDays(new Date(), 7)));
    }

    if (selectedTab === "TODAY") {
        taskToRender = taskToRender.filter((task) => isToday(task.date));
    }




    return (
        <div className="task-item-container">
            {
                taskToRender.map((task) => (
                    <div className="task-item">
                        <p>{task.text}</p>
                        <p>{dateFnsFormat(new Date(task.date), FORMAT)}</p>


                    </div>




                ))
            }
        </div>
    );


};




const Tasks = ({ selectedTab }) => {
    const [showAddTask, setShowAddTask] = useState(false)
    const [tasks, setTasks] = useState([]);

    const addNewTask = (text, date) => {
        const newTaskItem = { text, date: date || new Date() };

        setTasks((prevState) => [...prevState, newTaskItem]);
    };

    return (
        <div className="tasks">
            <h1>{TASK_HEADER_MAPPING[selectedTab]}</h1>
            {selectedTab === "INBOX" ? (<div className="add-task-btn" onClick={() =>
                setShowAddTask((prevState) => !prevState)
            }>
                <span className="plus">+</span>
                <span className="add-task">Add Task</span>
            </div>) : null}
            {showAddTask && <AddTask onAddTask={addNewTask} onCancel={() => setShowAddTask(false)} />}
            {tasks.length > 0 ? <TaskItems tasks={tasks} selectedTab={selectedTab} /> : <p>No Tasks yet</p>}
        </div>
    );
};

export default Tasks;


