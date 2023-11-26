import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { MessageContentText } from 'openai/resources/beta/threads/messages/messages';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { Thread } from 'openai/resources/beta/threads/threads';

const openai = new OpenAI();

let thread: Thread | null;

export default async function aceAssistant(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const myAssistant = await openai.beta.assistants.create({
  //   instructions:
  //     'You are a Google Cloud Engineer, and you will be presented with multiple-choice questions pertaining to Google Cloud. Limit yourself to only selecting the right answer.',
  //   name: 'Google Cloud Engineer Expert',
  //   tools: [{ type: 'retrieval' }],
  //   model: 'gpt-4-1106-preview',
  //   file_ids: ["file-Vjt0ii6aFpGalLpxnWQYqoGm'"],
  // });

  // console.log(myAssistant);
  try {
    if (req.body.deleteThread) {
      if (!thread) return
      const response = await openai.beta.threads.del(thread.id);
      console.log(response)
      thread = null
      res.status(200).json({ message: 'thread deleted' })
      return
    }

    if (req.body.retrieveLastMessage) {
      if (!thread) {
        res.status(200).json({ message: 'no messages found' })
        return
      } 
      const threadMessages = await openai.beta.threads.messages.list(
        thread.id,
        {
          limit: 1
        }
      );
    
      console.log(threadMessages.data);
      const lastMessage = (threadMessages.data[0].content[0] as MessageContentText).text.value
      res.status(200).json({ lastMessage })
      return
    }

    const myAssistant = await openai.beta.assistants.retrieve(
      'asst_c8OW9PpTXGoQJQDPrYuWIJ3A'
    );
  
    console.log({myAssistant});
  
    if (!thread) {
      thread = await openai.beta.threads.create();
    }

    console.log({thread})
  
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: req.body.prompt,
    });
  
    console.log({message})
  
    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: myAssistant.id,
    });
    
    while (
      run.status !== 'completed' &&
      !['requires_action', 'cancelling', 'cancelled', 'expired'].includes(
        run.status
      )
    ) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log({run})
    }
  
    const messages = await openai.beta.threads.messages.list(
      thread.id
    );

    const messageContentTextData = messages.data.map(messageData => messageData.content.map(content => (content as MessageContentText).text.value))[0][0]
  
    console.log({messageContentTextData})
    
    res.status(200).json({ result: messageContentTextData })
  } catch (error: any) {
    console.error(error)
    if (error.response) {
      console.error(error.response.status, error.response.data)
      res.status(error.response.status).json(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      })
    }
  }
}

