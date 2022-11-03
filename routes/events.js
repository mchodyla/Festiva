const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *          - title
 *          - date
 *          - description
 *       properties:
 *         id:
 *           type: string
 *           description: Autogenerowane ID wydarzenia
 *         title:
 *           type: string
 *           description: Tytuł wydarzenia
 *         date:
 *           type: string
 *           description: Data wydarzenia
 *         description:
 *           type: string
 *           description: Opis wydarzenia
 *       example:
 *         id: 0kFaJHB2
 *         title: Wydarzenie_2
 *         date: 02-02-2023
 *         description: Opis wydarzenia 2
 */          

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API do zarządzania wydarzeniami
 */


/**
 * @swagger
 * /events:
 *   get:
 *     summary: Zwraca listę wszystkich wydarzeń
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Lista wydarzeń
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */

router.get("/", (req, res) => {
  const events = req.app.db.get("events");

  res.send(events);
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Zwraca wydarzenie po id
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The event id
 *     responses:
 *       200:
 *         description: The book description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *          description: The event was not found
 */

router.get("/:id", (req, res) => {
  const event = req.app.db.get("events").find({ id: req.params.id }).value();

    if(!event){
        res.sendStatus(404);
    }

  res.send(event);
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: The event was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       500:
 *         description: Some server error
 */

router.post("/", (req, res) => {
  try {
    const event = {
      id: nanoid(idLength),
      ...req.body,
    };
    req.app.db.get("events").push(event).write();
    res.send(event);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update the event by the id
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: 
 *           type: string
 *         required: true
 *         description: The event id
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: The event was updated
 *         content:
 *           application/json:
 *             schema:  
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: The event was not found
 *       500:
 *         description: Some server error
 */

router.put("/:id", (req, res)=> {
    try {
        req.app.db.get("events").find({id: req.params.id}).assign(req.body).write();

        res.send(req.app.db.get("events").find({id: req.params.id}));
    } catch(error) {
        return res.status(500).send(error)
    }
})

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Remove the event by id
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:  
 *           type: string
 *         required: true
 *         description: The book id
 * 
 *     responses: 
 *       200:
 *         description: The event was deleted
 *       404:
 *         description: The event was not found
 *          
 */


router.delete("/:id", (req,res) => {
    req.app.db.get("events").remove({id: req.params.id}).write();

    res.sendStatus(200);
})

module.exports = router;