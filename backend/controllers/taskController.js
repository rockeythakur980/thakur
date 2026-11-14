import Task from "../models/Task.js";

//GET ALL TASKS

export const getTasks = async (req, res) => {
    try{
        const {search, status, priority, sort="newest"} = req.query;

        const filter = {user: req.user._id};
        if (status && status !== "All"){
            filter.status = status;
        }

        if(priority && priority !== "All"){
            filter.priority = priority;
        }

        if(search){
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        let query = Task.find(filter);
        if(sort === "oldest"){
            query = query.sort({ createdAt: 1});
        } else if ( sort === "dueDate") {
            query = query.sort({ dueDate: 1});
        } else {
            query = query.sort({ createdAt: -1});
        }

        const tasks = await query;
        res.json(tasks);
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

//CREATE TASK

export const createTask = async (req, res) =>{
    try{
        const {title, description,  priority, dueDate} = req.body;
        if(!title || !title.trim()){
            return res.status(400).json({
                message:"Task title is required."
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description,
            priority,
            dueDate: dueDate || null,
            user:req.user._id
        });

        res.status(201).json(task);
    } catch (error){
        res.status(400).json({
            message: error.message
        });
    }
};

//UPDATE TASK

export const updateTask = async (req, res) => {
    try{
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if(!task){
            return res.status(404).json({
                message:"Task not found."
            });
        }

        const allowedFields = [
            "title",
            "description",
            "priority",
            "status",
            "dueDate",
        ];

        for(const field of allowedFields){
            if(req.body[field] !== undefined){
                task[field] = req.body[field];
            }
        }

        await task.save();

        res.json(task);
    } catch(error){
        res.status(400).json({
            message:error.message
        });
    }
};

//DELETE TASK

export const deleteTask = async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user:req.user._id
        });

        if (!task){
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json({
            message:"Task deleted successfully."
        });
    } catch (error){
        res.status(500).json({
            message:error.message
        });
    }
};