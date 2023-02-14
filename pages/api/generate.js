import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const trait = req.body.trait || '';
  if (trait.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid trait to compliment",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(trait),
      temperature: 0.6,
    });
    console.log("zac", completion)
    res.status(200).json({ result: completion.data.choices[0].text });

  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(traitToCompliment) {
  const capitalizedTrait =
    traitToCompliment[0].toUpperCase() + traitToCompliment.slice(1).toLowerCase();
  return `Give three compliments on a given trait

Trait: Clothes
Compliment: You are wearing a nice shirt!, I like your shoes!, those are some sweet pants!
Trait: Hair
Compliment: Your hair is amazing!, I love your hair!, You have the hair of a Godess!
Trait: ${capitalizedTrait}
Compliment:`;
}
