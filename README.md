# Smart Environment Monitor

This project is a **Smart Environment Monitoring System** that measures **temperature**, **humidity**, and **loudness** in a room using a hardware sensor board. It provides both **visual** and **digital feedback**, combining a **C# backend** with a **React + Vite + TailwindCSS frontend**.

---

## 🚀 Features

- **Real-time Monitoring**
  - Measures **temperature**, **humidity**, and **sound levels (loudness)**.
- **Visual Alerts**
  - **LED lights** on the board turn on when the noise level is too high.
- **On-board Display**
  - Shows current **temperature**, **humidity**, and **loudness status**.
- **Web Dashboard**
  - Built with **React + Vite + TailwindCSS**.
  - Displays live data from the sensors in a clean and responsive UI.
- **Backend**
  - **C# server** handles data collection, processing, and storage.
  - Exposes API endpoints for the frontend to fetch real-time readings.

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, Vite, TailwindCSS |
| **Backend** | C# (.NET) |
| **Hardware** | Sensor board with temperature, humidity, and loudness sensors |
| **Display & Alerts** | On-board display + LED indicators |

---

## ⚙️ How It Works

1. The sensor board measures temperature, humidity, and loudness.
2. The data is sent to the C# backend via serial or network communication.
3. The backend stores and serves this data through an API.
4. The React frontend fetches and displays the readings in real time.
5. When loudness exceeds a threshold:
   - The **LEDs light up** as a visual alert.
   - The display updates to show that it’s **too loud**.

---

## 🧩 Future Improvements

- Add data logging and chart visualization.
- Implement notifications or alerts through the web dashboard.
- Extend to measure additional environmental parameters.

---


## 🧑‍💻 Author

Developed by [Goga Gogeshvili, Alisa Ilkevych, M.Tuğşad Deniz]  
