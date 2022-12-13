import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `Idea:`;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${req.body.userInput}

  ${basePromptPrefix}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${req.body.userInput}

    ${basePromptPrefix} `,
    temperature: 0.7,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();
  console.log(basePromptOutput)

  const marketInfoPrompt = `${req.body.userInput}

  ${basePromptPrefix} 
  
  ${basePromptOutput.text}
  
  Based on above startup idea How will it impacts the respective market: `;
  console.log(marketInfoPrompt)

  const marketInfoCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: marketInfoPrompt,
    temperature: 0.7,
    max_tokens: 250,
  });

  const marketInfoOutput = marketInfoCompletion.data.choices.pop();
  console.log(marketInfoOutput)

  const problemSolvePrompt = `${marketInfoPrompt}
  
  ${marketInfoOutput.text}
  
  Based on above info What problem does this idea exactly solves: `

  const problemSolveCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: problemSolvePrompt,
    temperature: 0.7,
    max_tokens: 250,
  })

  const problemSolveOutput = problemSolveCompletion.data.choices.pop();
  console.log(problemSolveOutput)

  const impactPrompt = `${problemSolvePrompt}

  ${problemSolveOutput.text}
  
  Based on the above data How this impacts common people: `;

  const impactCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: impactPrompt,
    temperature: 0.7,
    max_tokens: 250
  });

  const impactOutput = impactCompletion.data.choices.pop()
  console.log("Impact............", impactOutput);

  const existingCompanyPrompt = `${impactPrompt}
  
  ${impactOutput.text}
  
  Based on the above data Is there any companies working on this idea: `;

  const existingCompanyCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: existingCompanyPrompt,
    temperature: 0.7,
    max_tokens: 250
  });

  const existingCompanyOutput = existingCompanyCompletion.data.choices.pop();
  console.log(existingCompanyOutput);

  const namePrompt = `${existingCompanyPrompt}
  
  ${existingCompanyOutput.text}
  
  Based on the above data suggest a unique cool name for the startup: `;

  const namePromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: namePrompt,
    temperature: 0.7,
    max_tokens: 250
  });

  const nameOutput = namePromptCompletion.data.choices.pop();
  console.log("Name........", nameOutput)

  res.status(200).json({ 
    name: nameOutput.text,
    idea: basePromptOutput.text,
    marketInfo: marketInfoOutput.text,
    problemSolve: problemSolveOutput.text,
    impact: impactOutput.text,
    existingCompany: existingCompanyOutput.text
  });
};

export default generateAction;