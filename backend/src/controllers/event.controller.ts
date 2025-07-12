import { Request, Response } from 'express';
import { Event } from '@models/Event';

export const createEvent = async (req: Request, res: Response) => {
  const event = await Event.create({
    ...req.body,
    organizer: req.user.id,
    participants: [req.user.id]
  });
  res.status(201).json(event);
};

export const joinEvent = async (req: Request, res: Response) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { participants: req.user.id } },
    { new: true }
  );
  res.json(event);
};

export const getCampusEvents = async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id);
  const events = await Event.find({ 
    campus: user.campus,
    date: { $gte: new Date() }
  }).sort('date');
  res.json(events);
};