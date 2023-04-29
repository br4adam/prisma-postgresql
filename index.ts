import * as dotenv from "dotenv"
dotenv.config()
import express, { Express, Request, Response } from "express"
import { PrismaClient } from '@prisma/client'

const port = process.env.PORT
const app: Express = express()
const prisma = new PrismaClient()

app.use(express.json())

app.get("/users", async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany({include: { collection: true }})
    res.json(allUsers)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

app.post("/users", async (req: Request, res: Response) => {
  try {
    const data = req.body
    const newUser = await prisma.user.create({ data })
    res.status(201).json(newUser)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, email } = req.body
    const updatedUser = await prisma.user.update({ 
      where: { id },
      data: { name, email }
     })
    res.json(updatedUser)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deletedUser = await prisma.user.delete({ where: { id }})
    res.json(deletedUser)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

app.listen(port, () => console.log(`Listening on port ${port}.`))