import express, { Request, Response } from 'express';
import cors from 'cors';

const app: express.Application = express();
const port: number = 3001;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
  return res.send('Hello World');
});

app.post('/submit-form', (req: Request, res: Response) => {
  return res.send({
    status: 'success',
    message: 'Thank you. You are now subscribed.',
  });
});

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
