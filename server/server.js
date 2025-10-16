import express from 'express';
import cors from 'cors'
import 'dotenv/config' 
import { clerkMiddleware, requireAuth } from '@clerk/express'

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

app.get('/', (req, res) => {
    res.send("Hey, Server is live!! 🎉")
})

app.use(requireAuth())

const PORT = process.env.PORT || 3000

app.listen(PORT, (req, res) => {
    console.log(`Server is running on http://localhost:${PORT}`)
})