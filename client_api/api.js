import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import {Configuration, OpenAIApi} from 'openai';

dotenv.config();

const key = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const chatGPT = new OpenAIApi(key)

const server = express();
server.use(cors());
server.use(express.json());

server.get('/', async (req, res) => {
    res.status(200).send({
        message: "Server Test",
    })
});

server.post('/', async (req, res) => {
    try{
        const user_input = req.body.prompt;

        const response = await chatGPT.createCompletion({
            model: "text-davinci-003",
            prompt: `${user_input}`,
            temperature: 0,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            GPT: response.data.choices[0].text
        })
    }catch (error){
        console.log(error);
        res.status(500).send({error});
    }
})

server.listen(5000, () => console.log('Server is Running'));