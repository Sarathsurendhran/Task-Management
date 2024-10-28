import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosConfig";
import toast from "react-hot-toast";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axiosInstance.get("tasks/");
  console.log("Fetched tasks:", response.data);
  return response.data;
});

export const addTask = createAsyncThunk("tasks/addTask", async (task) => {
  const response = await axiosInstance.post("tasks/", task);
  console.log("Added task:", response.data);
  return response.data;
});

export const updateTask = createAsyncThunk("tasks/updateTask", async (task) => {
  const response = await axiosInstance.put(`tasks/${task.id}/`, task);
  console.log("Updated task:", response.data);
  return response.data;
});

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId) => {
    await axiosInstance
      .delete(`tasks/${taskId}/`)
      .then(() => toast.success("Task deleted successfully!"))
      .catch((error) => toast.error("Failed to delete task: " + error));
    console.log("Deleted task:", taskId);
    return taskId;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    taskUpdated(state, action) {
      console.log("taskUpdated reducer called with:", action.payload);
      const { action: wsAction, task } = action.payload.content;

      switch (wsAction) {
        case "create":
          console.log("Creating new task:", task);
          state.items.push(task);
          break;
        case "update":
          console.log("Updating task:", task);
          const index = state.items.findIndex((t) => t.id === task.id);
          if (index !== -1) {
            state.items[index] = task;
          }
          break;
        case "delete":
          console.log("Deleting task:", task.id);
          state.items = state.items.filter((t) => t.id !== task.id);
          break;
        default:
          console.log("Unknown WebSocket action:", wsAction);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { taskUpdated } = tasksSlice.actions;
export default tasksSlice.reducer;
